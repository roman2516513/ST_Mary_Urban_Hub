import React from 'react';

export default function EmptyState({ title = 'Nothing here', children }) {
  return (
    <div className="empty-state text-center py-4">
      <h3>{title}</h3>
      {children && <p className="text-muted">{children}</p>}
    </div>
  );
}
