import React from 'react';
import { Check } from 'lucide-react';

export default function Timeline({ steps, currentStep }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-success-trust border-success-trust text-white'
                      : isActive
                      ? 'bg-white border-primary-brand text-primary-brand scale-110 shadow-md ring-4 ring-primary-brand/10'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 stroke-[3px]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-3 text-sm sm:text-base font-bold text-center ${
                    isActive
                      ? 'text-primary-brand font-black'
                      : isCompleted
                      ? 'text-success-trust'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-xs text-gray-400 mt-1 max-w-[120px] text-center hidden sm:block">
                  {step.description}
                </span>
              </div>

              {/* Line Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1.5 rounded-full mx-2 -mt-10 transition-all duration-300 ${
                    index < currentStep ? 'bg-success-trust' : 'bg-gray-250 bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
