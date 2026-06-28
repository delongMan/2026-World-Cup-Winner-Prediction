import type { MatchDate } from '../types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/** Parse EDT match date and convert to local timezone format */
export function formatMatchTime(md: MatchDate | null): string {
  if (!md) return '';
  const [m, d] = md.date.split('/').map(Number);
  // Parse EDT time (UTC-4)
  const isPM = md.time.includes('PM');
  const [hStr, mStr] = md.time.replace(/[AP]M/, '').split(':');
  let h = parseInt(hStr);
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  const min = parseInt(mStr) || 0;

  // Create date in EDT (UTC-4) — month is 0-indexed, year 2026
  const dt = new Date(Date.UTC(2026, m - 1, d, h + 4, min)); // +4 for EDT→UTC

  const localHour = dt.getHours();
  const localMin = dt.getMinutes().toString().padStart(2, '0');
  const localAmPm = localHour >= 12 ? 'PM' : 'AM';
  const displayHour = localHour % 12 || 12;
  const localDate = `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;

  return `${localDate} ${displayHour}:${localMin} ${localAmPm}`;
}
