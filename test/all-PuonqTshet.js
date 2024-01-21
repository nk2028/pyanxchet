import * as Qieyun from "qieyun";
import 生成擬音 from "../src/autoderiver.js";
import { puonqtshet } from "../src/PuonqTshet.js";
import 是合法音韻地位 from "./utils.js";

let i = 0;

for (const 音韻地位 of Qieyun.資料.iter音韻地位()) {
  if (是合法音韻地位(音韻地位)) {
    const 字頭反切 = Qieyun.資料.query音韻地位(音韻地位);
    const { 字頭, 反切 } = 字頭反切[0];
    if (反切 != null) {
      const [上字, 下字] = [...反切];
      const 上字音韻地位們 = Qieyun.資料.query字頭(上字).map(({ 音韻地位 }) => 音韻地位);
      const 下字音韻地位們 = Qieyun.資料.query字頭(下字).map(({ 音韻地位 }) => 音韻地位);
      for (const 上字音韻地位 of 上字音韻地位們) {
        for (const 下字音韻地位 of 下字音韻地位們) {
          const { 反切過程 } = puonqtshet(上字音韻地位, 下字音韻地位);
          console.log(i++);
          console.log(反切過程.join("\n"));
          console.log(`實際被切字音韻地位: ${音韻地位.描述}（${字頭}，${反切}切）${生成擬音(音韻地位)}`);
          console.log();
        }
      }
    }
  }
}
