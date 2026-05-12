const { Client } = require('pg');

async function fix() {
  const client = new Client({
    user: 'postgres.xuhsjvipmwzpmsbpjpgq',
    password: process.argv[2] || '07039Suco2004$#',
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await client.connect();
  console.log('Connected');

  // Fix: Add INSERT WITH CHECK policies for admin tables
  // PostgreSQL FOR ALL USING does NOT apply to INSERT - it needs WITH CHECK
  
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert provider keys') THEN
        CREATE POLICY "Admin insert provider keys" ON admin_provider_keys
          FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
      END IF;
    END $$;
  `);
  console.log('Added admin_provider_keys INSERT policy');

  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert providers') THEN
        CREATE POLICY "Admin insert providers" ON api_providers
          FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
      END IF;
    END $$;
  `);
  console.log('Added api_providers INSERT policy');

  // Add is_default column to admin_provider_keys if not exists
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_provider_keys' AND column_name = 'is_default') THEN
        ALTER TABLE admin_provider_keys ADD COLUMN is_default boolean DEFAULT false;
      END IF;
    END $$;
  `);
  console.log('Added is_default column to admin_provider_keys');

  // Seed all 20 providers if they don't exist
  await client.query(`
    INSERT INTO api_providers (name, display_name, base_url) VALUES
      ('muapi', 'Muapi AI', 'https://api.muapi.ai'),
      ('openrouter', 'OpenRouter', 'https://openrouter.ai/api/v1'),
      ('kie-ai', 'Kie AI', 'https://api.kie.ai/v1'),
      ('openai', 'OpenAI', 'https://api.openai.com/v1'),
      ('anthropic', 'Anthropic (Claude)', 'https://api.anthropic.com/v1'),
      ('elevenlabs', 'ElevenLabs', 'https://api.elevenlabs.io/v1'),
      ('stability', 'Stability AI', 'https://api.stability.ai/v1'),
      ('replicate', 'Replicate', 'https://api.replicate.com/v1'),
      ('deepseek', 'DeepSeek', 'https://api.deepseek.com/v1'),
      ('mistral', 'Mistral AI', 'https://api.mistral.ai/v1'),
      ('cohere', 'Cohere', 'https://api.cohere.ai/v1'),
      ('perplexity', 'Perplexity', 'https://api.perplexity.ai'),
      ('groq', 'Groq', 'https://api.groq.com/openai/v1'),
      ('together', 'Together AI', 'https://api.together.xyz/v1'),
      ('fireworks', 'Fireworks AI', 'https://api.fireworks.ai/inference/v1'),
      ('tavily', 'Tavily AI', 'https://api.tavily.com'),
      ('serpapi', 'SerpAPI (Google Trends)', 'https://serpapi.com'),
      ('huggingface', 'HuggingFace', 'https://api-inference.huggingface.co'),
      ('google-ai', 'Google AI (Gemini)', 'https://generativelanguage.googleapis.com/v1'),
      ('lemonfox', 'LemonFox', 'https://api.lemonfox.ai/v1')
    ON CONFLICT (name) DO NOTHING;
  `);
  console.log('Seeded all 20 providers');

  await client.end();
  console.log('DONE - RLS fixes applied, providers seeded');
}

fix().catch(e => { console.error('Error:', e.message); process.exit(1); });
