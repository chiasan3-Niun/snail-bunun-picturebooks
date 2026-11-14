---
name: self-learning-interactive-websites
description: Use when a learner wants an agent to turn source text and supplied media into an independent interactive learning website, including flashcards, audio, image-based exercises, game levels, asset processing, testing, and deployment.
---

# 自學互動式網站

把教材原始資料轉成可自學的互動式網站。使用者只需要指定要製作的專案位置；資料夾與檔案由 agent 建立。

## 專案資料夾建立規則

使用者指定專案位置後，agent 必須立即執行建立資料夾的動作，在該專案根目錄建立名為 `自學互動式網站` 的資料夾；不要先搜尋它是否存在，也不要因找不到而要求使用者建立。若資料夾已存在，就直接使用並保留其中原有檔案。網站原始碼、`DESIGN.md`、教材整理、圖片素材、音檔、授權紀錄、測試與部署設定都放在這個資料夾內；原始教材若需保留，放在其下的 `source/`，衍生素材放在 `assets/` 或明確命名的子資料夾。

建立後，agent 要把本次網站製作所需的設計規格、網站檔案、素材與測試設定直接寫入這個資料夾。Skill 本身的參考檔從已安裝的 skill 目錄讀取，不要求使用者另外建立或複製 skill 內部資料夾。

## 必要的設計前置步驟

建立 `自學互動式網站` 資料夾後，必須在該資料夾內建立並讀取 `DESIGN.md`。它是網站的視覺設計規格，不是可省略的參考文件；至少要明確定義色彩角色、字體層級、元件樣式、間距、版面、陰影、響應式規則與互動狀態。

設計規格可依照 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 的 `DESIGN.md` 格式建立。先從該 repository 的 `design-md/` 選擇最接近的風格，或根據使用者需求建立一份新的 `DESIGN.md`；不得在沒有設計規格的情況下直接用預設 CSS 開始製作。若使用者指定了參考網站，先分析其公開可見的設計特徵，再把分析結果寫入本專案的 `DESIGN.md`。

`DESIGN.md` 必須與網站程式一起保留，並在完成回報中列出其來源、採用的設計決定與尚未確認的部分。使用上游文件時遵守其授權與來源要求，不要把上游網站的商標、圖片或受限制素材誤當成可直接複製的資產。

## 先讀取

開始前讀取：

- `自學互動式網站/DESIGN.md`：本專案的視覺設計系統；若不存在，由 agent 先建立，再進入網站製作。
- [workflow.md](references/workflow.md)：完整工作流程與輸出格式。
- [prompt-template.md](references/prompt-template.md)：使用者可直接複製的提示詞。
- [example-luanqun-animal-flashcards.md](references/example-luanqun-animal-flashcards.md)：巒群布農語動物閃卡案例。

## 核心規則

1. 先掃描文件、圖片、音檔與既有專案，再提出資料清單與不確定事項。
2. 保留原始語言拼寫、方言與翻譯來源；不自行猜測或改寫不確定內容。
3. 原始圖片不可覆寫。需要測驗用圖片時，輸出到獨立的衍生素材目錄。
4. 不要求使用者預先命名音檔、建立資料夾或生成第二套圖片；這些由 agent 處理。
5. 圖片素材優先使用生圖功能。依目前可用的連線與權限，選擇 ChatGPT Image、Gemini、Canva 或其他免費生圖工具；使用者沒有付費方案時，不得把付費服務當成必要條件，應改用可免費使用的工具或可合法重用的免費素材。
6. 每張圖片都要記錄生成工具或來源網址、建立日期、授權／使用條款、是否需要署名與限制。只使用能確認可合法使用的圖片；授權不明、需要付費授權、含未授權人物／商標或從搜尋結果直接抓取的圖片，不可放進公開網站。
7. 若語音網站沒有可用 API，依網站允許的方式取得音檔；不能假裝音檔已產生，也不能繞過登入、驗證或下載限制。
8. 閃卡、測驗、遊戲關卡與部署設定要依使用者需求建立成獨立專案，不要自動併入其他既有網站。
9. 族語語音合成使用[族語 AI 語音合成系統](https://ai-labs.ilrdf.org.tw/hnang-kari-ai-asi-sluhay/)。製作網站前先進入系統，確認要使用的語言別與方言別，向使用者回報選擇並處理不確定性；不得因文字看起來相似就自行猜測方言。確認後才取得或產生音檔，並在內容清單記錄語言別、方言別、音檔對應與來源。
10. 上傳素材、登入服務、公開部署或傳送私人資料前，先取得使用者對該特定目的的確認。若語音系統需要登入、驗證或下載權限，停在需要使用者處理的位置，不繞過限制。
11. 完成前執行資產檢查、功能測試與手機／電腦版面檢查；測試失敗時先修正再回報。

## 語音錯誤回報與重新生成

每一個有語音的單字、例句或教學項目，都要提供「回報音檔錯誤」與「修改文字／備註」入口。使用者送出後，保留原音檔與錯誤紀錄，不直接覆寫；重新確認文字、語言別、方言別與修改內容後，才重新生成或取得新音檔。新音檔通過播放與對應檢查後，才設為目前版本，並保留版本或日期紀錄。

## 可攜式腳本

從 skill 根目錄執行：

```text
python scripts/scan_assets.py <素材目錄> --output <asset-inventory.json>
python scripts/build_manifest.py <內容資料.json> --output <manifest.json>
python scripts/crop_images.py --input <圖片目錄> --output <衍生圖片目錄> --crop-map <crop-map.json>
python scripts/validate_assets.py --manifest <manifest.json> --root <專案目錄>
python scripts/run_site_checks.py <網站目錄>
```

腳本是輔助工具，不取代 agent 對族語內容、圖片對應、互動設計與部署權限的判斷。

## 完成回報

回報必須分開說明：

- 已讀取與已確認的教材資料。
- 已建立的頁面、功能與資產。
- 測試命令與結果。
- 尚未確認的族語、圖片或音檔問題。
- 是否已部署；若已部署，提供已驗證的網址；若未部署，說明需要的授權或使用者動作。
