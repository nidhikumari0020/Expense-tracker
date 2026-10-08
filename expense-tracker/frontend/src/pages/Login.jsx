import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Input from '../component/ui/Input';
import Button from '../component/ui/Button';
import Card from '../component/ui/Card';
import LogoMark from '../component/brand/Logo';
import ThemeToggle from '../component/ui/ThemeToggle';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      await login(formData);
      toast.success('Signed in successfully');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <LogoMark size={48} />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            Sign in to access your personal expense ledger
          </p>
        </div>

        {/* Card Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {serverError && (
              <div
                role="alert"
                className="p-3 text-xs text-[var(--color-expense)] bg-[var(--color-expense-bg)] border border-[var(--color-expense)]/20 rounded-[var(--radius-md)]"
              >
                {serverError}
              </div>
            )}

            <Input
              id="login-email"
              name="email"
              type="email"
              label="Email address"
              placeholder="name@example.com"
              required
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              id="login-password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-[var(--color-info)] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
