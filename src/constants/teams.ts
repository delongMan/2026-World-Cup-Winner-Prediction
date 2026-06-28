import type { Team } from '../types';

function f(iso: string): string {
  return `https://flagcdn.com/w80/${iso}.png`;
}

export const ALL_TEAMS: Team[] = [
  { id: 'ger', name: 'Germany', nameZh: '德国', flagEmoji: '🇩🇪', flagUrl: f('de') },
  { id: 'par', name: 'Paraguay', nameZh: '巴拉圭', flagEmoji: '🇵🇾', flagUrl: f('py') },
  { id: 'fra', name: 'France', nameZh: '法国', flagEmoji: '🇫🇷', flagUrl: f('fr') },
  { id: 'swe', name: 'Sweden', nameZh: '瑞典', flagEmoji: '🇸🇪', flagUrl: f('se') },
  { id: 'rsa', name: 'South Africa', nameZh: '南非', flagEmoji: '🇿🇦', flagUrl: f('za') },
  { id: 'can', name: 'Canada', nameZh: '加拿大', flagEmoji: '🇨🇦', flagUrl: f('ca') },
  { id: 'ned', name: 'Netherlands', nameZh: '荷兰', flagEmoji: '🇳🇱', flagUrl: f('nl') },
  { id: 'mar', name: 'Morocco', nameZh: '摩洛哥', flagEmoji: '🇲🇦', flagUrl: f('ma') },
  { id: 'por', name: 'Portugal', nameZh: '葡萄牙', flagEmoji: '🇵🇹', flagUrl: f('pt') },
  { id: 'cro', name: 'Croatia', nameZh: '克罗地亚', flagEmoji: '🇭🇷', flagUrl: f('hr') },
  { id: 'esp', name: 'Spain', nameZh: '西班牙', flagEmoji: '🇪🇸', flagUrl: f('es') },
  { id: 'aut', name: 'Austria', nameZh: '奥地利', flagEmoji: '🇦🇹', flagUrl: f('at') },
  { id: 'usa', name: 'United States', nameZh: '美国', flagEmoji: '🇺🇸', flagUrl: f('us') },
  { id: 'bih', name: 'Bosnia-Herz', nameZh: '波黑', flagEmoji: '🇧🇦', flagUrl: f('ba') },
  { id: 'bel', name: 'Belgium', nameZh: '比利时', flagEmoji: '🇧🇪', flagUrl: f('be') },
  { id: 'sen', name: 'Senegal', nameZh: '塞内加尔', flagEmoji: '🇸🇳', flagUrl: f('sn') },
  { id: 'bra', name: 'Brazil', nameZh: '巴西', flagEmoji: '🇧🇷', flagUrl: f('br') },
  { id: 'jpn', name: 'Japan', nameZh: '日本', flagEmoji: '🇯🇵', flagUrl: f('jp') },
  { id: 'civ', name: 'Ivory Coast', nameZh: '科特迪瓦', flagEmoji: '🇨🇮', flagUrl: f('ci') },
  { id: 'nor', name: 'Norway', nameZh: '挪威', flagEmoji: '🇳🇴', flagUrl: f('no') },
  { id: 'mex', name: 'Mexico', nameZh: '墨西哥', flagEmoji: '🇲🇽', flagUrl: f('mx') },
  { id: 'ecu', name: 'Ecuador', nameZh: '厄瓜多尔', flagEmoji: '🇪🇨', flagUrl: f('ec') },
  { id: 'eng', name: 'England', nameZh: '英格兰', flagEmoji: '🇬🇧', flagUrl: f('gb-eng') },
  { id: 'cod', name: 'Congo DR', nameZh: '刚果民主', flagEmoji: '🇨🇩', flagUrl: f('cd') },
  { id: 'arg', name: 'Argentina', nameZh: '阿根廷', flagEmoji: '🇦🇷', flagUrl: f('ar') },
  { id: 'cpv', name: 'Cape Verde', nameZh: '佛得角', flagEmoji: '🇨🇻', flagUrl: f('cv') },
  { id: 'aus', name: 'Australia', nameZh: '澳大利亚', flagEmoji: '🇦🇺', flagUrl: f('au') },
  { id: 'egy', name: 'Egypt', nameZh: '埃及', flagEmoji: '🇪🇬', flagUrl: f('eg') },
  { id: 'sui', name: 'Switzerland', nameZh: '瑞士', flagEmoji: '🇨🇭', flagUrl: f('ch') },
  { id: 'alg', name: 'Algeria', nameZh: '阿尔及利亚', flagEmoji: '🇩🇿', flagUrl: f('dz') },
  { id: 'col', name: 'Colombia', nameZh: '哥伦比亚', flagEmoji: '🇨🇴', flagUrl: f('co') },
  { id: 'gha', name: 'Ghana', nameZh: '加纳', flagEmoji: '🇬🇭', flagUrl: f('gh') },
];

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id);
}
