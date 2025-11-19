# 环境与依赖安装说明

此文件说明如何在本地（以 Windows + PowerShell 为例）准备运行本项目 `research-navigator` 所需的开发环境。

---

## 1. 项目依赖概览

已读取 `package.json`，关键项如下：

- Node.js 引擎要求：`^20.19.0 || >=22.12.0`（建议使用 Node 20.19.x 或 Node 22.12+）
- 运行脚本：
  - `dev` -> `vite`
  - `build` -> `vite build`
  - `preview` -> `vite preview`
- 运行时依赖（dependencies）：
  - `vue` ^3.5.18
- 开发依赖（devDependencies）：
  - `vite` ^7.x
  - `@vitejs/plugin-vue` ^6.x
  - `vite-plugin-vue-devtools` ^8.x

> 小结：你需要安装 Node.js（满足 engines），以及 Git 用于克隆/提交，其他依赖通过 `npm install` 自动安装。

---

## 2. 推荐环境与工具

- 操作系统：Windows 10/11（PowerShell）或 macOS / Linux
- Node.js：推荐使用 Node 20.19.x 或 >=22.12.0
- 包管理器：`npm`（随 Node.js 安装）或 `pnpm`/`yarn`（可选）
- Git：用于版本管理和推送到 GitHub

建议在 Windows 上使用 `nvm-windows`（Node 版本管理工具），方便切换 Node 版本。

---

## 3. 在 Windows（PowerShell）上安装 Node.js（推荐两种方式）

方法 A：使用官方安装程序（简单）

1. 打开 Node.js 官方下载页：https://nodejs.org/
2. 下载符合要求的安装包（推荐 LTS 或满足 `^20.19.0` 的版本）
3. 运行安装程序并完成安装

方法 B：使用 nvm-windows（方便切换多个 Node 版本）

1. 前往 nvm-windows 仓库页面：https://github.com/coreybutler/nvm-windows/releases
2. 下载 `nvm-setup.zip` 并运行安装
3. 打开 PowerShell，安装指定 Node 版本（示例：安装 20.19.0）

```powershell
nvm install 20.19.0
nvm use 20.19.0
node -v
npm -v
```

---

## 4. 安装 Git（如果尚未安装）

1. 下载 Git for Windows：https://git-scm.com/
2. 运行安装程序并完成安装
3. 在 PowerShell 中检查：

```powershell
git --version
```

并进行基本配置（若尚未配置）：

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## 5. 克隆仓库并安装依赖（PowerShell 命令）

将下面的命令在 PowerShell 中运行（将 `username` 和仓库名替换为你的仓库地址，或直接先在本地已经有该目录则跳过克隆）：

```powershell
# 克隆（如果尚未克隆）
git clone https://github.com/username/research-navigator.git
cd research-navigator

# 安装依赖
npm install
```

说明：`npm install` 会读取 `package.json` 并安装 `vue`、`vite` 等依赖。

---

## 6. 本地运行与构建

开发模式（带热重载）：

```powershell
npm run dev
# 打开浏览器访问 http://localhost:5173/
```

构建生产版本：

```powershell
npm run build
# 构建结果在 dist/ 目录
```

预览构建结果：

```powershell
npm run preview
# 预览地址会在终端显示，通常 http://localhost:4173/
```

---

## 7. 可选：使用 pnpm（更快的安装）

如果你想使用 `pnpm`：

```powershell
npm install -g pnpm
pnpm install
pnpm run dev
```

---

## 8. 推送到 GitHub（若需要）

如果你需要把本地仓库推送到 GitHub：

```powershell
# 在 GitHub 上新建仓库（不要初始化 README）
# 然后在本地运行：
git remote add origin https://github.com/username/research-navigator.git
git branch -M main
git push -u origin main
```

> 如果提示身份验证，请使用 GitHub Personal Access Token（而非密码）或配置 SSH key。

---

## 9. 常见问题与排查

- "node: command not found" 或 PowerShell 找不到 node：确认 Node 已正确安装并关闭重新打开 PowerShell（或使用 `nvm use`）。
- 权限问题（Windows）：以管理员身份运行安装程序，或在 PowerShell 中以管理员身份执行需要的命令。
- 安装慢或网络问题：建议配置 npm 镜像（例如淘宝镜像）。
  ```powershell
  npm config set registry https://registry.npmmirror.com/
  ```
- 如果依赖安装后仍报错，尝试删除 `node_modules` 和 `package-lock.json` 后重装：
  ```powershell
  rm -r node_modules
del package-lock.json
  npm install
  ```

---

## 10. 其他建议

- 建议使用与 `package.json` 中 `engines.node` 匹配的 Node 版本，以避免奇怪的兼容性问题。
- 如果在中国大陆开发并遇到网络问题，推荐使用镜像源或 `pnpm` 加速安装。

---

如果你希望我：
- 把这份 `ENVIRONMENT.md` 自动提交到仓库（我可以提交并创建 commit），
- 或者生成一个 Windows 安装脚本（PowerShell 脚本）自动化安装 Node、Git、pnpm 并安装依赖，

告诉我你的偏好，我会继续操作。