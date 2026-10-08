import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';
import Card, { CardHeader, CardTitle, CardContent } from '../component/ui/Card';
import Input from '../component/ui/Input';
import Button from '../component/ui/Button';
import { User, Mail, Lock, LogOut } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [profileServerError, setProfileServerError] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordServerError, setPasswordServerError] = useState('');

  // Profile validation & submit
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (profileServerError) {
      setProfileServerError('');
    }
  };

  const validateProfile = () => {
    const errs = {};
    if (!profileForm.name || profileForm.name.trim().length === 0) {
      errs.name = 'Full name is required';
    }
    if (!profileForm.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setIsProfileSubmitting(true);
    setProfileServerError('');

    try {
      const updatedUser = await authService.updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
      });
      updateUser(updatedUser);
      toast.success('Profile details updated successfully');
    } catch (err) {
      console.error('Update profile error:', err);
      setProfileServerError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Password validation & submit
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (passwordServerError) {
      setPasswordServerError('');
    }
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordForm.currentPassword) {
      errs.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errs.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errs.newPassword = 'New password must be at least 8 characters long';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsPasswordSubmitting(true);
    setPasswordServerError('');

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordServerError(err.message || 'Failed to change password');
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
          Manage your personal identity credentials and security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Session Actions */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Profile Details Edit Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                  Update your public display name and registered email
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                {profileServerError && (
                  <div
                    role="alert"
                    className="p-3 text-xs text-[var(--color-expense)] bg-[var(--color-expense-bg)] border border-[var(--color-expense)]/20 rounded-[var(--radius-md)]"
                  >
                    {profileServerError}
                  </div>
                )}

                <Input
                  id="profile-name"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={User}
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  error={profileErrors.name}
                  required
                />

                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isProfileSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Overview / Session Card */}
          <Card>
            <CardHeader>
              <CardTitle>Session & Security</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-xs flex flex-col gap-1">
                <span className="font-semibold text-[var(--color-text)]">
                  Active User ID
                </span>
                <span className="text-[var(--color-text-subtle)] font-mono text-[11px] truncate">
                  {user?.id || user?._id || '—'}
                </span>
              </div>

              <Button
                variant="danger"
                icon={LogOut}
                onClick={logout}
                className="w-full justify-center"
              >
                Sign Out of Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Password Change Card */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Change Password</CardTitle>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                  Ensure your account is protected with a secure password
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                {passwordServerError && (
                  <div
                    role="alert"
                    className="p-3 text-xs text-[var(--color-expense)] bg-[var(--color-expense-bg)] border border-[var(--color-expense)]/20 rounded-[var(--radius-md)]"
                  >
                    {passwordServerError}
                  </div>
                )}

                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  required
                />

                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="At least 8 characters"
                  helperText="Minimum 8 characters required"
                  icon={Lock}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  required
                />

                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  icon={Lock}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isPasswordSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
