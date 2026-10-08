export const Card = ({
  children,
  className = '',
  padding = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] transition-all duration-150 ${
        padding ? 'p-4 sm:p-6' : ''
      } ${onClick ? 'cursor-pointer hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border)] ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-base sm:text-lg font-semibold text-[var(--color-text)] tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p
    className={`text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`flex items-center justify-end pt-4 mt-4 border-t border-[var(--color-border)] gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
