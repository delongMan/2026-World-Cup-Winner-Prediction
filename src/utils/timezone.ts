import type { MatchDate, Lang } from '../types';

// Language → IANA timezone mapping
const LANG_TZ: Partial<Record<Lang, string>> = {
  en: 'America/New_York',
  'zh-CN': 'Asia/Shanghai',
  'zh-TW': 'Asia/Taipei',
  es: 'Europe/Madrid',
  pt: 'America/Sao_Paulo',
  fr: 'Europe/Paris',
  de: 'Europe/Berlin',
  nl: 'Europe/Amsterdam',
  it: 'Europe/Rome',
  sv: 'Europe/Stockholm',
  no: 'Europe/Oslo',
  hr: 'Europe/Zagreb',
  bs: 'Europe/Sarajevo',
  ja: 'Asia/Tokyo',
  ko: 'Asia/Seoul',
  ar: 'Asia/Riyadh',
};

// Timezone short names for display
const TZ_LABEL: Partial<Record<Lang, string>> = {
  en: 'EDT', 'zh-CN':'CST', 'zh-TW':'CST', es:'CEST', pt:'BRT', fr:'CEST', de:'CEST',
  nl:'CEST', it:'CEST', sv:'CEST', no:'CEST', hr:'CEST', bs:'CEST',
  ja:'JST', ko:'KST', ar:'AST',
};

/** Parse EDT match date and convert to the target language's timezone */
export function formatMatchTime(md: MatchDate | null, lang: Lang): string {
  if (!md) return '';
  const [m, d] = md.date.split('/').map(Number);
  const isPM = md.time.includes('PM');
  const [hStr, mStr] = md.time.replace(/[AP]M/, '').split(':');
  let h = parseInt(hStr);
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  const min = parseInt(mStr) || 0;

  // Create UTC timestamp from EDT (UTC-4)
  const dt = new Date(Date.UTC(2026, m - 1, d, h + 4, min));

  const tz = LANG_TZ[lang] || 'America/New_York';

  try {
    const fmt = new Intl.DateTimeFormat(lang === 'zh-CN' || lang === 'zh-TW' ? lang : 'en', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${fmt.format(dt)} ${TZ_LABEL[lang] || ''}`;
  } catch {
    // Fallback for browsers without timezone support
    const lh = dt.getHours();
    const lm = dt.getMinutes().toString().padStart(2, '0');
    const ap = lh >= 12 ? 'PM' : 'AM';
    const dh = lh % 12 || 12;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[dt.getMonth()]} ${dt.getDate()} ${dh}:${lm} ${ap}`;
  }
}
