import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex justify-center items-center border font-medium rounded-md focus:outline-none transition-colors';
    
    // We'll keep these classes for structure but apply colors via inline styles
    const variantClasses = {
      primary: 'border-transparent',
      secondary: 'border-gray-300',
      danger: 'border-transparent',
      ghost: 'border-transparent',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    // Get explicit button styles based on variant
    const getButtonStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--input-bg)',
            color: 'var(--primary-text)',
            borderColor: 'var(--border-color)',
          };
        case 'danger':
          return {
            backgroundColor: 'var(--delete-button-bg)',
            color: 'var(--delete-button-text)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--primary-text)',
          };
        default:
          return {};
      }
    };

    const buttonStyles = getButtonStyles();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isLoading || props.disabled}
        style={buttonStyles}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 