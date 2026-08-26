/**
 * Ad integration point for the "download → ad → download" flow.
 *
 * IMPORTANT: No ad provider is wired in yet, and this project deliberately
 * does not simulate one — a fake ad experience would misrepresent real
 * inventory and could violate an ad network's policy. Until you add a real,
 * approved provider:
 *
 *   - runAdExperience() resolves immediately, so downloads work normally
 *     for every visitor (nobody sees a broken or fake ad step).
 *
 * To wire up a real provider later:
 *   1. Set NEXT_PUBLIC_AD_PROVIDER in your env to the provider's identifier.
 *   2. Replace the body of runAdExperience() with that provider's official
 *      SDK/embed call, following their current approved ad format — e.g.
 *      "show a rewarded/interstitial unit and resolve when it completes or
 *      is closed."
 *   3. Server-side admin bypass already exists independently of this file:
 *      every download-count increment and the admin dashboard both key off
 *      the verified session cookie (see lib/auth.ts), not a client flag, so
 *      a visitor can't spoof admin status by editing frontend state.
 */
export async function runAdExperience(): Promise<void> {
  const provider = process.env.NEXT_PUBLIC_AD_PROVIDER;
  if (!provider) return; // no provider configured — proceed straight to download
  // Real integration goes here once a provider is chosen.
  return;
}
