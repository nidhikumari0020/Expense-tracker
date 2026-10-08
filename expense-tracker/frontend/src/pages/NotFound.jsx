import { Link } from 'react-router-dom';
import Button from '../component/ui/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center max-w-md">
        <h1 className="text-7xl font-bold text-[var(--color-text)] tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-text)] mt-3">
          Page not found
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={Home} size="md">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
