'use client';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import { buttonStyles } from './ui';

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true))}
      className={buttonStyles()}
      aria-live="polite"
    >
      <Icon name={copied ? 'check' : 'copy'} className={`w-4 h-4 ${copied ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
      {copied ? 'Copied' : label}
    </button>
  );
}
