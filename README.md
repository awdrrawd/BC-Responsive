# Responsive_Liko 0.1.4

獨立的 BC 插件，使用 2000×1000 Canvas 偏好設定頁；離開按鈕為 `(1815,75,90,90)`。

倉庫：<https://github.com/awdrrawd/BC-Responsive>。程式、建置指令與 loader 都位於倉庫根目錄；`TEMP/` 是本機參考資料，不參與建置或 Git 追蹤。

`dist/` 是建置產物，**不提交進倉庫**：`main.js`（極小入口，負責防重複載入）與 `app-<hash>.js`（實際程式）由 GitHub Actions 在 `main` 更新時建置並部署到 Pages。本機可隨時 `npm run build`，但產物被 `.gitignore` 排除，不會造成提交差異。

## 安裝與建置

三種安裝方式擇一，避免同時開啟不同版本：

- **正式 loader**：安裝根目錄的 `loader.user.js`，從 GitHub Pages 的 `https://awdrrawd.github.io/BC-Responsive/dist/main.js` 載入（加時間戳避免舊快取，失敗會再試一次）。Pages 由 Actions 部署，不需要手動推送建置產物；loader 本身也發佈在 `https://awdrrawd.github.io/BC-Responsive/loader.user.js`，已設定 `@updateURL`。
- **本機測試 loader**：在根目錄執行 `npm run dev`，再安裝 `loader.local.user.js`。每次重新整理 BC，都從 `http://127.0.0.1:5175/main.js` 載入。`npm run dev` 會監看原始碼並自動重建，存檔後重新整理即可。

載入後在偏好設定內開啟 **Responsive_Liko**。`npm run build` 只建立 `dist/`（`main.js`、`app-<hash>.js` 及各自的 `.map`，並自動清掉舊的 app 檔），不會修改任何 loader。正式與本機 loader 是獨立、人工維護的入口。

其他插件管理器可載入 `https://awdrrawd.github.io/BC-Responsive/dist/main.js`（一般 `<script>` 即可，它會自行以相對路徑載入同目錄的 `app-<hash>.js`）。因為不再提交 `dist/`，沒有 jsDelivr 的 `gh/...@main/dist` 可用。等待腳本完成後，可用 `window.Liko?.Responsive_Liko?.getState()` 確認初始化；重複載入會由插件自身阻止。

Loader 可防止重複載入，載入失敗時會在 console 記錄原因。`window.Liko.Responsive_LikoLoader` 提供下載狀態；引擎就緒狀態仍以 `window.Liko.Responsive_Liko.getState()` 為準。本機來源若被瀏覽器限制，需依瀏覽器提示處理 localhost 連線權限。

新安裝預設停用，先匯入／建立人格，再啟用。舊版 Responsive 請先停用，避免兩份回覆引擎重複發送。

```sh
npm ci --ignore-scripts
npm test
npm run build      # 產生 dist/（不提交）
npm run dev        # 監看建置 + 預覽伺服器
npm run check      # format:check + test + build，推送前一次跑完
```

預覽頁：`http://127.0.0.1:5175`。重複執行時會辨識並沿用同一專案的預覽服務，重新整理即可讀取最新建置；若埠被其他程式或舊版預覽占用，會提示先在原視窗按 Ctrl+C，並保留原服務。這是 BC API 模擬畫面，不連線、不向遊戲發送訊息。

## 自動化

- **Pages 部署**（`.github/workflows/static.yml`）：推送到 `main` 時執行格式檢查、測試、建置，並把 `dist/` 放到站台的 `dist/` 路徑（舊版已安裝的 loader 也讀這個路徑）、`loader.user.js` 與 `licenses/` 一併發佈。
- **PR 檢查**（`.github/workflows/checks.yml`）：拒絕提交 `dist/`、格式檢查、測試、建置，並在 PR 留言比較 bundle 大小（`scripts/bundle-size.mjs`，每次推送更新同一則）。
- **Dependabot**（`.github/dependabot.yml`）：每週一檢查 npm 與 GitHub Actions，小版本與修補版合併成一個 PR。
- **BC 函式掛鉤檢查**（`.github/workflows/bc-compat.yml`、`scripts/check-bc-compat.mjs`，移植自 AEE）：每週一抓 Bondage Club 程式碼鏡像，比對 Responsive 透過 ModSDK 掛鉤的函式（`ServerSend`、`ChatRoomSync`、`CommonDrawAppearanceBuild` 等）：函式是否還存在、內容雜湊是否與 `scripts/bc-compat-baseline.json` 相同。有差異時只開／更新一則 `bc-compat` 議題，不會擋 PR 或部署。本機執行 `npm run check:bc -- --bc-dir <BC 原始碼>`；確認掛鉤仍正確後，加上 `--update` 重寫基準。檢查器本身由 `tests/bc-compat-check.test.js` 測試，該測試也確認基準恰好涵蓋程式實際掛鉤的函式。
- **倉庫規則測試**（`tests/repo.test.js`）：`dist/` 必須在 `.gitignore`、workflow 發佈路徑必須與 loader 請求路徑一致、README 標題版本必須等於 `package.json`。

