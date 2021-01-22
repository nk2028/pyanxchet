import kyonh1 from './kyonh.js';

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

export default function 生成擬音(音韻地位) {
  return ''; // TODO: Fix autoderiver
  // return `（古韻羅馬字: ${kyonh(音韻地位)}，推導廣州音: ${gwongzau(音韻地位)}，推導日語漢音: ${kanon(音韻地位)}）`;
}
