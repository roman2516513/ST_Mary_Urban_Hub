import React from 'react';

export default function StatusPill({ status }) {
  const cls = status === 'Good' ? 'badge bg-success' : 'badge bg-secondary';
  return <span className={cls}>{status}</span>;
}
