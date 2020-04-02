大法官解釋
===================
從[司法院大法官](https://cons.judicial.gov.tw/jcc/modify/wall.html)網頁中擷取，並轉存成 JSON 。

## 檔案
陣列第 0 個元素常留白（`""`或是`{}`），以利取用特定釋字時，不用煩惱索引值和號碼間差一的問題。
* `all.json`: 各個解釋的所有（目前知道怎麼取出的）資料，每個元素均為物件。
* `holdings.json`: 各個解釋的解釋文，各元素為字串。
* `issues.json`: 各個解釋的爭點。

## 每號解釋的JSON
```js
{
	number: 718,
	date: "2014-03-21",
	title: "緊急性及偶發性集會遊行許可案",      ///< 700號開始，司法院有多個「XXXX案」的短述
	issue: "",      ///< 爭點
	holding: "",    ///< 解釋文，有些會分段（如第499號和第585號），則以`\n`為界
	reasoning: "",  ///< 理由書，分段以`\n`為界
}
```

## 技術
使用 npm 的 jsdom 時，注意其 `Node` 類別並沒有 `getElementById`, `getElementsByName` 等相關函數。
```bash
node download.js # 從司法院網站下載全文。
node parse.js # 從已存在本機的 HTML 檔中轉存成個別的 JSON 。
node mergeAll.js # 取出每個釋字中需要的部分，湊成 JSON 檔案。
```

## 資料處理注意事項
部分釋字的換行處跟其他不一樣，例如 #110 。另如 #499 在引用德文文獻時有段落中換行的情形。

## 著作權宣告
CC0

## 更新紀錄

### 2.0
* 配合司法院新版網站。
* 取消輸出 XSS 。
* 取消輸出 `dates.json` 和 `titles.json` 。
* 取消上傳 `downloads/*.html` 。
* 恢復大部分釋字各段首的兩個全形空白。
