import type { Team, Lang } from '../types';

function f(iso: string): string { return `https://flagcdn.com/w80/${iso}.png`; }

// name record: { en, zh-CN, zh-TW, es, fr, de, ja, ko, ar, pt, nl, it, sv, hr, no, bs }
function n(...names: string[]): Record<Lang, string> {
  const keys: Lang[] = ['en','zh-CN','zh-TW','es','fr','de','ja','ko','ar','pt','nl','it','sv','hr','no','bs'];
  const r: any = {};
  keys.forEach((k, i) => { r[k] = names[i] || names[0]; });
  return r;
}

export const ALL_TEAMS: Team[] = [
  { id:'ger',flagEmoji:'🇩🇪',flagUrl:f('de'),group:'I',
    name:n('Germany','德国','德國','Alemania','Allemagne','Deutschland','ドイツ','독일','ألمانيا','Alemanha','Duitsland','Germania','Tyskland','Njemačka','Tyskland','Njemačka') },
  { id:'par',flagEmoji:'🇵🇾',flagUrl:f('py'),group:'L',
    name:n('Paraguay','巴拉圭','巴拉圭','Paraguay','Paraguay','Paraguay','パラグアイ','파라과이','باراغواي','Paraguai','Paraguay','Paraguay','Paraguay','Paragvaj','Paraguay','Paragvaj') },
  { id:'fra',flagEmoji:'🇫🇷',flagUrl:f('fr'),group:'F',
    name:n('France','法国','法國','Francia','France','Frankreich','フランス','프랑스','فرنسا','França','Frankrijk','Francia','Frankrike','Francuska','Frankrike','Francuska') },
  { id:'swe',flagEmoji:'🇸🇪',flagUrl:f('se'),group:'J',
    name:n('Sweden','瑞典','瑞典','Suecia','Suède','Schweden','スウェーデン','스웨덴','السويد','Suécia','Zweden','Svezia','Sverige','Švedska','Sverige','Švedska') },
  { id:'rsa',flagEmoji:'🇿🇦',flagUrl:f('za'),group:'L',
    name:n('South Africa','南非','南非','Sudáfrica','Afrique du Sud','Südafrika','南アフリカ','남아프리카','جنوب أفريقيا','África do Sul','Zuid-Afrika','Sudafrica','Sydafrika','Južna Afrika','Sør-Afrika','Južna Afrika') },
  { id:'can',flagEmoji:'🇨🇦',flagUrl:f('ca'),group:'B',
    name:n('Canada','加拿大','加拿大','Canadá','Canada','Kanada','カナダ','캐나다','كندا','Canadá','Canada','Canada','Kanada','Kanada','Canada','Kanada') },
  { id:'ned',flagEmoji:'🇳🇱',flagUrl:f('nl'),group:'A',
    name:n('Netherlands','荷兰','荷蘭','Países Bajos','Pays-Bas','Niederlande','オランダ','네덜란드','هولندا','Países Baixos','Nederland','Paesi Bassi','Nederländerna','Nizozemska','Nederland','Nizozemska') },
  { id:'mar',flagEmoji:'🇲🇦',flagUrl:f('ma'),group:'C',
    name:n('Morocco','摩洛哥','摩洛哥','Marruecos','Maroc','Marokko','モロッコ','모로코','المغرب','Marrocos','Marokko','Marocco','Marocko','Maroko','Marokko','Maroko') },
  { id:'por',flagEmoji:'🇵🇹',flagUrl:f('pt'),group:'C',
    name:n('Portugal','葡萄牙','葡萄牙','Portugal','Portugal','Portugal','ポルトガル','포르투갈','البرتغال','Portugal','Portugal','Portogallo','Portugal','Portugal','Portugal','Portugal') },
  { id:'cro',flagEmoji:'🇭🇷',flagUrl:f('hr'),group:'D',
    name:n('Croatia','克罗地亚','克羅地亞','Croacia','Croatie','Kroatien','クロアチア','크로아티아','كرواتيا','Croácia','Kroatië','Croazia','Kroatien','Hrvatska','Kroatia','Hrvatska') },
  { id:'esp',flagEmoji:'🇪🇸',flagUrl:f('es'),group:'H',
    name:n('Spain','西班牙','西班牙','España','Espagne','Spanien','スペイン','스페인','إسبانيا','Espanha','Spanje','Spagna','Spanien','Španjolska','Spania','Španija') },
  { id:'aut',flagEmoji:'🇦🇹',flagUrl:f('at'),group:'L',
    name:n('Austria','奥地利','奧地利','Austria','Autriche','Österreich','オーストリア','오스트리아','النمسا','Áustria','Oostenrijk','Austria','Österrike','Austrija','Østerrike','Austrija') },
  { id:'usa',flagEmoji:'🇺🇸',flagUrl:f('us'),group:'C',
    name:n('United States','美国','美國','EE.UU.','États-Unis','USA','アメリカ','미국','الولايات المتحدة','EUA','VS','Stati Uniti','USA','SAD','USA','SAD') },
  { id:'bih',flagEmoji:'🇧🇦',flagUrl:f('ba'),group:'H',
    name:n('Bosnia-Herz','波黑','波赫','Bosnia y H.','Bosnie-Herz.','Bosnien-Herz.','ボスニア','보스니아','البوسنة','Bósnia','Bosnië','Bosnia','Bosnien','Bosna','Bosnia','Bosna') },
  { id:'bel',flagEmoji:'🇧🇪',flagUrl:f('be'),group:'J',
    name:n('Belgium','比利时','比利時','Bélgica','Belgique','Belgien','ベルギー','벨기에','بلجيكا','Bélgica','België','Belgio','Belgien','Belgija','Belgia','Belgija') },
  { id:'sen',flagEmoji:'🇸🇳',flagUrl:f('sn'),group:'A',
    name:n('Senegal','塞内加尔','塞內加爾','Senegal','Sénégal','Senegal','セネガル','세네갈','السنغال','Senegal','Senegal','Senegal','Senegal','Senegal','Senegal','Senegal') },
  { id:'bra',flagEmoji:'🇧🇷',flagUrl:f('br'),group:'E',
    name:n('Brazil','巴西','巴西','Brasil','Brésil','Brasilien','ブラジル','브라질','البرازيل','Brasil','Brazilië','Brasile','Brasilien','Brazil','Brasil','Brazil') },
  { id:'jpn',flagEmoji:'🇯🇵',flagUrl:f('jp'),group:'C',
    name:n('Japan','日本','日本','Japón','Japon','Japan','日本','일본','اليابان','Japão','Japan','Giappone','Japan','Japan','Japan','Japan') },
  { id:'civ',flagEmoji:'🇨🇮',flagUrl:f('ci'),group:'J',
    name:n('Ivory Coast','科特迪瓦','象牙海岸','Costa de Marfil','Côte d\'Ivoire','Elfenbeinküste','コートジボワール','코트디부아르','ساحل العاج','Costa do Marfim','Ivoorkust','Costa d\'Avorio','Elfenbenskusten','Obala Bjelokosti','Elfenbenskysten','Obala Slonovače') },
  { id:'nor',flagEmoji:'🇳🇴',flagUrl:f('no'),group:'K',
    name:n('Norway','挪威','挪威','Noruega','Norvège','Norwegen','ノルウェー','노르웨이','النرويج','Noruega','Noorwegen','Norvegia','Norge','Norveška','Norge','Norveška') },
  { id:'mex',flagEmoji:'🇲🇽',flagUrl:f('mx'),group:'A',
    name:n('Mexico','墨西哥','墨西哥','México','Mexique','Mexiko','メキシコ','멕시코','المكسيك','México','Mexico','Messico','Mexiko','Meksiko','Mexico','Meksiko') },
  { id:'ecu',flagEmoji:'🇪🇨',flagUrl:f('ec'),group:'K',
    name:n('Ecuador','厄瓜多尔','厄瓜多爾','Ecuador','Équateur','Ecuador','エクアドル','에콰도르','الإكوادور','Equador','Ecuador','Ecuador','Ecuador','Ekvador','Ecuador','Ekvador') },
  { id:'eng',flagEmoji:'🇬🇧',flagUrl:f('gb-eng'),group:'G',
    name:n('England','英格兰','英格蘭','Inglaterra','Angleterre','England','イングランド','잉글랜드','إنجلترا','Inglaterra','Engeland','Inghilterra','England','Engleska','England','Engleska') },
  { id:'cod',flagEmoji:'🇨🇩',flagUrl:f('cd'),group:'H',
    name:n('Congo DR','刚果民主','剛果民主','RD Congo','RD Congo','DR Kongo','コンゴ民主','콩고민주','الكونغو','RD Congo','DR Congo','RD Congo','DR Kongo','DR Kongo','DR Kongo','DR Kongo') },
  { id:'arg',flagEmoji:'🇦🇷',flagUrl:f('ar'),group:'D',
    name:n('Argentina','阿根廷','阿根廷','Argentina','Argentine','Argentinien','アルゼンチン','아르헨티나','الأرجنتين','Argentina','Argentinië','Argentina','Argentina','Argentina','Argentina','Argentina') },
  { id:'cpv',flagEmoji:'🇨🇻',flagUrl:f('cv'),group:'D',
    name:n('Cape Verde','佛得角','維德角','Cabo Verde','Cap-Vert','Kap Verde','カーボベルデ','카보베르데','الرأس الأخضر','Cabo Verde','Kaapverdië','Capo Verde','Kap Verde','Zelenortska','Kapp Verde','Zelenortska') },
  { id:'aus',flagEmoji:'🇦🇺',flagUrl:f('au'),group:'D',
    name:n('Australia','澳大利亚','澳大利亞','Australia','Australie','Australien','オーストラリア','호주','أستراليا','Austrália','Australië','Australia','Australien','Australija','Australia','Australija') },
  { id:'egy',flagEmoji:'🇪🇬',flagUrl:f('eg'),group:'D',
    name:n('Egypt','埃及','埃及','Egipto','Égypte','Ägypten','エジプト','이집트','مصر','Egito','Egypte','Egitto','Egypten','Egipat','Egypt','Egipat') },
  { id:'sui',flagEmoji:'🇨🇭',flagUrl:f('ch'),group:'E',
    name:n('Switzerland','瑞士','瑞士','Suiza','Suisse','Schweiz','スイス','스위스','سويسرا','Suíça','Zwitserland','Svizzera','Schweiz','Švicarska','Sveits','Švicarska') },
  { id:'alg',flagEmoji:'🇩🇿',flagUrl:f('dz'),group:'I',
    name:n('Algeria','阿尔及利亚','阿爾及利亞','Argelia','Algérie','Algerien','アルジェリア','알제리','الجزائر','Argélia','Algerije','Algeria','Algeriet','Alžir','Algerie','Alžir') },
  { id:'col',flagEmoji:'🇨🇴',flagUrl:f('co'),group:'G',
    name:n('Colombia','哥伦比亚','哥倫比亞','Colombia','Colombie','Kolumbien','コロンビア','콜롬비아','كولومبيا','Colômbia','Colombia','Colombia','Colombia','Kolumbija','Colombia','Kolumbija') },
  { id:'gha',flagEmoji:'🇬🇭',flagUrl:f('gh'),group:'F',
    name:n('Ghana','加纳','迦納','Ghana','Ghana','Ghana','ガーナ','가나','غانا','Gana','Ghana','Ghana','Ghana','Gana','Ghana','Gana') },
];

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id);
}
