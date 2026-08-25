'use client';

import { useEffect, useState } from 'react';

export function useAdminSession() {
  const [state, setState] = useState<{ loading: boolean; authenticated: boolean; username?: string }>({
    loading: true,
    authenticated: false
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setState({ loading: false, authenticated: !!data.authenticated, username: data.username });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, authenticated: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
