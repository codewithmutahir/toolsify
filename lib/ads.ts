export function areAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
}
