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
      const url = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[100] bg-red-600 text-white px-6 py-6 text-base font-semibold flex flex-col gap-4 border-b-4 border-red-900">
      <p className="leading-snug text-xl">
        ⚠️ TikTok and Messenger browser download problem.
        <br />
        Please tap to open in <span className="underline">{platform === 'android' ? 'Chrome' : 'Safari'}</span>.
      </p>
      {platform === 'android' ? (
        <button
          onClick={openInChrome}
          className="self-start rounded-full bg-white text-red-700 px-8 py-3 text-base font-bold"
        >
          Open in Chrome
        </button>
      ) : (
        <p className="text-xs opacity-80">
          Tap the ⋯ or share icon above, then choose &quot;Open in Safari&quot;.
        </p>
      )}
    </div>
  );
}
