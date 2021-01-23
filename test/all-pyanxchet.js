import Qieyun from 'qieyun';
import { pyanxchet } from '../src/index.js';
import 生成擬音 from '../src/autoderiver/index.js';
import { 是合法音韻地位 } from './utils.js';

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
          console.log(反切過程.join('\n'));
          console.log(`實際被切字音韻地位: ${音韻地位.描述}（${音韻地位.代表字}，${反切}切）${生成擬音(音韻地位)}`);
          console.log();
        }
      }
    }
  }
}
