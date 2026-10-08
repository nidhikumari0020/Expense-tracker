import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
  User,
  LogOut,
} from 'lucide-react';
import LogoMark from './brand/Logo';
import ThemeToggle from './ui/ThemeToggle';

export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { label: 'Expenses', path: '/expenses', icon: TrendingDown },
    { label: 'Income', path: '/income', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const active = navItems.find((item) => item.path === location.pathname);
    return active ? active.label : 'Expense Tracker';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      {/* ================= DESKTOP & TABLET SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen p-5 fixed left-0 top-0 bottom-0 z-30">
        {/* Brand Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <LogoMark size={40} />
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[var(--color-text)]">
                Expense Tracker
              </h1>
              <p className="text-[11px] text-[var(--color-text-subtle)] font-medium">
                Personal Ledger
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-surface-muted)] text-[var(--color-text)] font-semibold border-l-2 border-[var(--color-primary)] -ml-[1px]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Theme toggle + User Profile & Logout Bottom Bar */}
        <div className="flex flex-col gap-4">
        <div className="px-3 flex items-center justify-between gap-3">
          <ThemeToggle />
        </div>
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-contrast)] text-xs font-semibold flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-[var(--color-text-subtle)] truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="p-2 text-[var(--color-text-subtle)] hover:text-[var(--color-expense)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        </div>
      </aside>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="text-sm font-bold text-[var(--color-text)]">
            {getPageTitle()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <button
            onClick={() => navigate('/profile')}
            aria-label="Profile"
            className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-contrast)] text-xs font-semibold flex items-center justify-center"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="p-1.5 text-[var(--color-text-subtle)] hover:text-[var(--color-expense)] rounded-[var(--radius-md)]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8 animate-in fade-in duration-150">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] h-14 px-2 flex items-center justify-around pb-[env(safe-area-inset-bottom)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-[44px] transition-colors ${
                  isActive
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text)]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;