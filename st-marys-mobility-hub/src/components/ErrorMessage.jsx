import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
