/**
 * Ad integration for the "download → ad → download" flow.
 *
 * SMARTLINK_URL: Adsterra Direct Link/SmartLink URL.
 * Change only this constant to update the ad provider.
 *
 * Frequency cap: ad shown at most once per 30 minutes per browser session.
 * Admin bypass: handled in GalleryGrid.tsx (if !isAdmin).
 */

const SMARTLINK_URL = 'https://www.profitableratecpmnetwork.com/xfnc7gci3v?key=ab60954a888a1ca110b4c820f6fcee81';
const FREQ_CAP_MS = 30 * 60 * 1000; // 30 minutes
const LAST_AD_KEY = 'ag_last_ad';

function shouldShowAd(): boolean {
  try {
    const last = localStorage.getItem(LAST_AD_KEY);
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > FREQ_CAP_MS;
  } catch {
    return true;
  }
}

function markAdShown(): void {
  try {
    localStorage.setItem(LAST_AD_KEY, String(Date.now()));
  } catch {}
}

export async function runAdExperience(): Promise<void> {
  if (!shouldShowAd()) return;
  try {
    window.open(SMARTLINK_URL, '_blank', 'noopener,noreferrer');
  } catch {}
  markAdShown();
}
