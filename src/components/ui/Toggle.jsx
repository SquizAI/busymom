import React from 'react';

const Toggle = ({ enabled, onChange, label, size = "md" }) => {
  // Size variants
  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      thumb: "h-3 w-3",
      translate: enabled ? "translate-x-4" : "translate-x-1"
    },
    md: {
      track: "w-10 h-5",
      thumb: "h-4 w-4",
      translate: enabled ? "translate-x-5" : "translate-x-1"
    },
    lg: {
      track: "w-12 h-6",
      thumb: "h-5 w-5",
      translate: enabled ? "translate-x-6" : "translate-x-1"
    }
  };

  const variant = sizeClasses[size];

  return (
    <div className="flex items-center">
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700">{label}</span>
      )}
      <button
        type="button"
        className={`relative inline-flex ${variant.track} flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`${variant.translate} pointer-events-none inline-block ${variant.thumb} rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle;
