'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { AuthLayout, Field, FormMessage, PasswordField } from '../../src/components/AuthForm';
import { Spinner, buttonStyles } from '../../src/components/ui';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      if (response.success) {
        router.push('/login?registered=true');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        setError(Object.values(errors[0])[0]);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon="userPlus"
      title="Create an account"
      subtitle="Register to chat with other FreeAPI users."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-accent-text hover:underline">
            Sign in
          </Link>
        </>
      }
    >
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
          required
        />
        <Field
          id="username"
          label="Username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          hint="At least 3 characters."
          minLength={3}
          required
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          hint="At least 6 characters."
          minLength={6}
          required
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <button type="submit" disabled={loading} className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full' })}>
          {loading && <Spinner />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
