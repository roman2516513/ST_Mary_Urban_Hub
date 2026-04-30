import React from 'react';

export default function PageHero({ title, subtitle }) {
  return (
    <div className="page-hero py-4">
      <h1 className="display-6">{title}</h1>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  );
}
