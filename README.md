# Pyanxchet

A tool to automate the process of obtaining the phonological position of the Qieyun phonological system (《切韻》音系) of a Chinese character by its fanqie (反切) .

Please visit the webpage at [nk2028.shn.hk/pyanxchet/](https://nk2028.shn.hk/pyanxchet/ "自動反切器") .

## Deployment Instructions

This project uses [Vite](https://vitejs.dev/ "Vite | Next Generation Frontend Tooling") as the frontend bundling tool. For ease of deployment on GitHub Pages and similar services, `package.json` and `vite.config.js` are set by default to use the public path `/pyanxchet/`. When browsing, be sure to pay attention to whether the URL is in the form of `domain.or.ip/pyanxchet/`.

If you are debugging, maintaining, or wish to independently deploy on services like Cloudflare Pages, which by default store resources at the root path `/`, please add the flag `--base=/` when executing `run build`, i.e., `run build --base=/`. Alternatively, modifying the relevant parameters in `package.json` and `vite.config.js` is also an effective method. This way, you can access the project directly using the domain format `domain.or.ip`.

## Maintenance Instructions

This project uses [Bun](https://bun.sh/ "Bun — A fast all-in-one JavaScript runtime") as its runtime environment and package management, which may conflict or differ from the commonly familiar [Node.js](https://nodejs.org/en/ "Node.js"). When debugging and maintaining, you may need to refer to its documentation or consult relevant development communities.

# 自動反切器

自動反切器可以根據反切自動得到被切字的中古音韻地位及現代發音，並附有詳細的推理步驟及規則説明。

請瀏覽網頁於 [nk2028.shn.hk/pyanxchet/](https://nk2028.shn.hk/pyanxchet/ "自動反切器") 。

## 部署説明

本項目採用 [Vite](https://cn.vitejs.dev/ "Vite | 下一代的前端工具链") 為前端打包工具。為方便部署在 GitHub Pages 及同類型的服務上， `package.json` 與 `vite.config.js` 默認設置公共路徑為 `/pyanxchet/` ，您瀏覽時務必注意 URL 是否為類似 `domain.or.ip/pyanxchet/` 的形式。

若您在調試、維護，或想自行部署在 Cloudflare Pages 等默認保存靜態資源在一級根路徑 `/` 下的服務，請在打包構建 `run build` 時附上標識參數 `--base=/` ，即 `run build --base=/` ，或修改 `package.json` 與 `vite.config.js` 中的相關參數亦是可行的方法。如此您就可以直接以域名 `domain.or.ip` 的形式訪問了。

## 維護説明

本項目採用 [Bun](https://bun.sh/ "Bun — A fast all-in-one JavaScript runtime") 為運行時環境和包管理器，這與普遍熟悉的 [Node.js](https://nodejs.org/en/ "Node.js") 的相關認識可能存在衝突或矛盾。您在調試維護時也許需要自行查閲其文檔或諮詢相關開發社區。