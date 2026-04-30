import React from 'react';

export default function ApiNotice({ children }) {
  return (
    <div className="alert alert-info api-notice">
      {children}
    </div>
  );
}