首次改成不提交 `dist/` 時，需要把已追蹤的產物從索引移除（檔案仍留在本機）：`git rm -r --cached dist`，再提交。同時到 GitHub 倉庫 Settings → Pages，把 Source 設為 **GitHub Actions**。

## 初版功能

- 總開關、反應、口型、中斷、BCX 預先檢查；停用取消排程與暫存動畫。
- 多人格、新增、切換、改名、Base64 匯入／匯出，獨立 `ExtensionSettings.Responsive_Liko` 儲存。
- 互動／高潮／趣味／事件／語癖五類。高潮結果使用「所有結果／高潮／拒絕／忍耐」。
- 動作目錄依遊戲已註冊動作建立，名稱走 BC 字典與原始 ID 回退；設定目錄與執行可用性分開。
- 回應工具列主回應排第一，留間隔後排列文字、動作、特殊動作，刪除靠右；語癖列表的刪除同樣靠右。特殊動畫可同時選耳朵（HairAccessory2）、尾巴（TailStraps）、翅膀（Wings），名稱優先讀取遊戲翻譯，共用次數與 A／B 切換間隔。設定視窗寬 1500，部位卡片一個時置中、兩個時左右排列、三個時並排，並支援拖動捲動；狀態 B 可選「同服裝」，沿用 A 的物件，顏色與屬性仍獨立設定。
- 各部位 A／B 可選物件，或按「更衣室設定」使用角色副本調整顏色與物件支援的座標、屬性；在更衣室確認後返回原設定視窗，取消則不保存。動畫結束停在 A，取消執行則恢復原先外觀。
- 動作名稱參考 QuickInteraction，直接讀取遊戲 `ActivityDictionaryText` 與模組註冊的遊戲字典；英文原文讀取遊戲 CSV 快取。PTT 動作列表只作為搜尋字形對照的參考，不提供翻譯、別名或分類搜尋。
- 動作搜尋參考 AEE 的 `searchText.ts`：NFKC、大小寫與繁簡正規化，忽略空白及分隔符號，先檢查完整包含，再按字元順序做模糊比對；保留原目錄順序。依 PTT 原檔整理的 84 筆繁體 → 簡體對照（例如撥 → 拨；繁簡相同的字直接原樣比對，不列入表內）讓「拨动铃铛」「撥動鈴鐺」「拨動铃铛」皆可匹配遊戲的同一名稱，也可用遊戲英文原文或動作 ID 搜尋。執行時不需 PTT 檔案。
- 進階 JSON 支援限時 expression 與同組多步驟。
- 符合條件的一般回應合併後等機率選一組。按工具列「主回應」後點選回應列，每條規則限一個；選中者置頂、加上邊框及左上角向左旋轉 45 度的皇冠，再選同一條可取消。先執行主回應，50 ms 後再執行同規則選中的另一個回應；僅有主回應時只執行一次。延遲中的第二條也會在停用或離房時取消。
- 語癖以按鈕依序選擇全部、僅聊天、僅悄悄話，以及弱、中、強、中毒四級嚴重度；觸發機率使用 0～100% 滑桿，不使用規則白名單。弱僅句尾；中固定句尾並隨機插入句中；強最多三次插入；中毒再替換 1～2 個字。依句長縮減，單字「好」中毒時可變成「喵」。多條適用語癖規則只抽一條，避免反覆堆疊；被遊戲阻擋送出時恢復原草稿。
- 人體互動設定面板依部位列出已註冊動作，全部部位列出完整目錄，文字搜尋即時篩選；每次開啟面板建立一次已正規化的搜尋索引，輸入只更新結果區，不重建整個設定畫面；設定清單不受玩家此刻能否對自己執行動作影響，實際執行時才檢查權限與前置條件。
- 同一人的互動回應共用 300ms 冷卻（觸發及實際回應時更新），不同人互不阻擋；不再疊加規則去重或五秒動作限制。他人進房的歡迎（`visitor`）另有每人 15 秒冷卻，避免反覆進出被連續歡迎。自動互動附帶標記，支援此標記的新版插件不會再對它自動回應。第三方或舊版插件未必支援；300ms 冷卻本身不保證阻斷慢速迴圈。
- 口型只影響本地繪製，不同步外觀。表情步驟會同步並在期限後有條件復原；重疊效果依疊層管理，各自到期不互相撤銷，HSC 控制期間讓位，LCE／WCE 引擎啟用時改為限時事件交由引擎到期。
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
  "dedupeMs": 0,
  "choices": [
    {
      "id": "hello-hug",
      "steps": [
        { "type": "chat", "text": "歡迎，{other}！" },
        { "type": "activity", "activity": "Hug", "group": "ItemArms" }
      ]
    }
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

新增程式沿用上層 MIT 授權。依賴 ModSDK 1.2.0（Jomshir98，MIT）、LZString 1.5.0（Pieroxy，MIT）。建置輸出包含依賴，授權全文見 `licenses/`（也隨 Pages 發佈），產物開頭另有指引註解。LCE 接收端為本專案新增程式，未複製其表情引擎或 BCAR 原始碼。
