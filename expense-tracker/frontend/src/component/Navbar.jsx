import { useNavigate } from 'react-router-dom';
import LogoMark from './brand/Logo';
import ThemeToggle from './ui/ThemeToggle';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 sm:px-6 flex items-center justify-between">
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 cursor-pointer select-none"
      >
        <LogoMark size={32} />
        <span className="text-sm font-bold tracking-tight text-[var(--color-text)]">
          Smart Expense Tracker
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Navbar;