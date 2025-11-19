# 个人导航网站 - 5分钟部署教程

一个简洁漂亮的个人导航网站，完全免费部署到 Cloudflare，全球访问快速稳定。

**适合人群**：零基础小白，不需要懂代码！

## 📺 部署效果

### 电脑网页端
![效果预览1](src/assets/image/window-presentation.png)

### 手机端
<div style="text-align: center;">
  <img src="src/assets/image/phone-presentation.jpg" width="60%" />
</div>

---

部署完成后，你将获得：
- ✅ 一个属于你的导航网站
- ✅ 自动 HTTPS 安全证书
- ✅ 随时修改内容，自动更新上线

## 🎯 部署步骤

### 第一步：注册 Cloudflare 账号
1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 填写邮箱、密码，完成注册  
   **作用**：免费托管你的网站

### 第二步：使用 VSCode 一键部署

#### 2.1 下载本项目到本地
方法 1：直接下载 ZIP（推荐新手）

#### 2.2 安装必要工具
安装 Node.js

访问 [nodejs.org](https://nodejs.org)  
下载 LTS 版本（长期支持版）  
安装完成后，打开命令行验证：

```bash
node -v    # 应显示版本号，如 v20.x.x
npm -v     # 应显示版本号，如 10.x.x
```

安装项目依赖：
```bash
npm install
```
登录 Cloudflare 在终端输入：
```bash
wrangler login
```
构建项目：
```bash
npm run build
```

部署上线 在终端输入：
```bash
wrangler pages deploy dist --project-name="navigation"
```
首次部署会询问是否创建新项目，输入 y 回车，等待上传完成。

✨ Success! Deployed to https://navigation-xxx.pages.dev

🎉 完成！复制显示的网址，在浏览器打开查看你的网站。

🎨 修改网站内容
修改导航网页链接
位置：src\data\navigationData.js
打开文件，你会看到类似这样的代码：
```bash
{
  name: 'Google Scholar',
  url: 'https://scholar.google.com',
  icon: '📚',
  description: '学术论文搜索'
}
```
修改方法：

name：工具名称

url：工具网址

icon：图标可用 emoji，也可以用图片链接。

description：简短说明

### 修改备案信息（如果需要）

位置：src/components/FooterNotice.vue
找到这两行：
```bash
粤ICP备2025473557号
备案订单号：175568880767020328
```
更新完成后，重新部署创建到cloudflare

🎉 完成！
恭喜你成功部署了自己的导航网站！

祝使用愉快！✨

## 备注
用户可前往assets，查看或修改网站图标和网页结构；前往src\App.vue,修改网站名称以及启用其他功能。