# Responsive_Liko 0.1.0 — 初版

獨立的 BC 插件，使用 2000×1000 Canvas 偏好設定頁；離開按鈕為 `(1815,75,90,90)`。

倉庫：<https://github.com/awdrrawd/BC-Responsive>。程式、建置指令與 loader 都位於倉庫根目錄；`TEMP/` 是本機參考資料，不參與建置或 Git 追蹤。

## 安裝與建置

三種安裝方式擇一，避免同時開啟不同版本：

- **正式 loader**：安裝根目錄的 `loader.user.js`，由 jsDelivr 讀取 `awdrrawd/BC-Responsive@main/dist/main.js`。必須先把建置產物推送到 GitHub；CDN 更新可能有快取延遲。
- **本機測試 loader**：在根目錄執行 `npm run dev`，再安裝 `loader.local.user.js`。每次重新整理 BC，都從 `http://127.0.0.1:5175/main.js` 載入。

載入後在偏好設定內開啟 **Responsive_Liko**。`npm run build` 只建立 `dist/main.js` 與 `dist/main.js.map`，不會修改任何 loader。正式與本機 loader 是獨立、人工維護的入口。

其他插件管理器只要載入 `https://cdn.jsdelivr.net/gh/awdrrawd/BC-Responsive@main/dist/main.js`。等待腳本完成後，可用 `window.Liko?.Responsive_Liko?.getState()` 確認初始化；重複載入會由插件自身阻止。

Loader 可防止重複載入，載入失敗時會在 console 記錄原因。`window.Liko.Responsive_LikoLoader` 提供下載狀態；引擎就緒狀態仍以 `window.Liko.Responsive_Liko.getState()` 為準。本機來源若被瀏覽器限制，需依瀏覽器提示處理 localhost 連線權限。

新安裝預設停用，先匯入／建立人格，再啟用。舊版 Responsive 請先停用，避免兩份回覆引擎重複發送。

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run serve
```

預覽頁：`http://127.0.0.1:5175`。這是 BC API 模擬畫面，不連線、不向遊戲發送訊息。

## 初版功能

- 總開關、反應、口型、中斷、BCX 預先檢查；停用取消排程與暫存動畫。
- 多人格、新增、切換、改名、Base64 匯入／匯出，獨立 `ExtensionSettings.Responsive_Liko` 儲存。
- 互動／高潮／趣味／事件四類。歡迎是事件 `join`，離開是 `leave`。
- 動作目錄依遊戲已註冊動作建立，名稱走 BC 字典與原始 ID 回退；設定目錄與執行可用性分開。
- Chat、Emote、Action、實際 Activity，以及可切換同一裝備部位 A／B 狀態的特殊動畫；特殊動畫可附帶三種訊息之一，也可只播放動畫。
- 進階 JSON 支援限時 expression 與同組多步驟。
- 符合條件的回應組合併後等機率選一組，組內按順序執行，不保證網路原子性。
- 同人同規則去重可設定。實際 Activity 另有同人同動作五秒去重，避免自動回抱循環；不同人互不阻擋。
- 口型只影響本地繪製，不同步外觀。表情步驟會同步並在期限後有條件復原。
- TW、CN、EN 字表。相容 Liko I18N v1。

## 舊人格匯入

主設定 → 匯入 → 貼上 → 解析預覽 → 新增匯入人格。匯入不會自動切換，也不覆蓋同名人格；同名自動加尾碼。

- 支援 `BCResponsive-master` 的 LZString/Base64 人格（name/responses）及 V2 personalities 容器。
- 支援本版 Base64 匯出包；為了除錯也保留匯入本版原始 JSON 的能力。
- 支援 `Responsive-main` 的 `ResponsesModule`、`{name,data:{ResponsesModule}}` 和 mainResponses JSON。其人格頁只有本地存取，沒有同格式的人格分享碼。
- 保留原始文字及動作 ID；未知動作仍保留，待相應模組載入便可匹配。
- 舊版 action 保留為 Action；`Responsive-main` 的 @/@@ 轉為 Action，* 轉 Emote。
- BCResponsive 的趣味條件保留「讀取發起者狀態」語意；原版未生效的 apply_favorite 留在 legacy metadata。
- 原版沒有匯出的黑名單無法復原；無法識別或損壞的資料會拒絕匯入，不改寫設定。
- 不匯入全域啟用狀態；Responsive-main 原本未使用的 extraResponses 句庫保留但停用。
- 更早 V1 整體設定不在這版匯入範圍。

