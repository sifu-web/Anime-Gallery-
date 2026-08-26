'use client';

import { useEffect, useState } from 'react';

export default function InAppBrowserWarning() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isInApp = /FBAN|FBAV|Instagram|Line\/|Messenger/i.test(ua);
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
    <div className="fixed inset-x-0 top-0 z-[100] bg-sakura text-void px-4 py-3 text-sm font-medium flex flex-col gap-2 shadow-lg">
      <p>
        Downloads may not work in this in-app browser. For the best experience, open this page in{' '}
        {platform === 'android' ? 'Chrome' : 'Safari'}.
      </p>
      {platform === 'android' ? (
        <button
          onClick={openInChrome}
          className="self-start rounded-full bg-void text-white px-4 py-1.5 text-xs font-bold"
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
