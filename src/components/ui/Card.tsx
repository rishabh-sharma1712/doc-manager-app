import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  className = '',
  hover = false,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-lg' : '';
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <div className={cardClasses}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card; 