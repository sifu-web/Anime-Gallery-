'use client';

import { useEffect, useState } from 'react';

export default function InAppBrowserWarning() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isInApp = /FBAN|FBAV|Instagram|Line\/|Messenger|TikTok|musical_ly|BytedanceWebview/i.test(ua);
    if (!isInApp) return;

    if (/Android/i.test(ua)) setPlatform('android');
    else if (/iPhone|iPad|iPod/i.test(ua)) setPlatform('ios');
    else return;

    setVisible(true);
  }, []);

  if (!visible) return null;

  function openInChrome() {
    if (platform === 'android') {
      const bare = window.location.href.replace(/^https?:\/\//, '');
      // Safer than raw intent:// navigation — some in-app WebViews (e.g. Messenger)
      // hang on unsupported intent:// scheme with no fallback. googlechrome:// fails
      // silently if Chrome isn't installed, and we still open a normal tab as backup.
      window.open(`googlechrome://navigate?url=https://${bare}`, '_blank');
      setTimeout(() => {
        window.open(window.location.href, '_blank');
      }, 400);
    } else {
      window.open(window.location.href, '_blank');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6">
      <div className="relative w-full max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-2xl">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute right-4 top-4 text-2xl leading-none text-gray-500"
        >
          &times;
        </button>

        <div className="mx-auto mb-5 h-20 w-20">
          <svg viewBox="0 0 48 48" className="h-20 w-20">
            <circle cx="24" cy="24" r="24" fill="#fff" />
            <path d="M24 6a18 18 0 0115.59 9H24a9 9 0 00-7.79 4.5L8.41 12A17.94 17.94 0 0124 6z" fill="#EA4335" />
            <path d="M42 24a17.9 17.9 0 01-2.41 9H26.2a9 9 0 004.4-6.94L39.4 12.9A17.94 17.94 0 0142 24z" fill="#FBBC05" />
            <path d="M24 42a17.94 17.94 0 01-15.59-9L16.2 19.5A9 9 0 0024 33a8.9 8.9 0 004.4-1.16l8.79 13.7A17.9 17.9 0 0124 42z" fill="#34A853" />
            <circle cx="24" cy="24" r="9" fill="#4285F4" />
            <circle cx="24" cy="24" r="6.5" fill="#fff" />
            <circle cx="24" cy="24" r="5.2" fill="#4285F4" />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-gray-900">Get the full experience</h2>
        <p className="mb-6 text-sm text-gray-500">
          This link works best in {platform === 'android' ? 'Chrome' : 'Safari'}. Open it there for the fastest experience.
        </p>

        <button
          onClick={openInChrome}
          className="mb-3 w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white"
        >
          Open in {platform === 'android' ? 'Chrome' : 'Safari'}
        </button>

        {platform === 'ios' && (
          <p className="text-xs text-gray-400">
            Tap the ⋯ or share icon above, then choose "Open in Safari".
          </p>
        )}

        <button
          onClick={() => setVisible(false)}
          className="w-full rounded-lg bg-gray-100 py-3 text-base font-medium text-gray-700"
        >
          Continue here
        </button>
      </div>
    </div>
  );
}
