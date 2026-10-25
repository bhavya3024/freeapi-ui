'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { getGeneratedCredentials } from '../../src/apis/auth';
import { AuthLayout, Field, FormMessage, PasswordField } from '../../src/components/AuthForm';
import Icon from '../../src/components/Icon';
import { Spinner, buttonStyles } from '../../src/components/ui';

// Register redirects here with ?registered=true
function RegisteredNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get('registered') !== 'true') return null;
  return (
    <div className="mt-6">
      <FormMessage tone="success">Account created. Sign in with your new credentials.</FormMessage>
    </div>
  );
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseGeneratedCredentials = async () => {
    setCredentialsLoading(true);
    setError('');
    try {
      const response = await getGeneratedCredentials();
      if (response.success && response.data) {
        setFormData({
          email: response.data.email || '',
          username: response.data.username || '',
          password: response.data.password || '',
        });
      } else {
        setError('Failed to fetch generated credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch generated credentials');
    } finally {
      setCredentialsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      if (response.success) {
        router.push('/chat');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || credentialsLoading;

  return (
    <AuthLayout
      icon="lock"
      title="Welcome back"
      subtitle="Sign in to use the real-time chat app."
      notice={
        <Suspense fallback={null}>
          <RegisteredNotice />
        </Suspense>
      }
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-accent-text hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={handleUseGeneratedCredentials}
        disabled={busy}
        className={buttonStyles({ className: 'w-full' })}
      >
        {credentialsLoading ? <Spinner /> : <Icon name="key" />}
        {credentialsLoading ? 'Generating test account…' : 'Fill in generated test credentials'}
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-line" />
        or sign in manually
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <FormMessage>{error}</FormMessage>}
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          loading={credentialsLoading}
          required
        />
        <Field
          id="username"
          label="Username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          loading={credentialsLoading}
          required
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          loading={credentialsLoading}
          required
        />
        <button type="submit" disabled={busy} className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full' })}>
          {loading && <Spinner />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
