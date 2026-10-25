'use client';
import { useRef, useState } from 'react';
import Icon from './Icon';

/**
 * Image that shows a shimmer placeholder while loading and a neutral icon if the
 * source is missing or fails. The wrapper owns the size; pass sizing/rounding classes via `className`.
 *
 * `checkStatus`: some CDNs (e.g. dummyjson for FreeAPI's products) answer missing files with a
 * placeholder PNG and a 404, which still fires onLoad. With this flag the image stays hidden
 * until a HEAD request confirms the URL actually exists.
 */
export default function ShimmerImage(props) {
  // Remount on src change so the loading state resets
  return <ImageInner key={props.src || 'none'} {...props} />;
}

function ImageInner({ src, alt = '', className = '', fit = 'cover', fallbackIcon = 'image', checkStatus = false, onFailed }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');
  const settled = useRef(false);

  const fail = () => {
    setStatus('error');
    onFailed?.(src);
  };

  const markLoaded = () => {
    if (settled.current) return;
    settled.current = true;
    if (!checkStatus) {
      setStatus('loaded');
      return;
    }
    fetch(src, { method: 'HEAD' }).then(
      (res) => (res.ok ? setStatus('loaded') : fail()),
      () => setStatus('loaded'), // can't verify (network/CORS); trust the decoded image
    );
  };

  // Cached images can finish before React attaches onLoad
  const handleRef = (img) => {
    if (img?.complete && img.naturalWidth > 0) markLoaded();
  };

  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {status === 'loading' && <div className="shimmer absolute inset-0" />}
      {status === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center text-subtle">
          <Icon name={fallbackIcon} className="w-6 h-6 opacity-60" strokeWidth={1.5} />
        </div>
      ) : (
        <img
          ref={handleRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={markLoaded}
          onError={() => {
            settled.current = true;
            fail();
          }}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
            fit === 'contain' ? 'object-contain p-3' : 'object-cover'
          } ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
