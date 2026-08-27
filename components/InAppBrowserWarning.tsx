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
          <svg viewBox="0 0 192 192" className="h-20 w-20">
            <defs>
              <clipPath id="chromeInner"><circle cx="96" cy="96" r="48" /></clipPath>
            </defs>
            <circle cx="96" cy="96" r="96" fill="#fff" />
            <path d="M96 30a66 66 0 0157.16 33H96a33 33 0 00-28.58 16.5L26.84 45.7A95.86 95.86 0 0196 30z" fill="#EA4335" />
            <path d="M166 96a65.7 65.7 0 01-8.84 33H108a33 33 0 0016.16-25.5L161.16 46.9A95.5 95.5 0 01166 96z" fill="#FBBC04" />
            <path d="M96 166a96 96 0 01-83.16-48L54.42 91.5A33 33 0 0096 129a32.8 32.8 0 0016.16-4.27l32.26 55.86A95.5 95.5 0 0196 166z" fill="#34A853" />
            <circle cx="96" cy="96" r="37" fill="#4285F4" />
            <circle cx="96" cy="96" r="37" fill="none" stroke="#fff" strokeWidth="8" />
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
