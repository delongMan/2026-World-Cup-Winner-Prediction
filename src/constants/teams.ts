import type { Team, Lang } from '../types';

function f(iso: string): string { return `https://flagcdn.com/w80/${iso}.png`; }

function t(en: string, zh: string, es: string, fr: string, de: string, ja: string, ko: string, ar: string): Record<Lang, string> {
  return { en, zh, es, fr, de, ja, ko, ar };
}

export const ALL_TEAMS: Team[] = [
  { id: 'ger', flagEmoji:'🇩🇪', flagUrl:f('de'), group:'I', name:t('Germany','德国','Alemania','Allemagne','Deutschland','ドイツ','독일','ألمانيا') },
  { id: 'par', flagEmoji:'🇵🇾', flagUrl:f('py'), group:'L', name:t('Paraguay','巴拉圭','Paraguay','Paraguay','Paraguay','パラグアイ','파라과이','باراغواي') },
  { id: 'fra', flagEmoji:'🇫🇷', flagUrl:f('fr'), group:'F', name:t('France','法国','Francia','France','Frankreich','フランス','프랑스','فرنسا') },
  { id: 'swe', flagEmoji:'🇸🇪', flagUrl:f('se'), group:'J', name:t('Sweden','瑞典','Suecia','Suède','Schweden','スウェーデン','스웨덴','السويد') },
  { id: 'rsa', flagEmoji:'🇿🇦', flagUrl:f('za'), group:'L', name:t('South Africa','南非','Sudáfrica','Afrique du Sud','Südafrika','南アフリカ','남아프리카','جنوب أفريقيا') },
  { id: 'can', flagEmoji:'🇨🇦', flagUrl:f('ca'), group:'B', name:t('Canada','加拿大','Canadá','Canada','Kanada','カナダ','캐나다','كندا') },
  { id: 'ned', flagEmoji:'🇳🇱', flagUrl:f('nl'), group:'A', name:t('Netherlands','荷兰','Países Bajos','Pays-Bas','Niederlande','オランダ','네덜란드','هولندا') },
  { id: 'mar', flagEmoji:'🇲🇦', flagUrl:f('ma'), group:'C', name:t('Morocco','摩洛哥','Marruecos','Maroc','Marokko','モロッコ','모로코','المغرب') },
  { id: 'por', flagEmoji:'🇵🇹', flagUrl:f('pt'), group:'C', name:t('Portugal','葡萄牙','Portugal','Portugal','Portugal','ポルトガル','포르투갈','البرتغال') },
  { id: 'cro', flagEmoji:'🇭🇷', flagUrl:f('hr'), group:'D', name:t('Croatia','克罗地亚','Croacia','Croatie','Kroatien','クロアチア','크로아티아','كرواتيا') },
  { id: 'esp', flagEmoji:'🇪🇸', flagUrl:f('es'), group:'H', name:t('Spain','西班牙','España','Espagne','Spanien','スペイン','스페인','إسبانيا') },
  { id: 'aut', flagEmoji:'🇦🇹', flagUrl:f('at'), group:'L', name:t('Austria','奥地利','Austria','Autriche','Österreich','オーストリア','오스트리아','النمسا') },
  { id: 'usa', flagEmoji:'🇺🇸', flagUrl:f('us'), group:'C', name:t('United States','美国','EE.UU.','États-Unis','USA','アメリカ','미국','الولايات المتحدة') },
  { id: 'bih', flagEmoji:'🇧🇦', flagUrl:f('ba'), group:'H', name:t('Bosnia-Herz','波黑','Bosnia y H.','Bosnie-Herz.','Bosnien-Herz.','ボスニア','보스니아','البوسنة والهرسك') },
  { id: 'bel', flagEmoji:'🇧🇪', flagUrl:f('be'), group:'J', name:t('Belgium','比利时','Bélgica','Belgique','Belgien','ベルギー','벨기에','بلجيكا') },
  { id: 'sen', flagEmoji:'🇸🇳', flagUrl:f('sn'), group:'A', name:t('Senegal','塞内加尔','Senegal','Sénégal','Senegal','セネガル','세네갈','السنغال') },
  { id: 'bra', flagEmoji:'🇧🇷', flagUrl:f('br'), group:'E', name:t('Brazil','巴西','Brasil','Brésil','Brasilien','ブラジル','브라질','البرازيل') },
  { id: 'jpn', flagEmoji:'🇯🇵', flagUrl:f('jp'), group:'C', name:t('Japan','日本','Japón','Japon','Japan','日本','일본','اليابان') },
  { id: 'civ', flagEmoji:'🇨🇮', flagUrl:f('ci'), group:'J', name:t('Ivory Coast','科特迪瓦','Costa de Marfil','Côte d\'Ivoire','Elfenbeinküste','コートジボワール','코트디부아르','ساحل العاج') },
  { id: 'nor', flagEmoji:'🇳🇴', flagUrl:f('no'), group:'K', name:t('Norway','挪威','Noruega','Norvège','Norwegen','ノルウェー','노르웨이','النرويج') },
  { id: 'mex', flagEmoji:'🇲🇽', flagUrl:f('mx'), group:'A', name:t('Mexico','墨西哥','México','Mexique','Mexiko','メキシコ','멕시코','المكسيك') },
  { id: 'ecu', flagEmoji:'🇪🇨', flagUrl:f('ec'), group:'K', name:t('Ecuador','厄瓜多尔','Ecuador','Équateur','Ecuador','エクアドル','에콰도르','الإكوادور') },
  { id: 'eng', flagEmoji:'🇬🇧', flagUrl:f('gb-eng'), group:'G', name:t('England','英格兰','Inglaterra','Angleterre','England','イングランド','잉글랜드','إنجلترا') },
  { id: 'cod', flagEmoji:'🇨🇩', flagUrl:f('cd'), group:'H', name:t('Congo DR','刚果民主','RD Congo','RD Congo','DR Kongo','コンゴ民主','콩고민주','الكونغو الديمقراطية') },
  { id: 'arg', flagEmoji:'🇦🇷', flagUrl:f('ar'), group:'D', name:t('Argentina','阿根廷','Argentina','Argentine','Argentinien','アルゼンチン','아르헨티나','الأرجنتين') },
  { id: 'cpv', flagEmoji:'🇨🇻', flagUrl:f('cv'), group:'D', name:t('Cape Verde','佛得角','Cabo Verde','Cap-Vert','Kap Verde','カーボベルデ','카보베르데','الرأس الأخضر') },
  { id: 'aus', flagEmoji:'🇦🇺', flagUrl:f('au'), group:'D', name:t('Australia','澳大利亚','Australia','Australie','Australien','オーストラリア','호주','أستراليا') },
  { id: 'egy', flagEmoji:'🇪🇬', flagUrl:f('eg'), group:'D', name:t('Egypt','埃及','Egipto','Égypte','Ägypten','エジプト','이집트','مصر') },
  { id: 'sui', flagEmoji:'🇨🇭', flagUrl:f('ch'), group:'E', name:t('Switzerland','瑞士','Suiza','Suisse','Schweiz','スイス','스위스','سويسرا') },
  { id: 'alg', flagEmoji:'🇩🇿', flagUrl:f('dz'), group:'I', name:t('Algeria','阿尔及利亚','Argelia','Algérie','Algerien','アルジェリア','알제리','الجزائر') },
  { id: 'col', flagEmoji:'🇨🇴', flagUrl:f('co'), group:'G', name:t('Colombia','哥伦比亚','Colombia','Colombie','Kolumbien','コロンビア','콜롬비아','كولومبيا') },
  { id: 'gha', flagEmoji:'🇬🇭', flagUrl:f('gh'), group:'F', name:t('Ghana','加纳','Ghana','Ghana','Ghana','ガーナ','가나','غانا') },
];

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id);
}
