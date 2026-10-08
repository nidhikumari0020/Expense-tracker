export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-[var(--color-border)] rounded-[var(--radius-md)] ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] flex flex-col gap-4 ${className}`}
  >
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-[var(--radius-md)]" />
    </div>
    <div className="flex flex-col gap-2 mt-2">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center justify-between py-3.5 px-4 border-b border-[var(--color-border)]">
    <div className="flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-[var(--radius-md)]" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-7 rounded-[var(--radius-sm)]" />
    </div>
  </div>
);

export default Skeleton;
