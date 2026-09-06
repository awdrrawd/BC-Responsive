# Responsive_Liko 0.1.0 — 初版

獨立的 BC 插件，使用 2000×1000 Canvas 偏好設定頁；離開按鈕為 `(1815,75,90,90)`。

倉庫：<https://github.com/awdrrawd/BC-Responsive>。程式、建置指令與 loader 都位於倉庫根目錄；`TEMP/` 是本機參考資料，不參與建置或 Git 追蹤。

## 安裝與建置

三種安裝方式擇一，避免同時開啟不同版本：

- **正式 loader**：安裝根目錄的 `loader.user.js`，優先讀取 GitHub Pages 的 `https://awdrrawd.github.io/BC-Responsive/dist/main.js`，失敗或逾時才改用 jsDelivr。必須先把建置產物推送到 GitHub。
- **本機測試 loader**：在根目錄執行 `npm run dev`，再安裝 `loader.local.user.js`。每次重新整理 BC，都從 `http://127.0.0.1:5175/main.js` 載入。

載入後在偏好設定內開啟 **Responsive_Liko**。`npm run build` 只建立 `dist/main.js` 與 `dist/main.js.map`，不會修改任何 loader。正式與本機 loader 是獨立、人工維護的入口。

其他插件管理器可優先載入 `https://awdrrawd.github.io/BC-Responsive/dist/main.js`，失敗時改載入 `https://cdn.jsdelivr.net/gh/awdrrawd/BC-Responsive@main/dist/main.js`。等待腳本完成後，可用 `window.Liko?.Responsive_Liko?.getState()` 確認初始化；重複載入會由插件自身阻止。

Loader 可防止重複載入，載入失敗時會在 console 記錄原因。`window.Liko.Responsive_LikoLoader` 提供下載狀態；引擎就緒狀態仍以 `window.Liko.Responsive_Liko.getState()` 為準。本機來源若被瀏覽器限制，需依瀏覽器提示處理 localhost 連線權限。

新安裝預設停用，先匯入／建立人格，再啟用。舊版 Responsive 請先停用，避免兩份回覆引擎重複發送。

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run serve
```

預覽頁：`http://127.0.0.1:5175`。重複執行時會辨識並沿用同一專案的預覽服務，重新整理即可讀取最新建置；若埠被其他程式或舊版預覽占用，會提示先在原視窗按 Ctrl+C，並保留原服務。這是 BC API 模擬畫面，不連線、不向遊戲發送訊息。

## 初版功能

- 總開關、反應、口型、中斷、BCX 預先檢查；停用取消排程與暫存動畫。
- 多人格、新增、切換、改名、Base64 匯入／匯出，獨立 `ExtensionSettings.Responsive_Liko` 儲存。
- 互動／高潮／趣味／事件／語癖五類。高潮結果使用「所有結果／高潮／拒絕／忍耐」。
- 動作目錄依遊戲已註冊動作建立，名稱走 BC 字典與原始 ID 回退；設定目錄與執行可用性分開。
- 回應工具列主回應排第一，留間隔後排列文字、動作、特殊動作，刪除靠右；語癖列表的刪除同樣靠右。特殊動畫可同時選耳朵（HairAccessory2）、尾巴（TailStraps）、翅膀（Wings），名稱優先讀取遊戲翻譯，共用次數與動畫秒數。設定視窗寬 1500，部位卡片一個時置中、兩個時左右排列、三個時並排，並支援拖動捲動；狀態 B 可選「同服裝」，沿用 A 的物件，顏色與屬性仍獨立設定。
- 各部位 A／B 可選物件，或按「更衣室設定」使用角色副本調整顏色與物件支援的座標、屬性；在更衣室確認後返回原設定視窗，取消則不保存。動畫結束停在 A，取消執行則恢復原先外觀。
- 動作名稱參考 QuickInteraction，直接讀取遊戲 `ActivityDictionaryText` 與模組註冊的遊戲字典；英文原文讀取遊戲 CSV 快取。PTT 動作列表只作為搜尋字形對照的參考，不提供翻譯、別名或分類搜尋。
- 動作搜尋參考 AEE 的 `searchText.ts`：NFKC、大小寫與繁簡正規化，忽略空白及分隔符號，先檢查完整包含，再按字元順序做模糊比對；保留原目錄順序。依 PTT 原檔整理的 84 筆繁體 → 簡體對照（例如撥 → 拨；繁簡相同的字直接原樣比對，不列入表內）讓「拨动铃铛」「撥動鈴鐺」「拨動铃铛」皆可匹配遊戲的同一名稱，也可用遊戲英文原文或動作 ID 搜尋。執行時不需 PTT 檔案。
- 進階 JSON 支援限時 expression 與同組多步驟。
- 符合條件的一般回應合併後等機率選一組。按工具列「主回應」後點選回應列，每條規則限一個；選中者置頂、加上邊框及左上角向左旋轉 45 度的皇冠，再選同一條可取消。先執行主回應，50 ms 後再執行同規則選中的另一個回應；僅有主回應時只執行一次。延遲中的第二條也會在停用或離房時取消。
- 語癖以按鈕依序選擇全部、僅聊天、僅悄悄話，以及弱、中、強、中毒四級嚴重度；觸發機率使用 0～100% 滑桿，不使用規則白名單。弱僅句尾；中固定句尾並隨機插入句中；強最多三次插入；中毒再替換 1～2 個字。依句長縮減，單字「好」中毒時可變成「喵」。多條適用語癖規則只抽一條，避免反覆堆疊；被遊戲阻擋送出時恢復原草稿。
- 人體互動設定面板依部位列出已註冊動作，全部部位列出完整目錄，文字搜尋即時篩選；每次開啟面板建立一次已正規化的搜尋索引，輸入只更新結果區，不重建整個設定畫面；設定清單不受玩家此刻能否對自己執行動作影響，實際執行時才檢查權限與前置條件。
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

原版 LCE 沒有接收端；若偵測其同類功能開啟，本插件不會競爭接管。支援協調的插件可透過 `registerConsumer` 主動註冊，`integrations/lce-responsive-compat.js` 提供接收端參考。本專案不再提供修改外部插件原始碼的補丁腳本。新版只宣告實際具備的能力。

## 邊界與後續

特殊動畫的 A／B 狀態支援獨立 Property／顏色，透過原生更衣室編輯角色副本；播放期間停用模組會取消計時並還原原裝備。LCE 完整自動表情引擎與多步驟的視覺編排器仍是後續項目。

BCX 預先檢查是保守阻擋：發言限制／必用詞／指定聲音等規則生效時跳過 Chat；Emote 和 Action 依敘述規則檢查。它不是完整語句合法性求解器，不修改或關閉 BCX 規則。Activity 仍走遊戲可用性與正常 hooks。

目前不提供 BCX 那種僅雙方可見的定向歡迎，文字回應為房間公開訊息。完整載入房間不會把既有成員當成新訪客。

保留原人格為備份，先在合適的測試房驗證。自動化測試與預覽不等於線上 BC／所有第三方插件版本的相容性驗證。

## 授權

新增程式沿用上層 MIT 授權。依賴 ModSDK 1.2.0（Jomshir98，MIT）、LZString 1.5.0（Pieroxy，MIT）。建置輸出包含依賴，相關授權見 `licenses/`。LCE 接收端為本專案新增程式，未複製其表情引擎或 BCAR 原始碼。
