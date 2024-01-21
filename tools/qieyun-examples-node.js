import { promises as fs } from "fs";
import https from "https";

// 創建並进入緩存目錄
async function createAndEnterCache() {
  await fs.mkdir("./tools/.cache", { recursive: true });
  process.chdir("./tools/.cache");
}

// 下載文件
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += Buffer.from(chunk, "binary").toString("utf-8");
      });
      response.on("end", () => resolve(data));
      response.on("error", (err) => reject(err));
    }).on("error", (err) => {
      console.log(
        "Error | 錯誤: ",
        err.message
      );
    });
  });
}

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
  }
}

// 檢查文件中是否含有特定字符
async function checkFileForCharacters(filePath, characters) {
  const fileContent = await fs.readFile(filePath, "utf8");
  const foundCharacters = characters.filter(character => fileContent.includes(character));
  if (foundCharacters.length > 0) {
    throw new CustomError(
      `Warning: Check to ${filePath} may have defective characters ${foundCharacters.join(" ")}, please try running the update script repeatedly or manually fixing it before creating the development preview environment or building the artifacts.\n
      警告: 檢查到 ${filePath} 中可能存在 ${foundCharacters.join(" ")} 等错误编码字符，請嘗試重複運行更新腳本或在創建開發預覽環境或構建構建成品前人工修正一下。`,
    );
  }
}

// 主函數
async function main() {
  await createAndEnterCache();

  const baseUrl = "https://quantil.jsdelivr.net/gh/nk2028/qieyun-examples@main/";
  const fileNames = ["tupa.js", "putonghua.js", "gwongzau.js"];
  // 'unt.js',

  let
  qieyunExamples  = "import * as Qieyun from \"qieyun\";\n";
  qieyunExamples += "\n";
  qieyunExamples += "const 選項 = \"\";\n";
  qieyunExamples += "\n";
  qieyunExamples += "const QieyunExamples = {\n";

  for (const fileName of fileNames) {
    const fileContent = await downloadFile(`${baseUrl}${fileName}`);
    qieyunExamples += `    ${fileName.split(".")[0]}: function(音韻地位) { ${fileContent} },\n`;
  }

  qieyunExamples += "};\n";
  qieyunExamples += "export default QieyunExamples;";

  // 將結果寫入 `../../src/qieyun-examples-node.js`
  const filePath = "../../src/qieyun-examples-node.js";
  await fs.writeFile(filePath, qieyunExamples);

  // 檢查文件中是否含有特定字符
  const charactersToCheck = ["�", "�"]; // 在此列出需要檢查的字符
  try {
    await checkFileForCharacters(filePath, charactersToCheck);
  } catch (e) {
    if (e instanceof CustomError) {
      console.error(e.message);
    } else {
      throw e;
    }
  }

  console.log(
    "`../../src/qieyun-examples-node.js` has also been updated | `../../src/qieyun-examples-node.js` 也已更新",
  );
}

main().catch(e => {
  if (!(e instanceof CustomError)) {
    console.error(e);
  }
});
