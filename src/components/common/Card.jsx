import React from 'react';

export default function Card({ children, title, className = '', headerAction, ...props }) {
  return (
    <div className={`bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 ${className}`} {...props}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          {title && <h3 className="text-xl sm:text-2xl font-bold text-primary-deep">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
