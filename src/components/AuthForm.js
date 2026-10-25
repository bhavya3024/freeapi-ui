'use client';
import { useState } from 'react';
import Icon from './Icon';
import { cardStyles, inputStyles } from './ui';

export function AuthLayout({ icon, title, subtitle, notice, children, footer }) {
  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center py-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-sm">
            <Icon name={icon} className="w-5 h-5" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        {notice}
        <div className={`${cardStyles} mt-6 p-6 shadow-sm`}>{children}</div>
        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
}

/** Labelled input. `loading` lays a shimmer over the field while its value is being fetched. */
export function Field({ id, label, hint, loading = false, trailing, className = '', ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputStyles} h-10 w-full px-3 ${trailing ? 'pr-11' : ''}`}
          {...inputProps}
        />
        {loading && <div aria-hidden="true" className="shimmer absolute inset-0 rounded-lg" />}
        {trailing && !loading && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}

export function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-subtle transition-colors hover:text-fg"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} />
        </button>
      }
      {...props}
    />
  );
}

export function FormMessage({ tone = 'error', children }) {
  const styles =
    tone === 'success'
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300';
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${styles}`}>
      <Icon name={tone === 'success' ? 'check' : 'alert'} className="mt-0.5 w-4 h-4" />
      <span>{children}</span>
    </div>
  );
}
