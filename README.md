# Convo 即時聊天應用程式

Convo 專案：一個使用現代 Web 技術開發的即時聊天應用程式。

## 專案結構概覽

本專案採用 Monorepo 架構，主要包含以下幾個核心工作區 (workspaces)：

* \`Convo/\` (根目錄)
    * 包含整個專案的共用設定，例如根 \`package.json\` (用於管理工作區和執行全域指令)、\`.gitignore\`、Prettier 設定等。
* \`Convo/client/\`
    * **用途**：前端應用程式，使用 React (Vite + TypeScript) 建置，負責使用者介面和使用者互動。
    * 包含所有 UI 元件、頁面、前端路由、狀態管理和前端測試。
* \`Convo/server/\`
    * **用途**：後端 API 伺服器，使用 Node.js (Express + TypeScript) 建置，負責處理業務邏輯、資料庫互動、身份驗證和即時通訊 (Socket.IO)。
    * 包含 API 路由、控制器、服務、資料庫遷移檔案 (\`migrations/\`) 和後端測試。
* \`Convo/shared/\`
    * **用途**：前後端共用的程式碼和型別定義。
    * 目前規劃用於放置 Zod schemas (用於資料驗證) 和共用的 TypeScript 型別，以確保前後端資料格式的一致性。

## 開始協作指南

### 1. 環境準備 (Prerequisites)

請確保你的開發環境已安裝以下軟體：

* **Node.js**: 建議使用 LTS 版本 (例如 v18.x 或 v20.x)。你可以使用 \`nvm\` (Node Version Manager) 來管理 Node.js 版本。
* **npm**: 通常隨 Node.js 一起安裝 (建議使用 v9.x 或更新版本)。
* **Git**: 用於版本控制。
* **(可選) 一個 PostgreSQL 用戶端工具**: 例如 DBeaver, TablePlus, pgAdmin，方便你連接和查看 Neon 資料庫分支。

### 2. 專案設定 (Setup)

1.  **Clone (複製) 專案儲存庫**：
    \`\`\`bash
    git clone https://github.com/piercelin11/convo.git
    cd Convo
    \`\`\`
2.  **安裝根目錄依賴**：
    這會安裝 \`npm-run-all\` 等工具，並同時觸發 \`client\`, \`server\`, \`shared\` 各工作區的依賴安裝 (透過 \`workspaces\` 和 \`postinstall\` 腳本，如果有的話；如果沒有，則需要分別安裝)。
    \`\`\`bash
    npm install
    \`\`\`
    *如果根目錄 \`npm install\` 沒有自動安裝子專案的依賴，請分別進入 \`client/\`, \`server/\`, \`shared/\` 目錄執行 \`npm install\`。*
3.  **設定環境變數 (\`.env\` 檔案)**：
    * **後端 (\`server/.env\`)**：
        * 從 \`server/.env.example\` (如果有的話) 複製一份並命名為 \`server/.env\`。
        * 你將需要一個 Neon 資料庫分支的連線字串。**關於如何取得你的個人 Neon 開發分支和設定 \`DATABASE_URL\`，請參考我們共享的 Google 文件：[在此處插入你的 Google 文件連結]**。
        * 其他必要的後端環境變數 (例如 \`PORT\`, \`JWT_SECRET\` 等) 也會在這裡設定。
    * **前端 (\`client/.env\`)** (如果需要)：
        * 如果前端需要連接到後端 API 的特定 URL，可以從 \`client/.env.example\` 複製並設定。例如：\`VITE_API_BASE_URL=http://localhost:3001/api\` (請確認後端埠號)。

### 3. 執行專案 (開發模式)

在專案根目錄 (\`Convo/\`) 下執行以下指令，可以同時啟動前端和後端開發伺服器：
\`\`\`bash
npm run dev
\`\`\`
這會使用 \`npm-run-all\` 同時執行 \`client\` 和 \`server\` 的開發腳本 (例如 \`client\` 的 Vite 開發伺服器和 \`server\` 的 Nodemon + tsx)。
請查看終端機輸出，了解前端和後端各自在哪個埠號 (port) 上運行。

### 4. 資料庫遷移 (Database Migrations)

我們使用 \`node-pg-migrate\` 來管理資料庫結構的變更。**詳細的資料庫遷移工作流程 (如何建立、執行、回滾遷移等) 請務必參考我們共享的 Google 文件：[在此處再次插入你的 Google 文件連結]。**
以下是一些常用的遷移指令 (在 \`Convo/server/\` 目錄下執行)：

* 套用新的遷移 (當你從 Git 拉取了新的遷移檔案後)：
    \`\`\`bash
    npm run migrate:up
    \`\`\`
* 建立新的遷移檔案 (如果你需要修改資料庫結構)：
    \`\`\`bash
    npm run migrate:create <你的遷移描述名稱>
    # 例如: npm run migrate:create add-user-profile-fields
    \`\`\`
    然後編輯 \`server/migrations/\` 資料夾下新產生的 \`.ts\` 檔案。

### 5. 程式碼風格與品質

本專案使用 ESLint 和 Prettier 來統一程式碼風格和進行品質檢查。
建議在你的編輯器中安裝對應的 ESLint 和 Prettier 擴充功能，並設定為儲存時自動格式化。
你可以執行以下指令來手動檢查和修正 (在各自的 \`client/\` 或 \`server/\` 目錄下，或者在根目錄設定全域指令)：
\`\`\`bash
# 在 client/ 或 server/ 中
npm run lint
npm run format
\`\`\`

### 6. 執行測試

* 前端測試 (Vitest) (在 \`Convo/client/\` 目錄下)：
    \`\`\`bash
    npm test
    npm run test:ui # 如果想在瀏覽器中查看 Vitest UI
    \`\`\`
* 後端測試 (Jest) (在 \`Convo/server/\` 目錄下)：
    \`\`\`bash
    npm test
    npm run test:watch
    npm run test:coverage
    \`\`\`

## 主要技術

* **前端**: React (Vite), TypeScript, Tailwind CSS (規劃中), React Router, Vitest
* **後端**: Node.js, Express.js, TypeScript (ESM), PostgreSQL (Neon), \`node-pg-migrate\`, Socket.IO (規劃中), Jest
* **共享**: Zod (規劃中), TypeScript
* **工具**: ESLint, Prettier, npm Workspaces, \`npm-run-all\`

## 協作流程與溝通

* **分支管理**: 請從主要的 \`dev\` (或 \`main\`) 分支建立你自己的特性分支 (feature branch) 進行開發。
* **程式碼提交**: 遵循約定的提交訊息格式。
* **溝通**: 有任何問題或進行較大變動前，請與團隊成員溝通。
* **詳細的資料庫協作流程，請務必查閱我們共享的 Google 文件。**