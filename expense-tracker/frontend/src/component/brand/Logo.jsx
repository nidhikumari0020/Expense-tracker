/**
 * Brand mark: a minimal wallet with an upward growth line.
 * Pure SVG, colors come from theme tokens so it works in light and dark mode.
 */
export const LogoMark = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    role="img"
    aria-label="Smart Expense Tracker logo"
    className={className}
  >
    <rect width="32" height="32" rx="9" fill="var(--color-brand-from)" />
    <rect x="1" y="1" width="30" height="30" rx="8" stroke="var(--color-brand-to)" strokeOpacity="0.45" />
    {/* wallet body */}
    <path
      d="M7 12.5a2.5 2.5 0 0 1 2.5-2.5H21a2 2 0 0 1 2 2v1.5"
      stroke="var(--color-on-brand)"
      strokeOpacity="0.55"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect x="7" y="12.5" width="18" height="11" rx="2.5" stroke="var(--color-on-brand)" strokeWidth="1.6" />
    {/* growth line */}
    <path
      d="M10.5 20.5l3.2-3.2 2.4 2.2 4.4-4.6"
      stroke="var(--color-brand-to)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18.4 15h2.6v2.6" stroke="var(--color-brand-to)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default LogoMark;
