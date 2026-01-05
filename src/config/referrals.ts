import type { AppLocale } from "./i18n";
import { paths } from "./paths";

const DEFAULT_REFERER_POINTS = 120;
const DEFAULT_REFEREE_POINTS = 60;

export const REFERRAL_REFERER_POINTS = Number(
  process.env.REFERRAL_REFERER_POINTS ?? DEFAULT_REFERER_POINTS
);
export const REFERRAL_REFEREE_POINTS = Number(
  process.env.REFERRAL_REFEREE_POINTS ?? DEFAULT_REFEREE_POINTS
);

export function getReferralRewards() {
  return {
    referer: Math.max(0, REFERRAL_REFERER_POINTS),
    referee: Math.max(0, REFERRAL_REFEREE_POINTS),
  };
}

export function generateReferralCode(userId: string) {
  const suffix = userId.slice(-4).toUpperCase();
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ALK-${suffix}-${random}`;
}

export function formatReferralUrl(code: string, lang: AppLocale) {
  return `${paths.public.home(lang)}?ref=${code}`;
}
