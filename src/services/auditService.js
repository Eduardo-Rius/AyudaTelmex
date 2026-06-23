// src/services/auditService.js

// Simple audit logger that writes entries to localStorage under the key 'auditLogs'.
// Each entry contains the fields required by the specification.

/** Create an audit log entry. */
export const createAuditLog = (payload) => {
  const logsKey = 'auditLogs';
  const existing = JSON.parse(localStorage.getItem(logsKey)) || [];
  const entry = {
    action: payload.action || '',
    module: payload.module || '',
    associateId: payload.associateId || '',
    entityId: payload.entityId || '',
    user: payload.user || '',
    timestamp: new Date().toISOString(),
    previousData: payload.previousData || null,
    newData: payload.newData || null,
    browser: navigator.userAgent || null,
    device: navigator.platform || null,
    ip: null, // IP not available in client-side context.
  };
  const updated = [...existing, entry];
  localStorage.setItem(logsKey, JSON.stringify(updated));
  return entry;
};

export default { createAuditLog };
