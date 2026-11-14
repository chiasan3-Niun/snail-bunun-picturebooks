# 自學互動式網站 Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個可放入 GitHub、供 Codex 與 Claude Code 使用的跨代理 skill，讓 agent 從教材文本與素材自動完成互動式學習網站。

**Architecture:** 以 `SKILL.md` 作為代理工作規範，以 `references/` 放置完整流程、案例與提示詞模板，以 `scripts/` 提供不依賴特定代理平台的資產掃描、manifest 產生、圖片裁切、資產驗證與網站檢查工具。Skill 本身不綁定蝸牛繪本網站，也不把巒群布農語案例硬編碼成唯一網站。

**Tech Stack:** Markdown skill files, Python 3 standard library, Pillow only when available for image processing, Node.js/browser checks when the generated project provides them.

**Spec:** `docs/superpowers/specs/2026-11-13-educational-audio-flashcard-skill-design.md`

## Global Constraints

- 使用者只需提供文本、圖片素材、語音來源與功能目標。
- Agent 必須保留原始語言拼寫與來源脈絡，不能猜測不確定的族語內容。
- 原始圖片不可覆寫；裁切結果必須輸出到獨立目錄。
- 沒有使用者授權時，不得上傳私人資料、登入、公開部署或傳送教材。
- 新專案必須獨立建立，不得同步或修改蝸牛繪本網站。
- 部署結果必須區分本機完成、部署失敗與公開網址已驗證。

## Review Focus

- 混合副檔名與非文字檔素材：掃描工具只納入支援格式並清楚列出跳過項目。
- 同一素材存在重複或相似檔名：manifest 不能靜默覆蓋，必須保留候選與警告。
- 缺少音檔或圖片：驗證工具要回報缺少的相對路徑，不得宣稱完成。
- 未安裝 Pillow：圖片處理要提供清楚的依賴提示，不得產生假裁切檔。
- 私人資料與公開部署：README 與 SKILL 必須要求在實際傳送或部署前確認。

### Task 1: Create the portable skill entrypoint and references

**Files:**
- Create: `自學互動式網站/SKILL.md`
- Create: `自學互動式網站/README.md`
- Create: `自學互動式網站/references/workflow.md`
- Create: `自學互動式網站/references/example-luanqun-animal-flashcards.md`
- Create: `自學互動式網站/references/prompt-template.md`

**Interfaces:**
- `SKILL.md` tells an agent when to use the skill and how to run the workflow.
- `README.md` documents GitHub installation for Codex and Claude Code.
- References define input contract, output contract, case study, permissions and handoff format.

- [ ] **Step 1: Write content checks** for required frontmatter, installation commands, the two example URLs, permission gates, and the five script names.
- [ ] **Step 2: Run the checks and verify they fail** because the skill files do not yet exist.
- [ ] **Step 3: Write the minimal skill entrypoint, README, workflow, case study, and prompt template** using the approved design.
- [ ] **Step 4: Run content checks and verify they pass.**

### Task 2: Implement asset scanning and manifest generation

**Files:**
- Create: `自學互動式網站/scripts/scan_assets.py`
- Create: `自學互動式網站/scripts/build_manifest.py`
- Create: `自學互動式網站/tests/test_asset_tools.py`

**Interfaces:**
- `scan_assets.py <root> --output <json>` writes a JSON inventory with relative path, file type, byte size and warnings.
- `build_manifest.py <input.json> --output <manifest.json>` creates a stable manifest without changing source text.

- [ ] **Step 1: Write failing tests** for supported file discovery, skipped files, duplicate stems, stable ordering and preservation of non-ASCII text.
- [ ] **Step 2: Run `python -m unittest discover 自學互動式網站/tests -v` and verify failure.**
- [ ] **Step 3: Implement both scripts using only the Python standard library.**
- [ ] **Step 4: Run the focused tests and verify they pass.**

### Task 3: Implement safe image cropping and asset validation

**Files:**
- Create: `自學互動式網站/scripts/crop_images.py`
- Create: `自學互動式網站/scripts/validate_assets.py`
- Modify: `自學互動式網站/tests/test_asset_tools.py`

**Interfaces:**
- `crop_images.py --input <dir> --output <dir> --crop-map <json>` creates derived images and never modifies inputs.
- `validate_assets.py --manifest <json> --root <dir>` exits nonzero for missing or unreadable referenced assets and prints actionable paths.

- [ ] **Step 1: Add failing tests** for output isolation, crop-map validation, missing assets and readable error messages.
- [ ] **Step 2: Run the focused tests and verify failure.**
- [ ] **Step 3: Implement Pillow-backed cropping with an explicit dependency error when Pillow is unavailable, plus standard-library validation.**
- [ ] **Step 4: Run the tests and verify they pass.**

### Task 4: Add site checks, examples, and packaging validation

**Files:**
- Create: `自學互動式網站/scripts/run_site_checks.py`
- Create: `自學互動式網站/tests/test_skill_package.py`
- Modify: `自學互動式網站/README.md`

**Interfaces:**
- `run_site_checks.py <site-root>` checks required HTML entrypoints, local references, expected asset files and optional Node test commands without pretending to run unavailable tools.

- [ ] **Step 1: Write failing package tests** for directory structure, frontmatter, script help, reference URLs and independent-site wording.
- [ ] **Step 2: Run the package tests and verify failure.**
- [ ] **Step 3: Implement site checks and complete the installation and usage examples.**
- [ ] **Step 4: Run all Python tests and a sample end-to-end scan/manifest/validation flow.**

### Task 5: Final verification and GitHub handoff

**Files:**
- Modify: `自學互動式網站/*` only if verification finds a defect.

- [ ] **Step 1: Run the package checks, script help checks and a temporary fixture workflow.**
- [ ] **Step 2: Confirm no files from the existing snail picture-book website are included.**
- [ ] **Step 3: Run the Codex and Claude Code installation instructions as a documentation review.**
- [ ] **Step 4: Prepare a Git commit or GitHub contents upload only after a writable target repository is identified.**
- [ ] **Step 5: Report the local package path, tests, and any GitHub connection blocker.**
