import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base = "inline-flex items-center justify-center font-bold rounded-2xl transition-all-smooth focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-lg px-6 py-4.5 min-h-[54px]";
  
  const variants = {
    primary: "bg-primary-brand hover:bg-primary-deep text-white shadow-md hover:shadow-lg active:scale-98",
    secondary: "bg-white hover:bg-gray-100 text-primary-brand border-2 border-primary-brand/30 hover:border-primary-brand shadow-sm active:scale-98",
    success: "bg-success-trust hover:bg-[#008c63] text-white shadow-md hover:shadow-lg active:scale-98",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:scale-98",
    light: "bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm active:scale-98",
    link: "text-primary-brand hover:underline p-0 min-h-0 font-semibold shadow-none bg-transparent hover:bg-transparent"
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
