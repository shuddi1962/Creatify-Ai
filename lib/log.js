const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'] || 1;

function formatEntry(level, message, meta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && Object.keys(meta).length ? { meta } : {}),
  };
  if (typeof globalThis !== 'undefined' && globalThis.__opencode_logs) {
    if (!globalThis.__opencode_logs[Symbol.iterator]) globalThis.__opencode_logs = [];
    globalThis.__opencode_logs.push(entry);
  }
  return entry;
}

function log(level, message, meta) {
  if (LOG_LEVELS[level] < CURRENT_LEVEL) return;
  const entry = formatEntry(level, message, meta);
  const label = `[${level.toUpperCase()}]`;
  switch (level) {
    case 'error': console.error(label, message, meta || ''); break;
    case 'warn': console.warn(label, message, meta || ''); break;
    default: console.log(label, message, meta || '');
  }
}

export const logger = {
  debug: (msg, meta) => log('debug', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
};

export function getRecentLogs(count = 100) {
  const logs = (typeof globalThis !== 'undefined' && globalThis.__opencode_logs) || [];
  return logs.slice(-count);
}
