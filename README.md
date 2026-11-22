# 知阶 · 浙江高中知识与能力精准突破平台

一个面向浙江高中生的免费学习网站。学生可以从学科、能力分支逐步定位到原子能力，阅读讲解、做专项题，再用独立新题复测。

## 在 Windows 11 上运行

安装 Node.js 22 LTS（需 22.12 或以上）。在项目根目录打开 PowerShell 执行：

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

打开终端提示的地址，默认是 http://127.0.0.1:5173。npm 安装完成后，站点不需要数据库、API 密钥或登录。学习记录保存在浏览器，换设备或清除站点数据后记录不会同步。

~~~powershell
npm.cmd run check
npm.cmd run build
npm.cmd run check:links
npm.cmd run preview
~~~

## 使用网站

- 从「学科导航」进入数学，按课标的必修、选择性必修学习知识点，也可复习精选运算和应试训练建议。
- 英语按听力、阅读理解、七选五、完形填空、语法填空、应用文与读后续写组织。「课标词汇与拓展」支持查词、释义自测和掌握记录。
- 在课程页切换「完整学习」与「高考速查」。课内训练分为诊断、专项、复测和综合应用。
- 在「我的学习」查看收藏、已读与待回顾错题。诊断页显示当前一轮的证据和复查入口。
- 在「知识库」查看全部已上线课程，在「关联图谱」跟踪知识、方法、能力与题型。
- 在「高考专题」查看教学复习专题与按年度标注的政策来源。

## 源码结构

~~~text
.vitepress/
  config.ts            VitePress 静态生成与页面元数据
  theme/               Vue 页面、学习记录与响应式样式
data/
  taxonomy.ts          学科、分类树与编写状态
  types.ts             知识、能力、方法、题型与作答类型
  entities.ts          共享的知识、方法和题型
  math-guides.ts       数学知识点讲解、例题和自查题
  english-guides.ts    英语题型方法与示例
  word-bank.ts         精选词汇卡与原创例句
  lessons/             专项课程与原创题，按能力拆成 JSON 文件
  catalog.ts           内容索引、综合题与关联查询
subjects/              学科入口及静态路径
skills/                能力静态路径
network/               关联图谱及静态路径
review/                浙江高考专题的官方依据
scripts/               内容、公式、类型及站内链接检查
.github/workflows/     GitHub 构建检查
wrangler.toml         Cloudflare Pages 项目名与输出目录
~~~

## 免费部署到 Cloudflare Pages

1. 在 GitHub 创建仓库，将项目源文件推送到 `main`。提交 `package-lock.json`，忽略 `node_modules` 和本地构建产物。
2. 在 Cloudflare 仪表板选 **Workers & Pages → Create application → Pages → Connect to Git**，授权 Cloudflare 访问该仓库。
3. Pages 项目名填 `zhijie-zhejiang-study`。如果名称已被占用，修改 `wrangler.toml` 的 `name`，使之与新项目名一致。生产分支填 `main`，根目录填仓库根目录。框架可选 VitePress，也可直接填写以下设置。

   | 设置 | 值 |
   | --- | --- |
   | Build command | `npm run check && npm run build && npm run check:links` |
   | Build output directory | `.vitepress/dist` |
   | NODE_VERSION | `22.16.0` |

4. 点击部署。首轮成功后 Cloudflare 提供 `<项目名>.pages.dev` 网址。以后推送到 `main` 会自动构建部署。GitHub 的检查工作流也会在提交和拉取请求时运行。
5. 如需验证构建后的内容，先在本地执行 `npm run preview`，再检查线上首页和至少一个独立能力页。

有关设置见 [Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/) 和 [VitePress 构建输出配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)。

## 内容状态

当前集中更新数学和英语，其他学科暂从学习入口收起。数学知识点覆盖必修和选择性必修各主线的核心示例。英语词汇页收录精选卡片并链接 2025 年修订版课标附录。原创内容由 AI 辅助编写，待教师复审。题型映射属于教学建议，年度考试政策和课标资料在专题页单独列出。分类及内容扩展约定见 [架构与内容规范](ARCHITECTURE.md)。

项目源码采用 MIT 许可证，原创教学内容亦允许按同一许可证使用。引用的外部资料保留原有权利。