## 組合回應

一般編輯器每行一條隨機回應。進階 JSON 以整條規則編輯；切換到 JSON 之前會保留尚未保存的欄位。

以下為進房後問候並擁抱的規則。`Hug` 與部位需以當前遊戲的動作目錄為準；執行前會重新檢查可用性，無法執行則跳過並記錄原因。

```json
{
  "id": "welcome-friend",
  "name": "歡迎朋友",
  "enabled": true,
  "trigger": { "kind": "event", "event": "join", "members": [12345] },
  "delayMs": 5000,
  "dedupeMs": 60000,
  "choices": [
    { "id": "hello-hug", "steps": [
      { "type": "chat", "text": "歡迎，{other}！" },
      { "type": "activity", "activity": "Hug", "group": "ItemArms" }
    ] }
  ]
}
```

限時表情步驟：`{"type":"expression","group":"Mouth","value":"Smile","durationMs":2000}`。只接受裝備支援的表情；若結束時該物品或表情已改變，不寫回舊值。頭頂圖示可用 `Emoticon` 群組，但未提供專用圖示選單。

## 公開 API 與 LCE

`window.Liko.Responsive_Liko`：

- `getState()`：apiVersion、version、ready、enabled、activePersona、desired、capabilities、scope。
- `isActive('mouth' | 'expressions')`：是否實際接管。
- `subscribe(callback)`：立即給快照，狀態改變後通知；返回取消訂閱函式。
- `registerConsumer(name, handler)`：接管協調。handler 收到 desired，須同步停止競爭寫入，再返回 true；不可在 handler 內呼叫 refresh。
- `refresh()`：重新協調。
- `stop()`：本次載入停止；重新整理才能啟動。
- `lastDiagnostic`：最近跳過／錯誤原因。
- 瀏覽器事件 `Responsive_Liko:state` 用於插件晚載入發現。

原版 LCE 沒有接收端；若偵測其同類功能開啟，本插件不會競爭接管。此倉庫附有小型 LCE 接收端與可重複執行的連接腳本：

```sh
node scripts/link-lce.mjs <BC-LCE倉庫路徑>
```

連接後須重新建置及載入 LCE。LCE 設定值不變；Responsive 接管時停止對應功能，釋放時恢復。LCE 原引擎將表情與姿勢綁在同一循環，因此初版接管表情時會一併暫停該循環。新版只宣告實際具備的能力，不會假裝已接管耳尾等尚未提供的功能。

## 邊界與後續

特殊動畫目前以同一裝備部位的兩個資產作為 A／B 狀態，支援切換次數與動畫總長；播放期間停用模組會取消計時並還原原裝備。BCAR 中同一資產的不同 Property／顏色狀態尚未納入圖形編輯器。LCE 完整自動表情引擎與多步驟的視覺編排器仍是後續項目。

BCX 預先檢查是保守阻擋：發言限制／必用詞／指定聲音等規則生效時跳過 Chat；Emote 和 Action 依敘述規則檢查。它不是完整語句合法性求解器，不修改或關閉 BCX 規則。Activity 仍走遊戲可用性與正常 hooks。

目前不提供 BCX 那種僅雙方可見的定向歡迎，文字回應為房間公開訊息。完整載入房間不會把既有成員當成新訪客。

保留原人格為備份，先在合適的測試房驗證。自動化測試與預覽不等於線上 BC／所有第三方插件版本的相容性驗證。

## 授權

新增程式沿用上層 MIT 授權。依賴 ModSDK 1.2.0（Jomshir98，MIT）、LZString 1.5.0（Pieroxy，MIT）。建置輸出包含依賴，相關授權見 `licenses/`。LCE 接收端為本專案新增程式，未複製其表情引擎或 BCAR 原始碼。
