import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { job_id } = await req.json()
  if (!job_id) return new Response(JSON.stringify({ error: 'Missing job_id' }), { status: 400 })

  try {
    const { data: job } = await supabase
      .from('bulk_jobs')
      .select('*, bulk_job_items(*)')
      .eq('id', job_id)
      .single()

    if (!job) return new Response(JSON.stringify({ error: 'Job not found' }), { status: 404 })
    if (job.status !== 'queued') return new Response(JSON.stringify({ status: job.status }))

    await supabase.from('bulk_jobs').update({ status: 'processing' }).eq('id', job_id)

    const muapiKey = Deno.env.get('MUAPI_KEY')
    let completed = 0, failed = 0

    for (const item of job.bulk_job_items || []) {
      try {
        if (muapiKey && job.type === 'image') {
          const res = await fetch('https://api.muapi.ai/api/v1/flux', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': muapiKey },
            body: JSON.stringify({ prompt: item.prompt, aspect_ratio: '1:1' }),
          })
          const data = await res.json()
          const resultUrl = data.outputs?.[0] || data.url || ''

          await supabase.from('bulk_job_items').update({
            status: 'completed', result_url: resultUrl, completed_at: new Date().toISOString(),
          }).eq('id', item.id)
          completed++
        } else {
          // Simulated processing for demo
          await new Promise(r => setTimeout(r, 1000))
          await supabase.from('bulk_job_items').update({
            status: 'completed', completed_at: new Date().toISOString(),
          }).eq('id', item.id)
          completed++
        }
      } catch {
        await supabase.from('bulk_job_items').update({
          status: 'failed', error: 'Processing error', completed_at: new Date().toISOString(),
        }).eq('id', item.id)
        failed++
      }

      await supabase.from('bulk_jobs').update({
        completed, failed,
        status: completed + failed >= (job.bulk_job_items?.length || 0) ? 'completed' : 'processing',
      }).eq('id', job_id)
    }

    return new Response(JSON.stringify({ job_id, status: 'completed', completed, failed }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
