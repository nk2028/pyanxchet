import * as Qieyun from "qieyun";
import { puonqtshet } from "../src/PuonqTshet.js";
import 是合法音韻地位 from "./utils.js";

let correct_count = 0;
let incorrect_count = 0;

outer: for (const 音韻地位 of Qieyun.資料.iter音韻地位()) {
  const 字頭反切 = Qieyun.資料.query音韻地位(音韻地位);
  const { 字頭, 反切 } = 字頭反切[0];
  if (!是合法音韻地位(音韻地位)) {
    console.log(`字頭：${字頭}，預期：${音韻地位.描述}，實際：無法處理不合法音韻地位`);
    incorrect_count++;
  } else {
    if (反切 != null) {
      const [上字, 下字] = [...反切];
      const 上字音韻地位們 = Qieyun.資料.query字頭(上字).map(({ 音韻地位 }) => 音韻地位);
      const 下字音韻地位們 = Qieyun.資料.query字頭(下字).map(({ 音韻地位 }) => 音韻地位);
      const 預測被切字音韻地位們 = [];
      for (const 上字音韻地位 of 上字音韻地位們) {
        for (const 下字音韻地位 of 下字音韻地位們) {
          const { 被切字音韻地位們 } = puonqtshet(上字音韻地位, 下字音韻地位);
          if (被切字音韻地位們.some((當前音韻地位) => 當前音韻地位.等於(音韻地位))) {
            correct_count++;
            continue outer;
          }
          預測被切字音韻地位們.push(...被切字音韻地位們);
        }
      }
      console.log(
        `字頭：${字頭}，預期：${音韻地位.描述}，實際：${
          預測被切字音韻地位們.map(({ 描述 }) => 描述).join("、") || "無結果"
        }`,
      );
      incorrect_count++;
    }
  }
}

console.log(
  `正確 ${correct_count}，錯誤 ${incorrect_count}，準確率 ${
    (correct_count / (correct_count + incorrect_count) * 100).toFixed(2)
  }%`,
);
