import { getPendingJobs as fetchPendingJobs, savePendingJob as storageSave, removePendingJob as storageRemove } from './storage.js'

export async function savePendingJob(job) {
  try { await storageSave(job) } catch {}
  try {
    const jobs = getAllLocal().filter(j => j.requestId !== job.requestId)
    jobs.push(job)
    localStorage.setItem('muapi_pending_jobs', JSON.stringify(jobs))
  } catch {}
}

export async function removePendingJob(requestId) {
  try { await storageRemove(requestId) } catch {}
  try {
    const jobs = getAllLocal().filter(j => j.requestId !== requestId)
    localStorage.setItem('muapi_pending_jobs', JSON.stringify(jobs))
  } catch {}
}

export async function getPendingJobs(studioType) {
  try {
    const fromStorage = await fetchPendingJobs(studioType)
    if (fromStorage.length > 0) return fromStorage
  } catch {}
  const all = getAllLocal()
  return studioType ? all.filter(j => j.studioType === studioType) : all
}

function getAllLocal() {
  try { return JSON.parse(localStorage.getItem('muapi_pending_jobs') || '[]') }
  catch { return [] }
}
