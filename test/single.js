import * as Qieyun from "qieyun";
import { puonqtshet } from "../src/PuonqTshet.js";

const 上字音韻地位 = Qieyun.音韻地位.from描述("端開一登入");
const 下字音韻地位 = Qieyun.音韻地位.from描述("匣一東平");

const { 反切過程 } = puonqtshet(上字音韻地位, 下字音韻地位);

console.log(反切過程.join("\n"));
