import QieyunExamples from 'qieyun-examples-node';

function noThrow(f) {
  return function inner(...args) {
    try {
      return f(...args);
    } catch (e) {
      return '暫無資料';
    }
  };
}

const { kyonh, putonghua, gwongzau } = QieyunExamples;

const kyonh1 = noThrow(kyonh);
const putonghua1 = noThrow(putonghua);
const gwongzau1 = noThrow(gwongzau);

export default function 生成擬音(音韻地位) {
  return `（古韻羅馬字: ${kyonh1(音韻地位)}，推導普通話: ${putonghua1(音韻地位)}，推導廣州音: ${gwongzau1(音韻地位)}）`;
}
