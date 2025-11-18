# 个人自由导航平台 (Research Navigation Platform)

一个优雅、现代的个人导航网站，集合了各类研究工具和资源链接。采用 Vue 3 + Vite 构建，支持快速部署到 Cloudflare Pages。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/Vue-3.x-green)

## 📋 目录

- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [本地开发](#本地开发)
- [构建部署](#构建部署)
- [Cloudflare Pages 部署指南](#cloudflare-pages-部署指南)
- [配置说明](#配置说明)
- [常见问题](#常见问题)

## ✨ 功能特性

- 🎨 **现代化设计** - 简洁优雅的用户界面，支持浅色主题
- 📱 **响应式布局** - 完美适配桌面、平板和移动设备
- ⚡ **高性能** - 使用 Vite 构建，加载速度快
- 🔗 **分类导航** - 将工具按类别组织，便于查找
- 🕐 **时间地点小部件** - 实时显示当前时间和位置信息
- 🔍 **搜索功能** - 快速搜索导航项目
- 📂 **公安部备案信息** - 底部友好链接至工信部备案查询
- 🌊 **深海加载动画** - 精美的过渡加载效果（可选启用）
- 📦 **易于部署** - 一键部署到 Cloudflare、Vercel 或其他静态托管平台

## 📁 项目结构

```
research-navigator/
├── index.html                    # 主页面入口
├── package.json                  # 项目依赖配置
├── vite.config.js               # Vite 构建配置
├── jsconfig.json                # JavaScript 配置
├── README.md                     # 本文件
├── .gitignore                    # Git 忽略文件
├── dist/                         # 构建输出目录（部署用）
├── public/                       # 静态资源目录
│   └── structure.html            # 网站结构说明
├── src/
│   ├── main.js                  # Vue 应用入口
│   ├── App.vue                  # 根组件
│   ├── assets/
│   │   ├── styles/
│   │   │   └── global.css       # 全局样式
│   │   └── image/
│   │       └── background-image.png  # 背景图片
│   ├── components/
│   │   ├── NavigationHeader.vue      # 导航栏
│   │   ├── SearchBox.vue            # 搜索框
│   │   ├── CategorySection.vue       # 分类区域
│   │   ├── ToolCard.vue             # 工具卡片
│   │   ├── TimeLocationWidget.vue    # 时间地点小部件
│   │   ├── FooterNotice.vue         # 页脚备案信息
│   │   └── LoadingOverlay.vue       # 加载动画（深海主题）
│   ├── composables/
│   │   └── usePageLoader.js     # 加载状态管理
│   └── data/
│       └── navigationData.js    # 导航数据配置
└── node_modules/                # 依赖包目录
```

## 🚀 快速开始

### 前置要求

- Node.js >= 14.0
- npm >= 6.0 或 yarn / pnpm

### 克隆或下载项目

```bash
# 克隆仓库
git clone https://github.com/username/research-navigator.git
cd research-navigator

# 或直接下载 ZIP
# 下载后解压进入目录
```

### 安装依赖

```bash
npm install
```

## 🛠️ 本地开发

### 启动开发服务器

```bash
npm run dev
```

开发服务器会在 `http://localhost:5173/` 启动，支持热重载（HMR）。

### 构建生产版本

```bash
npm run build
```

构建输出会在 `dist/` 目录中，可直接部署到静态托管平台。

### 预览构建结果

```bash
npm run preview
```

本地预览生产构建的结果。

## 📦 构建部署

### 本地构建

```bash
npm run build
```

构建完成后，`dist/` 文件夹即为可部署的网站。

### 部署到静态托管平台

**支持的平台：**
- ✅ Cloudflare Pages（推荐）
- ✅ Vercel
- ✅ GitHub Pages
- ✅ Netlify
- ✅ 任何支持静态网站托管的服务

## 🌐 Cloudflare Pages 部署指南

Cloudflare Pages 提供免费、快速、全球 CDN 加速的静态网站托管服务。以下是详细的部署步骤。

### 前置条件

1. **GitHub 账户**：需要将代码托管在 GitHub
2. **Cloudflare 账户**：免费注册地址 https://dash.cloudflare.com/
3. **GitHub 仓库**：包含本项目代码

### 步骤 1: 上传代码到 GitHub

#### 1.1 创建 GitHub 仓库

1. 访问 [github.com/new](https://github.com/new)
2. 输入仓库名称（如 `research-navigator`）
3. 选择 **Public**（公开）或 **Private**（私密）
4. 点击 **Create repository**

#### 1.2 本地 Git 配置（首次使用）

```bash
# 配置全局 Git 用户信息
git config --global user.email "你的邮箱@example.com"
git config --global user.name "你的名字"

# 或仅为当前项目配置
git config user.email "你的邮箱@example.com"
git config user.name "你的名字"
```

#### 1.3 推送代码到 GitHub

在项目根目录执行：

```bash
# 移除旧的 origin（如果存在）
git remote remove origin

# 添加新的 GitHub 仓库地址
# 将 username 替换为你的 GitHub 用户名
git remote add origin https://github.com/username/research-navigator.git

# 重命名分支为 main（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

⚠️ **第一次推送时需要身份验证**

**方法 1：使用 GitHub Personal Access Token（推荐）**
1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 推送时将 token 作为密码粘贴（用户名为你的 GitHub 用户名）

**方法 2：使用 SSH 密钥**
```bash
# 生成 SSH 密钥（如未生成）
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 添加到 GitHub: https://github.com/settings/keys
# 使用 SSH 地址而非 HTTPS
git remote add origin git@github.com:username/research-navigator.git
git push -u origin main
```

### 步骤 2: 连接到 Cloudflare Pages

#### 2.1 登录 Cloudflare 控制面板

1. 访问 https://dash.cloudflare.com/
2. 使用 Cloudflare 账户登录（无账户则免费注册）

#### 2.2 创建 Pages 项目

1. 左侧菜单找到 **Workers & Pages** 或 **Pages**
2. 点击 **Create a project** → **Connect to Git**
3. 选择 **GitHub** 作为代码来源
4. 授权 Cloudflare 访问你的 GitHub 账户（按提示授权）
5. 从列表中选择 `research-navigator` 仓库

#### 2.3 配置构建设置

Cloudflare 会自动检测项目为 Vue 应用。确认以下设置：

| 配置项 | 值 |
|--------|-----|
| **Framework preset** | Vue |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/`（留空） |
| **Environment variables** | （暂无需配置） |

#### 2.4 部署

1. 确认所有配置无误，点击 **Save and Deploy**
2. Cloudflare 自动：
   - 拉取 GitHub 代码
   - 安装依赖 (`npm install`)
   - 执行构建 (`npm run build`)
   - 部署到全球 CDN
3. 部署完成后（约 2-5 分钟），你将获得一个自动生成的域名：
   ```
   https://research-navigator.pages.dev
   ```

### 步骤 3: 绑定自定义域名（可选）

#### 3.1 使用 Cloudflare 管理的域名

如果你的域名已在 Cloudflare 托管：

1. 进入 Pages 项目，点击 **Settings**
2. 找到 **Domains and DNS** 部分
3. 点击 **Add a custom domain**
4. 输入你的域名（如 `nav.example.com`）
5. 确认添加，DNS 会自动配置
6. 等待生效（通常 5-10 分钟）

#### 3.2 使用第三方域名提供商

如果域名在阿里云、腾讯云等商家：

1. 在 Cloudflare Pages 中添加域名，获取 DNS 记录信息
2. 登录你的域名提供商控制面板（如阿里云）
3. 修改 DNS 记录，添加 CNAME 指向：
   ```
   CNAME: research-navigator.pages.dev
   ```
4. 在 Cloudflare Pages 中确认域名验证
5. 等待 DNS 全球生效（最多 48 小时）

### 步骤 4: 自动部署设置

Cloudflare Pages 默认启用自动部署：

- **推送到 GitHub main 分支** → **自动触发构建和部署**
- **提交新代码后**，约 1-2 分钟自动上线
- 可在 **Deployments** 选项卡查看部署历史、日志和回滚

### 更新和维护

#### 更新网站内容

```bash
# 在本地修改文件（如添加新工具、修改配置等）
# 例如编辑 src/data/navigationData.js

# 提交改动
git add .
git commit -m "添加新的研究工具"

# 推送到 GitHub
git push origin main
```

Cloudflare 自动检测到推送，启动构建和部署。

#### 查看部署状态

1. 进入 Cloudflare Pages 项目
2. 点击 **Deployments** 选项卡
3. 查看最新的部署状态
4. 如需查看构建日志，点击具体部署版本

#### 回滚到之前的版本

1. 在 **Deployments** 中找到需要回滚的版本
2. 点击版本右侧的三点菜单
3. 选择 **Rollback to this deployment**
4. 确认回滚（网站立即切换到该版本）

## ⚙️ 配置说明

### 导航数据配置

编辑 `src/data/navigationData.js` 来自定义导航内容：

```javascript
export const navigationData = [
  {
    id: 'research',
    name: '研究工具',
    icon: '🔬',
    tools: [
      {
        name: 'Google Scholar',
        url: 'https://scholar.google.com',
        icon: '📚',
        description: '学术论文搜索'
      },
      {
        name: 'PubMed',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        icon: '🧬',
        description: '生物医学文献数据库'
      }
      // 更多工具...
    ]
  },
  // 更多分类...
]
```

**字段说明：**
- `id`: 分类唯一标识（英文）
- `name`: 分类名称（显示给用户）
- `icon`: 分类图标（emoji 或 HTML）
- `tools`: 工具数组，每个工具包含：
  - `name`: 工具名称
  - `url`: 完整的工具链接（https://...）
  - `icon`: 工具图标（emoji）
  - `description`: 简短描述

### 加载动画配置

加载动画默认已注释禁用。若需启用深海加载动画，编辑 `src/App.vue`：

```javascript
// 找到 mounted() 方法，取消下面的注释：
mounted() {
  // 取消注释以启用加载动画
  // this.pageLoader.show('加载中，请稍候...')
  
  // setTimeout(() => {
  //   this.pageLoader.hide(500)
  // }, 800)
}
```

### 备案信息配置

编辑 `src/components/FooterNotice.vue` 修改备案号和备案订单号：

```vue
<a class="beian-link" href="http://beian.miit.gov.cn/" target="_blank">
  粤ICP备2025473557号
</a>
<span>备案订单号：175568880767020328</span>
```

### 背景图片配置

替换 `src/assets/image/background-image.png` 为你的背景图：

1. 准备一张高质量的背景图（建议 1920x1080 或更高）
2. 保存为 PNG 格式
3. 替换项目中的原文件

## 🎯 常见问题

### Q: Cloudflare Pages 需要付费吗？
**A:** 完全免费。Cloudflare Pages 提供免费的静态网站托管，包括：
- 全球 CDN 加速
- 自动部署
- 免费的 .pages.dev 子域名
- 无带宽限制
- 无构建次数限制

### Q: 推送代码时提示身份验证错误怎么办？
**A:** 通常是因为 Git 凭证过期或不正确。解决方案：
1. 使用 GitHub Personal Access Token（见部署指南 1.3）
2. 或配置 SSH 密钥
3. 或在 Git Credential Manager 中更新凭证

### Q: 部署后打不开某些链接，显示 404 怎么办？
**A:** SPA 应用需要特殊配置。在 `public/` 目录下创建 `_redirects` 文件：
```
/*  /index.html  200
```

或直接提交，Cloudflare 会自动识别。

### Q: 如何更新网站内容？
**A:** 简单三步：
1. 编辑本地文件（如 `src/data/navigationData.js`）
2. 提交到 GitHub: `git add . && git commit -m "更新内容" && git push`
3. Cloudflare 自动部署（1-2 分钟内上线）

无需额外操作。

### Q: 能否使用自定义域名？
**A:** 可以。详见部署指南中的「步骤 3: 绑定自定义域名」。

### Q: 如何查看部署日志和错误？
**A:** 在 Cloudflare Pages 项目中：
1. 点击 **Deployments** 选项卡
2. 点击具体部署版本
3. 查看 **Build logs** 获取详细信息

### Q: 中国用户能访问 Cloudflare Pages 吗？
**A:** 可以。Cloudflare 全球覆盖，包括中国。但速度可能因地区而异。备选方案：
- 国内 CDN：七牛云、阿里云 CDN
- 国内托管：Vercel 国内加速、GitHub Pages
- 自建服务器（国内云服务商）

### Q: 如何本地测试生产构建？
**A:**
```bash
npm run build    # 构建
npm run preview  # 预览生产版本
```

然后访问显示的本地地址（通常 http://localhost:4173/）。

## 📝 更多资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Git 学习指南](https://git-scm.com/book/zh/v2)

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 感谢 Vue 3 和 Vite 的开发者
- 感谢 Cloudflare 提供免费的托管服务

---

**最后更新时间**：2025年11月

**版本**：1.0.0

**有问题？** 提交 Issue 或访问项目仓库获取更多帮助。祝你使用愉快！🎉
