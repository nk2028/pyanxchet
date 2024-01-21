import * as Qieyun from "qieyun";

const 選項 = "";

const QieyunExamples = {
    tupa: function(音韻地位) { /* 切韻拼音
 *
 * https://zhuanlan.zhihu.com/p/478751152
 *
 * 推導器所用的音韻地位無需選項，但在處理其他來源的音韻地位時可指定以下選項：
 *
 * 選項.模式 = '嚴格'; // 僅允許正則地位（如不指定 `模式`，也按嚴格模式處理）
 * 選項.模式 = '標準'; // 允許部分非正則地位（推導爲對應的正則地位），不允許無法自動正則化的聲韻搭配
 * 選項.模式 = '寬鬆'; // 允許非正則地位，無法自動正則化的聲韻搭配保持原樣
 * 選項.脣音咍韻歸灰韻 = false; // 脣音咍韻推導爲開口，僅在「標準」「寬鬆」模式下有效
 *
 * @author unt
 */

if (!音韻地位) return [];

const is = (...x) => 音韻地位.屬於(...x);
const when = (...x) => 音韻地位.判斷(...x);

// 正則化之前需保留該信息
const is脣音咍韻 = is`脣音 咍韻`;

const 正則化 = {
  標準: 'v2',
  寬鬆: 'v2lenient',
}[選項.模式] || 'v2Strict';
音韻地位 = Qieyun.適配分析體系[正則化](音韻地位);

// 恢復脣音咍韻信息
if (is脣音咍韻 && !選項.脣音咍韻歸灰韻) {
  音韻地位 = 音韻地位.調整({ 韻: '咍' });
}

function get聲母() {
  return {
    幫: 'p',  滂: 'ph',  並: 'b',  明: 'm',
    端: 't',  透: 'th',  定: 'd',  泥: 'n',  來: 'l',
    知: 'tr', 徹: 'trh', 澄: 'dr', 孃: 'nr',
    見: 'k',  溪: 'kh',  羣: 'g',  疑: 'ng', 云: '',
    影: 'q',  曉: 'h',   匣: 'gh',
    精: 'ts',  清: 'tsh',  從: 'dz',  心: 's',  邪: 'z',
    莊: 'tsr', 初: 'tsrh', 崇: 'dzr', 生: 'sr', 俟: 'zr',
    章: 'tj',  昌: 'tjh',  常: 'dj',  書: 'sj', 船: 'zj', 日: 'nj', 以: 'j',
  }[音韻地位.母];
}

function get韻母() {
  // 爲了方便推導，對韻類稍作調整
  const 韻 = when([
    ['蒸韻 (重紐B類 或 幫組 或 合口)', '冰'],
    ['東韻 三等', '終'],
    ['清韻', '庚'],
    ['陽韻', '唐'],
    ['臻韻 或 莊組 欣韻 上聲', '眞'],
    ['凡韻', '嚴'],
    ['', 音韻地位.韻],
  ]);
  const 韻到韻尾 = [
    ['脂之尤侯 　佳　模　 支魚虞 麻歌', ''],
    ['冰蒸終東 青耕登冬江 　　鍾 庚唐', 'ng', 'k'],
    ['　微微　 齊皆咍灰　 祭廢廢 夬泰', 'j'],
    ['眞欣文　 先山痕魂　 仙元元 刪寒', 'n', 't'],
    ['幽　　　 蕭　　　　 宵　　 肴豪', 'w'],
    ['侵　　　 添咸　覃　 鹽嚴嚴 銜談', 'm', 'p'],
  ];
  const 元音列表 = [
    'i',       'y',  'u', 'ou',
    'e', 'ee', 'eo', 'o', 'oeu',
    'e',       'yo', 'uo',
         'ae', 'a',
  ];

  let 匹配行 = 韻到韻尾.find(行 => 行[0].includes(韻));
  let 元音 = 元音列表[匹配行[0].replace(/ /g, '')[is`開口` ? 'indexOf' : 'lastIndexOf'](韻)];
  let 韻尾 = 匹配行[1 + is`入聲`];

  // 添加三等 C 介音（僅歌陽韻需要處理）
  if (is`三等` && 元音 === 'a') {
    // 重紐A類用於𩦠小韻
    元音 = (is`脣音 重紐A類` ? 'i' : is`開口` ? 'y' : 'u') + 元音;
  }
  // 添加三等 A、B 介音
  if (is`三等` && ['i', 'e', 'ae'].includes(元音)) {
    if (is`重紐B類 或 云母 或 莊組 或 庚蒸韻 或 幽韻 幫組`) {
      元音 = (is`合口` ? 'u' : 'y') + 元音;
    } else if (元音 !== 'i') {
      // 拼莊組以外的銳音一律視爲 A 類（同《切韻》清韻、《廣韻》諄韻的獨立條件）
      元音 = 'i' + 元音;
    }
  }
  // 添加合口介音
  if (is`合口` && !['u', 'o'].includes(元音[0])) {
    元音 = 'w' + 元音;
  }
  return 元音 + 韻尾;
}

function get聲調() {
  return { 上: 'q', 去: 'h' }[音韻地位.聲] || '';
}

return get聲母() + get韻母() + get聲調();
 },
    putonghua: function(音韻地位) { /* 推導普通話
 *
 * @author graphemecluster
 */

/** @type { 音韻地位['屬於'] } */
const is = (...x) => 音韻地位.屬於(...x);
/** @type { 音韻地位['判斷'] } */
const when = (...x) => 音韻地位.判斷(...x);

if (!音韻地位) return [
  ['標調方式', [2, '數字', '附標']],
];

const 聲母規則 = () => when([
  ['幫滂並母 輕脣韻', 'f'],
  ['幫母', 'b'],
  ['滂母', 'p'],
  ['並母', [['平聲', 'p'], ['', 'b']]],
  ['明母', [['微虞文元陽凡韻', 'w'], ['', 'm']]],

  ['端母', 'd'],
  ['透母', 't'],
  ['定母', [['平聲', 't'], ['', 'd']]],
  ['泥母', 'n'],
  ['來母', 'l'],

  ['知母', 'zh'],
  ['徹母', 'ch'],
  ['澄母', [['平聲', 'ch'], ['', 'zh']]],
  ['孃母', 'n'],

  ['精母', 'z'],
  ['清母', 'c'],
  ['從母', [['平聲', 'c'], ['', 'z']]],
  ['心母', 's'],
  ['邪母', 's'],

  ['莊母', 'zh'],
  ['初母', 'ch'],
  ['崇母', [['平聲', 'ch'], ['', 'sh']]],
  ['生母', 'sh'],
  ['俟母', 'sh'],

  ['章母', 'zh'],
  ['昌母', 'ch'],
  ['常母', [['平聲', 'ch'], ['', 'sh']]],
  ['書母', 'sh'],
  ['船母', 'sh'],
  ['日母', 'r'],

  ['見母', 'g'],
  ['溪母', 'k'],
  ['羣母', [['平聲', 'k'], ['', 'g']]],
  ['曉匣母', 'h'],
  ['疑影云以母', ''],
], '無聲母規則');

const 舒聲韻母規則 = () => when([
  // 通攝
  ['通攝', [['三等 牙喉音', 'iong'], ['', 'ueng']]],

  // 江攝
  ['江韻', [['牙喉音', 'iang'], ['', 'uang']]],

  // 止攝
  ['止攝 合口', [['莊組', 'uai'], ['', 'uei']]],
  ['止攝', [['牙喉音', 'i'], ['', 'er']]],

  // 遇攝
  ['魚虞韻', 'ü'],
  ['模韻', 'u'],

  // 蟹攝
  ['祭韻 合口 莊組', 'uai'],
  ['齊祭廢韻', [['合口', 'uei'], ['', 'i']]],
  ['泰灰韻', [['開口', 'ai'], ['', 'uei']]],
  ['佳韻 牙喉音', [['合口', 'ua'], ['', 'ia']]],
  ['皆夬韻 牙喉音', [['合口', 'uai'], ['', 'ie']]],
  ['佳皆夬咍韻', [['合口', 'uai'], ['', 'ai']]],

  // 臻攝
  ['眞欣韻', [['合口', 'ün'], ['', 'in']]],
  ['臻韻 或 痕韻 牙喉音', 'en'],
  ['文韻 牙喉音', 'ün'],
  ['痕魂文韻', 'uen'],
  ['元韻', [['合口', 'üan'], ['', 'ian']]],

  // 山攝
  ['寒刪山韻 合口', 'uan'],
  ['刪山韻 牙喉音', 'ian'],
  ['寒刪山韻', 'an'],
  ['仙先韻', [['合口', 'üan'], ['', 'ian']]],

  // 效攝
  ['蕭宵韻 或 肴韻 牙喉音', 'iao'],
  ['豪肴韻', 'ao'],

  // 果攝
  ['歌韻 一等', [['開口 牙喉音', 'e'], ['', 'uo']]],
  ['歌韻 三等', [['開口', 'ie'], ['', 'üe']]],

  // 假攝
  ['麻韻 二等', [['合口', 'ua'], ['牙喉音', 'ia'], ['', 'a']]],
  ['麻韻 三等', 'ie'],

  // 宕攝
  ['唐韻 開口', 'ang'],
  ['陽韻 開口 非 莊組', 'iang'],
  ['唐陽韻', 'uang'],

  // 梗攝
  ['梗攝 二等', [['合口', 'ueng'], ['', 'eng']]],
  ['梗攝', [['合口', 'iong'], ['', 'ing']]],

  // 曾攝
  ['登韻', [['合口', 'ueng'], ['', 'eng']]],
  ['蒸韻', 'ing'],

  // 流攝
  ['侯韻', 'ou'],
  ['尤韻', [['幫組', 'ou'], ['', 'iou']]],
  ['幽韻', [['幫組', 'iao'], ['', 'iou']]],

  // 深攝
  ['侵韻', 'in'],

  // 咸攝
  ['鹽添韻 或 嚴咸銜韻 牙喉音', 'ian'],
  ['覃談嚴咸銜韻', 'an'],
  ['凡韻', 'uan'],
], '無韻母規則');

const 入聲韻母規則 = () => when([
  // 通攝
  ['通攝', 'u'],

  // 江攝
  ['江韻', [['牙喉音', 'üe'], ['', 'uo']]],

  // 臻攝
  ['眞韻 合口', [['莊組', 'uai'], ['', 'ü']]],
  ['眞欣韻', 'i'],
  ['臻痕韻', 'e'],
  ['魂韻', [['幫組', 'o'], ['', 'u']]],
  ['文韻', 'ü'],
  ['元韻', [['開口', 'ie'], ['牙喉音', 'üe'], ['', 'a']]],

  // 山攝
  ['寒韻', [['非 開口', 'uo'], ['牙喉音', 'e'], ['', 'a']]],
  ['刪山韻', [['合口', 'ua'], ['牙喉音', 'ia'], ['', 'a']]],
  ['仙先韻', [['合口', 'üe'], ['', 'ie']]],

  // 宕攝
  ['唐韻', [['開口 牙喉音', 'e'], ['', 'uo']]],
  ['陽韻', [['幫組', 'o'], ['', 'üe']]],

  // 梗攝
  ['梗攝 二等', [['開口', 'e'], ['', 'uo']]],
  ['梗攝', [['合口', 'ü'], ['', 'i']]],

  // 曾攝
  ['登韻', [['開口', 'e'], ['', 'uo']]],
  ['蒸韻', [['合口', 'ü'], ['莊組', 'e'], ['', 'i']]],

  // 深攝
  ['侵韻', [['莊組', 'e'], ['', 'i']]],

  // 咸攝
  ['覃談韻', [['牙喉音', 'e'], ['', 'a']]],
  ['鹽添嚴韻', 'ie'],
  ['咸銜凡韻', [['牙喉音', 'ia'], ['', 'a']]],
], '無韻母規則');

const 聲調規則 = () => when([
  ['清音', [
    ['平聲', '1'],
    ['上聲', '3'],
    ['去聲', '4'],
    ['入聲', ''],
  ]],
  ['濁音', [
    ['平聲', '2'],
    ['上聲', [['全濁', '4'], ['次濁', '3']]],
    ['去聲', '4'],
    ['入聲', [['全濁', '2'], ['次濁', '4']]],
  ]],
], '無聲調規則');

let 聲母 = 聲母規則();
let 韻母 = is`舒聲` ? 舒聲韻母規則() : 入聲韻母規則();
let 聲調 = 聲調規則();

if (['i', 'ü'].includes(韻母[0])) 聲母 = {
  g: 'j', k: 'q', h: 'x',
  z: 'j', c: 'q', s: 'x',
}[聲母] || 聲母;

if (韻母 === 'er') {
  if (聲母 === 'r') 聲母 = '';
  else 韻母 = 'i';
}

if (['n', 'l'].includes(聲母) && ['ua', 'uai', 'uang', 'uei'].includes(韻母)) 韻母 = 韻母.slice(1);
if (韻母[0] === 'ü' && !(['n', 'l'].includes(聲母) && ['ü', 'üe'].includes(韻母))) {
  if (!聲母) 聲母 = 'y';
  韻母 = 'u' + 韻母.slice(1);
}

if (['zh', 'ch', 'sh', 'r'].includes(聲母)) {
  if (韻母[0] === 'i') {
    if (韻母[1] === 'n') 韻母 = 'e' + 韻母.slice(1);
    else if (韻母[1]) 韻母 = 韻母.slice(1);
  }
  if (韻母 === 'ue') 韻母 = 'uo';
}

if (['b', 'p', 'm', 'f', 'w'].includes(聲母) && 韻母[0] === 'u' && 韻母[1]) 韻母 = 韻母.slice(1);
if (['f', 'w'].includes(聲母) && 韻母[0] === 'i') 韻母 = 韻母.slice(1) || 'ei';

if (!聲母) {
  if (韻母[0] === 'i') 聲母 = 'y';
  if (韻母[0] === 'u') 聲母 = 'w';
  if (聲母 && 韻母[1] && 韻母[1] !== 'n') 韻母 = 韻母.slice(1);
}

韻母 = { iou: 'iu', uei: 'ui', uen: 'un', ueng: 'ong' }[韻母] || 韻母;

if (選項.標調方式 === '數字') return 聲母 + 韻母 + 聲調;
return 聲母 + (聲調 ? 韻母.replace(/.*a|.*[eo]|.*[iuü]/, '$&' + ' ̄́̌̀'[聲調]) : 韻母);
 },
    gwongzau: function(音韻地位) { /* 推導廣州音
 *
 * https://ayaka.shn.hk/teoi/
 *
 * @author Ayaka
 */

if (!音韻地位) return [['$legacy', true]];

const is = (x) => 音韻地位.屬於(x);

function 聲母規則() {
  if (is('幫母')) {
    if (is('東韻 三等 或 鍾微虞廢文元陽尤凡韻')) return 'f';
    return 'b';
  }
  if (is('滂母')) {
    if (is('東韻 三等 或 鍾微虞廢文元陽尤凡韻')) return 'f';
    return 'p';
  }
  if (is('並母')) {
    if (is('東韻 三等 或 鍾微虞廢文元陽尤凡韻')) return 'f';
    if (is('平聲')) return 'p';
    return 'b';
  }
  if (is('明母')) return 'm';

  if (is('端母')) return 'd';
  if (is('透母')) return 't';
  if (is('定母')) return is('平聲') ? 't' : 'd';
  if (is('泥母')) return 'n';
  if (is('來母')) return 'l';

  if (is('知母')) return 'z';
  if (is('徹母')) return 'c';
  if (is('澄母')) return is('平聲') ? 'c' : 'z';
  if (is('孃母')) return 'n';

  if (is('精母')) return 'z';
  if (is('清母')) return 'c';
  if (is('從母')) return is('平聲') ? 'c' : 'z';
  if (is('心母')) return 's';
  if (is('邪母')) return is('平聲') ? 'c' : 'z'; // 塞擦音多於擦音

  if (is('莊母')) return 'z';
  if (is('初母')) return 'c';
  if (is('崇母')) return is('平聲') ? 'c' : 'z';
  if (is('生母')) return 's';
  if (is('俟母')) return is('平聲') ? 'c' : 'z';

  if (is('章母')) return 'z';
  if (is('昌母')) return 'c';
  if (is('常母')) return 's'; // 擦音多於塞擦音
  if (is('書母')) return 's';
  if (is('船母')) return 's';
  if (is('日母')) return 'j';

  if (is('見母')) return 'g';
  if (is('溪母')) return 'h'; // 多數擦化
  if (is('羣母')) return is('平聲') ? 'k' : 'g';
  if (is('疑母')) return 'ng'; // ng 拼細音時為 j，詳後

  if (is('曉母')) return 'h';
  if (is('匣母')) {
    if (is('合口 或 模韻')) return 'j'; // 非 yu 前為 w，詳後
    return 'h';
  }
  if (is('影云以母')) {
    if (is('三四等')) return 'j'; // 非 yu 前為 w，詳後
    return '';
  }

  throw new Error('無聲母規則');
}

function 韻母規則() {
  // 通攝
  if (is('東冬鍾韻')) return 'ung';

  // 江攝
  if (is('江韻 幫組')) return 'ong';
  if (is('江韻 舌齒音')) return 'oeng';
  if (is('江韻 牙喉音')) return 'ong';

  // 止攝
  if (is('支脂之微韻 幫組')) return 'ei';
  if (is('支脂之微韻 開口 舌齒音 端組')) return 'ei';
  if (is('支脂之微韻 開口 舌齒音 來母')) return 'ei';
  if (is('支脂之微韻 開口 舌齒音 孃母')) return 'ei';
  if (is('支脂之微韻 開口 舌齒音')) return 'i';
  if (is('支脂之微韻 開口 牙喉音 疑母')) return 'i';
  if (is('支脂之微韻 開口 牙喉音 影母')) return 'i';
  if (is('支脂之微韻 開口 牙喉音 云母')) return 'i';
  if (is('支脂之微韻 開口 牙喉音 以母')) return 'i';
  if (is('支脂之微韻 開口 牙喉音')) return 'ei';
  if (is('支脂之微韻 合口 舌齒音')) return 'eoi';
  if (is('支脂之微韻 合口 牙喉音')) return 'ai';

  // 遇攝
  if (is('魚虞韻 幫組 幫滂並母')) return 'u';
  if (is('魚虞韻 幫組 明母')) return 'ou';
  if (is('魚虞韻 舌齒音 端組')) return 'eoi';
  if (is('魚虞韻 舌齒音 來母')) return 'eoi';
  if (is('魚虞韻 舌齒音 孃母')) return 'eoi';
  if (is('魚虞韻 舌齒音 精組')) return 'eoi';
  if (is('魚虞韻 舌齒音 莊組')) return 'o';
  if (is('魚虞韻 舌齒音')) return 'yu';
  if (is('魚虞韻 牙喉音 見溪羣母')) return 'eoi';
  if (is('魚虞韻 牙喉音 曉匣母')) return 'eoi';
  if (is('魚虞韻 牙喉音')) return 'yu';
  if (is('模韻 脣音')) return 'ou';
  if (is('模韻 舌齒音')) return 'ou';
  if (is('模韻 牙喉音 疑母')) return '';
  if (is('模韻 牙喉音')) return 'u';

  // 蟹攝
  if (is('齊韻')) return 'ai';
  if (is('祭韻 幫組')) return 'ai';
  if (is('祭韻 開口')) return 'ai';
  if (is('祭韻 合口 舌齒音')) return 'eoi';
  if (is('祭韻 合口 以母')) return 'eoi';
  if (is('祭韻 合口 牙喉音')) return 'ai';
  if (is('泰韻 幫組')) return 'ui';
  if (is('泰韻 開口 舌齒音 精組')) return 'oi';
  if (is('泰韻 開口 舌齒音')) return 'aai';
  if (is('泰韻 開口 牙喉音')) return 'oi';
  if (is('泰韻 合口 舌齒音')) return 'eoi';
  if (is('泰韻 合口 牙喉音 疑母')) return 'oi';
  if (is('泰韻 合口 牙喉音')) return 'ui';
  if (is('佳皆夬韻 幫組')) return 'aai';
  if (is('佳皆夬韻 開口')) return 'aai';
  if (is('佳皆夬韻 合口 舌齒音')) return 'eoi';
  if (is('佳皆夬韻 合口')) return 'aai';
  if (is('灰韻 舌齒音')) return 'eoi';
  if (is('灰韻 疑母')) return 'oi';
  if (is('灰韻')) return 'ui';
  if (is('咍韻')) return 'oi';
  if (is('廢韻')) return 'ai';

  // 臻攝
  if (is('眞韻 幫組')) return 'an';
  if (is('眞韻 開口')) return 'an';
  if (is('眞韻 合口 舌齒音')) return 'eon';
  if (is('眞韻 合口 牙喉音')) return 'an';
  if (is('臻文欣韻')) return 'an';
  if (is('元韻 幫組')) return 'aan';
  if (is('元韻 開口')) return 'in';
  if (is('元韻 合口')) return 'yun';
  if (is('魂韻 幫組')) return 'un';
  if (is('魂韻 端組')) return 'eon';
  if (is('魂韻 來母')) return 'eon';
  if (is('魂韻 精組')) return 'yun';
  if (is('魂韻 牙喉音')) return 'an';
  if (is('痕韻')) return 'an';

  // 山攝
  if (is('寒韻 幫組')) return 'un';
  if (is('寒韻 開口 舌齒音')) return 'aan';
  if (is('寒韻 開口 牙喉音')) return 'on';
  if (is('寒韻 合口 舌齒音')) return 'yun';
  if (is('寒韻 合口 牙喉音')) return 'un';
  if (is('刪山韻')) return 'aan';
  if (is('仙先韻 幫組')) return 'in';
  if (is('仙先韻 開口')) return 'in';
  if (is('仙先韻 合口')) return 'yun';

  // 效攝
  if (is('蕭宵韻')) return 'iu';
  if (is('肴韻')) return 'aau';
  if (is('豪韻')) return 'ou';

  // 果攝
  if (is('歌韻 一等')) return 'o';
  if (is('歌韻 三等 脣音')) return 'e';
  if (is('歌韻 三等 開口')) return 'e';
  if (is('歌韻 三等 合口')) return 'oe';

  // 假攝
  if (is('麻韻 二等')) return 'aa';
  if (is('麻韻 三等')) return 'e';

  // 宕攝
  if (is('陽韻 幫組')) return 'ong';
  if (is('陽韻 開口 莊組')) return 'ong';
  if (is('陽韻 開口')) return 'oeng';
  if (is('陽韻 合口')) return 'ong';
  if (is('唐韻')) return 'ong';

  // 梗攝
  if (is('庚韻 二等')) return 'ang';
  if (is('庚韻 三等 莊組')) return 'ang';
  if (is('庚韻 三等')) return 'ing';
  if (is('耕韻')) return 'ang';
  if (is('清青韻')) return 'ing';

  // 曾攝
  if (is('蒸韻')) return 'ing';
  if (is('登韻')) return 'ang';

  // 流攝
  if (is('尤侯幽韻')) return 'au';

  // 深攝
  if (is('侵韻')) return 'am'; // m 韻尾在聲母為脣音時為 n，詳後，下同

  // 咸攝
  if (is('覃談韻 幫組')) return 'aam';
  if (is('覃談韻 舌齒音')) return 'aam';
  if (is('覃談韻 牙喉音')) return 'om'; // -om 併入 -am，詳後
  if (is('鹽添嚴韻')) return 'im';
  if (is('咸銜凡韻')) return 'aam';

  throw new Error('無韻母規則');
}

function 聲調規則() {
  if (is('全清 或 次清')) {
    if (is('平聲')) return '1'; // 陰平
    if (is('上聲')) return '2'; // 陰上
    if (is('去聲')) return '3'; // 陰去
    if (is('入聲')) return '1'; // 陰入。長元音為 3，詳後
  } else {
    if (is('平聲')) return '4'; // 陽平
    if (is('全濁 上聲')) return '6'; // 陽去，全濁上變去
    if (is('上聲')) return '5'; // 陽上
    if (is('去聲')) return '6'; // 陽去
    if (is('入聲')) return '6'; // 陽入
  }
  throw new Error('無聲調規則');
}

function is長元音(韻母) {
  if (['aam', 'aan', 'im', 'in', 'om', 'on', 'ong', 'oeng', 'un', 'yun'].includes(韻母)) return true;
  if (['am', 'an', 'ang', 'eon', 'ing', 'ung'].includes(韻母)) return false;
  throw new Error('無法判斷元音長短：' + 韻母);
}

let 聲母 = 聲母規則();
let 韻母 = 韻母規則();
let 聲調 = 聲調規則();

// ng 拼細音時為 j
const is細音 = ['eo', 'i', 'oe', 'u', 'yu'].some((x) => 韻母.startsWith(x));
if (聲母 === 'ng' && is細音) 聲母 = 'j';

// 陰入分化
if (is('入聲') && 聲調 === '1' && is長元音(韻母)) 聲調 = '3';

if (is('合口 或 模韻') && !['eo', 'oe', 'yu'].some((x) => 韻母.startsWith(x))) { // 合口字
  if (聲母 === 'g' && !韻母.startsWith('u')) 聲母 = 'gw';
  else if (聲母 === 'k' && !韻母.startsWith('u')) 聲母 = 'kw';
  else if (聲母 === 'h' && !韻母.startsWith('i')) 聲母 = 'f';
  else if (聲母 === 'j') 聲母 = 'w';
  else if (聲母 === '') 聲母 = 'w';
}

// -om 併入 -am
if (韻母 === 'om') 韻母 = 'am';

// m 韻尾在聲母為脣音時為 n
if (is('幫組') && 韻母.endsWith('m')) 韻母 = 韻母.slice(0, -1) + 'n';

if (is('入聲')) {
  if (韻母.endsWith('m')) 韻母 = 韻母.slice(0, -1) + 'p';
  else if (韻母.endsWith('n')) 韻母 = 韻母.slice(0, -1) + 't';
  else if (韻母.endsWith('ng')) 韻母 = 韻母.slice(0, -2) + 'k';
}

return 聲母 + 韻母 + 聲調;
 },
};
export default QieyunExamples;