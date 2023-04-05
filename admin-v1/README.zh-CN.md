<div align="center">
  <img alt="V3 Admin Vite Logo" width="120" height="120" src="./src/assets/layout/logo.png">
  <h1>V3 Admin Vite</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

## ⚡ 简介

一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术.

- Vue-Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

## 特性

- **Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API
- **Element Plus**：Element UI 的 Vue3 版本
- **Pinia**: 传说中的 Vuex5
- **Vite**：真的很快
- **Vue Router**：路由路由
- **TypeScript**：JavaScript 语言的超集
- **PNPM**：更快速的，节省磁盘空间的包管理工具
- **Scss**：和 Element Plus 保持一致
- **CSS 变量**：主要控制项目的布局和颜色
- **ESlint**：代码校验
- **Prettier**：代码格式化
- **Axios**：发送网络请求（已封装好）
- **UnoCSS**：具有高性能且极具灵活性的即时原子化 CSS 引擎
- **注释**：各个配置项都写有尽可能详细的注释
- **兼容移动端**: 布局兼容移动端页面分辨率

## 功能

- **用户管理**：登录、登出演示
- **权限管理**：内置页面权限（动态路由）、指令权限、权限函数、路由守卫
- **多环境**：开发环境（development）、预发布环境（staging）、正式环境（production）
- **多主题**：内置普通、黑暗、深蓝三种主题模式
- **错误页面**: 403、404
- **Dashboard**：根据不同用户显示不同的 Dashboard 页面
- **其他内置功能**：SVG、动态侧边栏、动态面包屑、标签页快捷导航、Screenfull 全屏、自适应收缩侧边栏

## 📚 文档

[中文文档](https://juejin.cn/post/7089377403717287972)

[手摸手教程](https://juejin.cn/column/7207659644487139387)

## 国内仓库

[Gitee](https://gitee.com/un-pany/v3-admin-vite)

## 在线预览

| 位置         | 账号            | 链接                                            |
| ------------ | --------------- | ----------------------------------------------- |
| github-pages | admin 或 editor | [链接](https://un-pany.github.io/v3-admin-vite) |

## 🚀 开发

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
3. node 版本 16+
4. pnpm 版本 7.x

# 克隆项目
git clone https://github.com/un-pany/v3-admin-vite.git

# 进入项目目录
cd v3-admin-vite

# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

## ✔️ 预览

```bash
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

## 📦️ 多环境打包

```bash
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

## 🔧 代码检查

```bash
# 代码格式化
pnpm lint

# 单元测试
pnpm test
```

## Git 提交规范参考

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 项目预览图

![preview1.png](./src/assets/docs/preview1.png)
![preview2.png](./src/assets/docs/preview2.png)
![preview3.png](./src/assets/docs/preview3.png)

## 💕 贡献者

感谢所有的贡献者！

<a href="https://github.com/un-pany/v3-admin-vite/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=un-pany/v3-admin-vite" />
</a>

## 💕 感谢赞助（赞助的费用拿来在群里发红包了~）

| 账号                                               | 头像                                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <a href="https://github.com/a3305278">a3305278</a> | <img src="https://avatars.githubusercontent.com/u/30458650?v=4" width="64px" height="64px" /> |

## 💕 感谢 Star

小项目获取 star 不易，如果你喜欢这个项目的话，欢迎支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）

## 可有可无的群

QQ 群：1014374415（左）&& 加我微信，拉你进微信群（右）

![qq.png](./src/assets/docs/qq.png)
![wechat.png](./src/assets/docs/wechat.png)

## 📄 License

[MIT](./LICENSE)

Copyright (c) 2022 [pany](https://github.com/pany-ang)
