# 知阶 · 高中数学与物理知识库

按章节查概念、公式和适用条件。每篇还说明考试中怎样选择方法，以及常见错误发生在什么条件下。

- **数学**分为必修和选择性必修，代数变形归入预备知识。
- **物理**分为力学、电磁学、热光波与近代物理、实验，知识点标注对应课程模块。

两科目录参考普通高中课程标准及一轮复习讲义。知识点讲解为原创整理，待教师复审。

## 本地运行

使用 Node.js 22.12 或以上版本。在项目根目录运行：

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

打开终端给出的本地地址。

~~~powershell
npm.cmd run check
npm.cmd run build
npm.cmd run check:links
~~~

`data/taxonomy.ts` 定义学科目录。`data/math-*.ts` 和 `data/physics-*.ts` 维护知识点。`.vitepress/theme/` 提供阅读界面、搜索和数学公式渲染。

## 发布

现有 Cloudflare Pages 项目连接 GitHub 的 `main` 分支。推送更新后会自动重新构建。项目使用以下构建设置：

| 设置 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 构建命令 | `npm run check && npm run build && npm run check:links` |
| 输出目录 | `.vitepress/dist` |

许可证为 MIT。
