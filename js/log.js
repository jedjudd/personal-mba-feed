// ── AUDIT LOG ─────────────────────────────────────────────────────────────────
const Log = {
  _key: 'mba_audit_log',
  _max: 50,

  _entries() {
    try { return JSON.parse(localStorage.getItem(this._key)) || []; }
    catch { return []; }
  },

  _write(level, msg, detail) {
    const entries = this._entries();
    entries.unshift({ ts: new Date().toISOString(), level, msg, detail: detail || null });
    if (entries.length > this._max) entries.length = this._max;
    try { localStorage.setItem(this._key, JSON.stringify(entries)); } catch {}
  },

  info(msg, detail)  { this._write('info',  msg, detail); },
  warn(msg, detail)  { this._write('warn',  msg, detail); },
  error(msg, detail) { this._write('error', msg, detail); console.error('[MBA]', msg, detail || ''); },

  last(n) { return this._entries().slice(0, n || 10); },

  clear() { localStorage.removeItem(this._key); },
};

// Capture unhandled JS errors
window.addEventListener('error', ev => {
  Log.error(ev.message, `${ev.filename}:${ev.lineno}`);
});
window.addEventListener('unhandledrejection', ev => {
  Log.error('Unhandled promise rejection', String(ev.reason));
});
