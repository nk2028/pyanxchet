import QieyunExamples from "./qieyun-examples-node.js";

const { tupa, putonghua, gwongzau } = QieyunExamples;

function noThrow(f) {
  return function inner(...args) {
    try {
      return f(...args);
    } catch (e) {
      return "演算有誤或暫無資料";
    }
  };
}

const 推導切韻拼音 = noThrow(tupa);
const 推導普通話 = noThrow(putonghua);
const 推導廣州音 = noThrow(gwongzau);

export default function 生成擬音(音韻地位) {
  return `（切韻拼音: ${推導切韻拼音(音韻地位)}， 推導普通話: ${推導普通話(音韻地位)}，推導廣州音: ${推導廣州音(音韻地位)}）`;
}
