import Qieyun from 'qieyun';
import { pyanxchet } from '../src/index.js';
import 生成擬音 from '../src/autoderiver/index.js';

function 是合法音韻地位(音韻地位) {
  return 音韻地位.屬於('冬模泰咍灰痕魂寒豪唐登侯覃談韻 一等 \
或 江佳皆夬刪山肴耕咸銜韻 二等 \
或 鍾支脂之微魚虞祭廢眞臻欣元文仙宵陽清蒸尤幽侵鹽嚴凡韻 三等 \
或 齊先蕭青添韻 四等 \
或 東歌韻 一三等 \
或 麻庚韻 二三等');
}

let i = 0;

for (const 音韻地位 of Qieyun.iter音韻地位()) {
  if (是合法音韻地位(音韻地位)) {
    const 反切 = 音韻地位.反切();
    if (反切 != null) {
      const [上字, 下字] = [...反切];
      const 上字音韻地位們 = Qieyun.query字頭(上字).map(({ 音韻地位 }) => 音韻地位);
      const 下字音韻地位們 = Qieyun.query字頭(下字).map(({ 音韻地位 }) => 音韻地位);
      for (const 上字音韻地位 of 上字音韻地位們) {
        for (const 下字音韻地位 of 下字音韻地位們) {
          const { 反切過程 } = pyanxchet(上字, 下字, 上字音韻地位, 下字音韻地位);
          console.log(i++);
          console.log(`${上字}${下字}切`);
          console.log(反切過程);
          console.log(`實際被切字音韻地位: ${音韻地位.描述}(${音韻地位.代表字})${生成擬音(音韻地位)}`);
          console.log();
        }
      }
    }
  }
}
