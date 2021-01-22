import kyonh1 from './kyonh.js';
import putonghua1 from './putonghua.js';
import gwongzau1 from './gwongzau.js';

function noThrow(f) {
  return function inner(...args) {
    try {
      return f(...args);
    } catch (e) {
      return '暫無資料';
    }
  };
}

const kyonh = noThrow(kyonh1);
const putonghua = noThrow(putonghua1);
const gwongzau = noThrow(gwongzau1);

export default function 生成擬音(音韻地位) {
  return `（古韻羅馬字: ${kyonh(音韻地位)}，推導普通話: ${putonghua(音韻地位)}，推導廣州音: ${gwongzau(音韻地位)}）`; // TODO: Fix autoderiver
  // return `推導日語漢音: ${kanon(音韻地位)}`;
}
