import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div role="status" className={`inline-flex items-center justify-center ${className}`}>
      <Loader2
        className={`animate-spin text-[var(--color-primary)] ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
