/**
 * Ad integration for the "download → ad → download" flow.
 *
 * SMARTLINK_URL: Adsterra Direct Link/SmartLink URL.
 * Change only this constant to update the ad provider.
 *
 * No frequency cap — ad shown on every download.
 * Admin bypass: handled in GalleryGrid.tsx (if !isAdmin).
 */

const SMARTLINK_URL = 'https://www.profitableratecpmnetwork.com/xfnc7gci3v?key=ab60954a888a1ca110b4c820f6fcee81';

export async function runAdExperience(): Promise<void> {
  try {
    window.open(SMARTLINK_URL, '_blank', 'noopener,noreferrer');
  } catch {}
}
