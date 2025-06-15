# Convo 即時聊天應用程式

Convo 專案：一個使用現代 Web 技術開發的即時聊天應用程式。它旨在提供即時、流暢的使用者溝通體驗。

## 專案結構概覽

本專案採用 **Monorepo 架構**，使用 **pnpm 工作區 (workspaces)** 進行管理，主要包含以下幾個核心單元：

- `Convo/` (專案根目錄)
  - **用途**：管理整個專案的共用設定、全域指令 (`package.json`)、版本控制 (`.gitignore`) 及程式碼風格 (`Prettier`)。
- `Convo/client/`
  - **用途**：前端應用程式。使用 **React (Vite + TypeScript)** 建置，負責使用者介面和使用者互動。
  - 包含所有 UI 元件、頁面、**React Router** 路由設定、**React Query (TanStack Query)** 進行資料獲取與狀態管理、以及 **Vitest** 前端測試。
- `Convo/server/`
  - **用途**：後端 API 伺服器。使用 **Node.js (Express + TypeScript)** 建置，負責處理業務邏輯、資料庫互動、身份驗證和即時通訊 (**Socket.IO**)。
  - 包含 API 路由、控制器、服務、資料庫遷移檔案 (`migrations/`) 和 **Jest** 後端測試。
- `Convo/shared/`
  - **用途**：前後端共用的程式碼和型別定義。
  - 包含 **Zod schemas** (用於資料驗證) 和共用的 TypeScript 型別定義，確保前後端資料格式的一致性。

## 開始協作指南

### 1. 環境準備 (Prerequisites)

請確保你的開發環境已安裝以下軟體：

- **Node.js**: 建議使用 LTS 版本 (例如 v18.x 或 v20.x)。你可以使用 `nvm` 管理版本。
- **pnpm**: 本專案使用 pnpm 作為套件管理器。如果未安裝，請執行 `npm install -g pnpm`。
- **Git**: 用於版本控制。
- **(可選) 一個 PostgreSQL 用戶端工具**: 例如 DBeaver, TablePlus, pgAdmin，方便你連接和查看資料庫。

### 2. 專案設定 (Setup)

1.  **Clone (複製) 專案儲存庫**：
    ```bash
    git clone [https://github.com/piercelin11/convo.git](https://github.com/piercelin11/convo.git)
    cd Convo
    ```
2.  **安裝專案依賴**：
    在專案根目錄下執行此指令。pnpm 會自動安裝所有工作區 (`client`, `server`, `shared`) 的依賴。
    ```bash
    pnpm install
    ```
3.  **設定環境變數 (`.env` 檔案)**：
    - **後端 (`server/.env`)**：
      - 從 `server/.env.example` 複製一份並命名為 `server/.env`。
      - **資料庫連線字串**：你需要一個 PostgreSQL 資料庫連線字串 (`DATABASE_URL`)。**關於如何取得你的個人 Neon 開發分支或其他資料庫設定，請參考團隊共享文件：[在此處插入你的 Google 文件連結]**。
      - **AWS S3 相關設定 (用於圖片上傳/管理)**：
        ```
        AWS_ACCESS_KEY_ID=你的AccessKeyID
        AWS_SECRET_ACCESS_KEY=你的SecretAccessKey
        AWS_REGION=你的S3_Bucket所在區域 (例如 ap-northeast-1)
        S3_BUCKET_NAME=你的S3_Bucket名稱 (例如 convo-app-bucket)
        ```
      - 其他必要的後端環境變數 (例如 `PORT`, `JWT_SECRET` 等) 也會在這裡設定。
    - **前端 (`client/.env`)**：
      - 從 `client/.env.example` 複製一份並命名為 `client/.env`。
      - 如果前端需要連接到後端 API，設定其 URL：`VITE_API_BASE_URL=http://localhost:3001/api` (請確認後端埠號)。
      - **前端 S3 圖片預覽與連結構建相關** (如果需要，這些通常是從後端獲取，但如果前端也要構建完整連結)：
        ```
        VITE_S3_BUCKET_NAME=你的S3_Bucket名稱
        VITE_AWS_REGION=你的S3_Bucket所在區域
        ```

### 3. 執行專案 (開發模式)

在專案根目錄 (`Convo/`) 下執行以下指令，可以同時啟動前端和後端開發伺服器：

```bash
pnpm run dev
```

這會使用 pnpm 同時執行 client 和 server 的開發腳本 (例如 client 的 Vite 開發伺服器和 server 的 Nodemon + tsx)。
請查看終端機輸出，了解前端和後端各自在哪個埠號 (port) 上運行。

### 4. 資料庫遷移 (Database Migrations)

我們使用 `node-pg-migrate` 來管理資料庫結構的變更。**詳細的資料庫遷移工作流程 (如何建立、執行、回滾遷移等) 請務必參考團隊共享文件：[在此處再次插入你的 Google 文件連結]**。
以下是一些常用的遷移指令 (在 `Convo/server/` 目錄下執行)：

- 套用新的遷移 (當你從 Git 拉取了新的遷移檔案後)：
  ```bash
  pnpm run migrate:up
  ```
- 建立新的遷移檔案 (如果你需要修改資料庫結構)：
  ```bash
  pnpm run migrate:create <你的遷移描述名稱>
  # 例如: pnpm run migrate:create add-user-profile-fields
  ```
  然後編輯 `server/migrations/` 資料夾下新產生的 `.ts` 檔案。

### 5. 程式碼風格與品質

本專案使用 ESLint 和 Prettier 來統一程式碼風格和進行品質檢查。
建議在你的編輯器中安裝對應的 ESLint 和 Prettier 擴充功能，並設定為儲存時自動格式化。
你可以執行以下指令來手動檢查和修正 (在各自的 `client/` 或 `server/` 目錄下，或者在根目錄設定全域指令)：

```bash
# 在 client/ 或 server/ 中
pnpm run lint
pnpm run format
```

### 6. 執行測試

- 前端測試 (Vitest) (在 `Convo/client/` 目錄下)：
  ```bash
  pnpm test
  pnpm run test:ui # 如果想在瀏覽器中查看 Vitest UI
  ```
- 後端測試 (Jest) (在 `Convo/server/` 目錄下)：
  ```bash
  pnpm test
  pnpm run test:watch
  pnpm run test:coverage
  ```

## 主要技術

- **前端**: React (Vite), TypeScript, **Tailwind CSS**, **React Query (TanStack Query)**, React Router, Vitest
- **後端**: Node.js, Express.js, TypeScript (ESM), PostgreSQL (**Neon**), `node-pg-migrate`, **Socket.IO**, Jest
- **共享**: Zod, TypeScript
- **部署**: **AWS EC2 (後端), AWS S3 (前端靜態資源), AWS RDS (PostgreSQL)**
- **工具**: ESLint, Prettier, **pnpm Workspaces**, `npm-run-all`, **GitHub Actions (CI/CD)**

## 協作流程與溝通

- **分支管理**: 請從主要的 `dev` (或 `main`) 分支建立你自己的特性分支 (feature branch) 進行開發。
- **程式碼提交**: 遵循約定的提交訊息格式。
- **Pull Request (PR)**: PR 合併通常透過 `git rebase` 策略來保持提交歷史的乾淨與線性。
- **持續整合/部署 (CI/CD)**: 專案使用 **GitHub Actions** 進行自動化測試和部署流程。提交程式碼後，請注意 CI/CD 狀態。
- **溝通**: 有任何問題或進行較大變動前，請與團隊成員溝通。
- **詳細的資料庫協作流程，請務必查閱團隊共享的 Google 文件。**
