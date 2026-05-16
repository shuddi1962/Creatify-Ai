import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
function getClient() {
  if (!supabase && SUPABASE_URL && SERVICE_KEY) {
    supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  }
  return supabase;
}

export async function writeAuditLog({ adminId, action, targetType, targetId, metadata }) {
  try {
    const client = getClient();
    if (!client) return;
    await client.from('audit_logs').insert({
      admin_id: adminId || null,
      action: action || 'unknown',
      target_type: targetType || null,
      target_id: targetId ? String(targetId) : null,
      metadata: metadata || null,
    });
  } catch { /* silently fail */ }
}

export async function writeUserAction({ userId, action, metadata }) {
  try {
    const client = getClient();
    if (!client) return;
    await client.from('audit_logs').insert({
      admin_id: userId,
      action,
      target_type: 'user_action',
      target_id: userId,
      metadata,
    });
  } catch { /* silently fail */ }
}
