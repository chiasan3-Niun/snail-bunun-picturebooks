# 巒群布農語動物閃卡 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在既有網站中加入 10 張巒群布農語動物閃卡、族語自動播放與 10 題聽音選圖片測驗。

**Architecture:** 沿用現有原生 HTML/CSS/JavaScript 單頁架構，在現有首頁新增獨立的動物閃卡畫面；資料集中放在 `src/data.js`，互動邏輯放在 `src/app.js`，樣式放在 `src/styles.css`。語音以本機 MP3/WAV 資產載入，不依賴即時語音 API。

**Tech Stack:** 原生 HTML、CSS、JavaScript ES modules、瀏覽器 Audio API、Node test。

**Spec:** `docs/superpowers/specs/2026-11-12-luanqun-animal-flashcards-design.md`

## Global Constraints

- 使用提供的 10 張 JPG 圖檔，不修改原始圖檔。
- 語音使用指定網站的「布農＿巒群＿男聲」。
- 自動播放只播放族語單字與族語例句，不播放中文翻譯。
- 測驗固定 10 題，每題提供 3 張圖片選擇。
- 不加入登入、跨裝置學習紀錄或遊戲關卡。
- 族語拼寫與例句以 Word 文件及圖卡交叉核對，不自行改寫未確認內容。

## Review Focus

- 圖片或音檔缺失時，卡片仍應顯示可理解的錯誤提示；在資產檢查測試中驗證。
- 自動播放切換卡片時不可播放中文；在互動邏輯測試中驗證只建立兩段族語播放序列。
- 測驗每題必須是 3 張不同圖片且答案可判定；在資料測試中驗證。
- 最後一題作答後不可多出第 11 題；在測驗狀態測試中驗證。
- 手機寬度下按鈕與圖片不可溢出；在 CSS 靜態檢查中驗證響應式規則。

### Task 1: Add Animal Flashcard Data and Assets

**Files:**
- Modify: `src/data.js`
- Create: `assets/animal-flashcards/*.jpg`
- Create: `assets/animal-flashcards/audio/*.mp3`
- Test: `tests/animal-flashcards.test.mjs`

**Interfaces:**
- Produces `animalFlashcards`, an array of 10 objects with `id`, `image`, `word`, `sentence`, `translation`, `wordAudio`, and `sentenceAudio`.

- [ ] **Step 1: Write failing data tests** for exactly 10 cards, unique IDs, non-empty族語欄位, three-choice-ready image paths, and audio paths.
- [ ] **Step 2: Run `node --test tests/animal-flashcards.test.mjs` and verify it fails** because the data and assets do not yet exist.
- [ ] **Step 3: Copy the 10 supplied JPG files** into `assets/animal-flashcards/` with stable lowercase IDs; preserve originals in Downloads.
- [ ] **Step 4: Add the verified Word/image text** to `animalFlashcards` and add the 20 generated audio asset paths.
- [ ] **Step 5: Run the data test and verify it passes**, including filesystem existence checks.

### Task 2: Add Flashcard and Quiz Screen Markup

**Files:**
- Modify: `index.html`
- Test: `tests/animal-flashcards.test.mjs`

**Interfaces:**
- Produces `#animal-learning` screen with `#flashcard`, `#flashcard-image`, `#flashcard-word`, `#flashcard-sentence`, `#flashcard-translation`, `#play-word`, `#play-sentence`, `#autoplay-toggle`, navigation controls, and quiz containers.

- [ ] **Step 1: Add failing markup assertions** for the screen, the two族語 audio buttons, autoplay control, and quiz answer area.
- [ ] **Step 2: Run the focused test and verify it fails** because the elements are absent.
- [ ] **Step 3: Add the new screen and a navigation link** without changing existing picture-book screens.
- [ ] **Step 4: Run the focused test and verify it passes.**

### Task 3: Implement Flashcard Playback and Navigation

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/animal-flashcards.test.mjs`

**Interfaces:**
- Uses `animalFlashcards`.
- Produces `renderAnimalFlashcard(index)`, `playCurrentCard()`, and `setAnimalRoute()` behavior through DOM event handlers.

- [ ] **Step 1: Write failing behavior tests** for rendering one card, next/previous navigation, flip state, individual word/sentence playback, and autoplay sequencing.
- [ ] **Step 2: Run the focused tests and verify they fail.**
- [ ] **Step 3: Implement the smallest state model** with current index, flipped state, autoplay flag, and one `Audio` instance at a time; autoplay queues only `wordAudio` then `sentenceAudio`.
- [ ] **Step 4: Add responsive card and control styles** for desktop and widths below 700px.
- [ ] **Step 5: Run tests and verify all playback/navigation assertions pass.**

### Task 4: Implement 10-Question Listen-and-Choose Quiz

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/animal-flashcards.test.mjs`

**Interfaces:**
- Produces quiz state with `questionIndex`, `score`, `currentAnswerId`, and exactly 10 questions; each question exposes `promptAudio` and three distinct card choices.

- [ ] **Step 1: Write failing quiz tests** for 10 questions, three choices, immediate feedback, score increment, and completion after question 10.
- [ ] **Step 2: Run the focused tests and verify they fail.**
- [ ] **Step 3: Implement deterministic quiz generation** from the 10 cards, shuffled choices, and playback of the族語 prompt only.
- [ ] **Step 4: Add quiz result and restart controls** while keeping Chinese translation out of audio playback.
- [ ] **Step 5: Run tests and verify the full quiz state cycle passes.**

### Task 5: Verify the Integrated Page

**Files:**
- Modify: `tests/animal-flashcards.test.mjs` if needed for integration assertions.

- [ ] **Step 1: Run the complete available test command** and confirm existing website tests still pass.
- [ ] **Step 2: Start the local preview using the project’s existing workflow** and inspect the flashcard route at desktop and mobile widths.
- [ ] **Step 3: Manually verify** image display, card flip, two族語 playback buttons, autoplay toggle, and all 10 quiz questions.
- [ ] **Step 4: Check browser console for errors** and correct only issues introduced by this feature.
