# 蝸牛布農族飲食故事繪本網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立可在本機開啟的靜態繪本成果網站，展示五本繪本、內嵌 PDF、有聲影片預留入口、文化部補助說明與累計訪問人次位置。

**Architecture:** 使用原生 HTML、CSS、JavaScript，不引入框架或後端依賴。網站內容集中在 `src/data.js`，頁面由 `src/app.js` 產生，方便日後替換 YouTube 連結、補充 ISBN 或修改文字。

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, PDF iframe/embed.

**Spec:** `docs/superpowers/specs/2026-11-10-snail-bunun-picturebooks-design.md`

## Global Constraints

- 使用 `PDF壓縮檔` 作為正式線上閱讀檔。
- 不顯示 PDF 下載按鈕。
- 不公開補助金額、地址、電話或未核發 ISBN。
- YouTube 尚未上傳時使用準備中狀態，不放假網址。
- 正式計畫名稱必須是「布農族飲食文化全族語繪本及數位錄音製作語料保存暨推廣計畫」。

## Review Focus

- 五本繪本的名稱、語別與封面是否一一對應。
- PDF 閱讀區是否沒有顯示下載操作。
- 空白 YouTube 連結是否不會導向錯誤網址。
- 文化部部徽與補助說明是否清楚但不壓過繪本主視覺。
- 手機版首頁與繪本卡片是否仍可讀、可操作。

### Task 1: 建立可測試的內容資料模型

**Files:**
- Create: `tests/content-data.test.mjs`
- Create: `src/data.js`

- [ ] 寫測試確認五本繪本數量、每本有封面／PDF 路徑、正式計畫名稱正確，以及 YouTube 尚未設定時為空值。
- [ ] 執行測試，確認在 `src/data.js` 尚未存在時失敗。
- [ ] 建立最小資料模型。
- [ ] 執行測試確認通過。

### Task 2: 建立首頁與繪本閱讀互動

**Files:**
- Create: `index.html`
- Create: `src/app.js`
- Create: `src/styles.css`
- Modify: `src/data.js`

- [ ] 寫測試確認首頁包含計畫名稱、補助說明、五本繪本卡片與訪問人次位置。
- [ ] 執行測試確認失敗。
- [ ] 實作首頁、繪本卡片、繪本詳情區、PDF iframe 閱讀區與 YouTube 準備中／連結狀態。
- [ ] 執行測試確認通過。

### Task 3: 整理與複製公開素材

**Files:**
- Create: `assets/books/*`
- Create: `assets/culture/*`
- Modify: `index.html`

- [ ] 複製五張封面、五份壓縮 PDF、蜗牛 Logo、文化部部徽與方案 Logo。
- [ ] 更新素材路徑並檢查所有檔案存在。

### Task 4: 驗證靜態網站

- [ ] 執行完整測試。
- [ ] 使用本機 HTTP server 開啟網站，檢查首頁、五本書切換、PDF 內嵌閱讀、空白 YouTube 狀態和手機寬度排版。
- [ ] 檢查 Git diff，只保留本次網站相關檔案。
