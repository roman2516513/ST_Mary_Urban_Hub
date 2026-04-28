import React from 'react';

export default function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      {icon && <span className="stat-icon">{icon}</span>}
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
