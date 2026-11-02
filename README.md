# RepoGo · HyperFrames 中文实跑包

从 [START_HERE.md](START_HERE.md) 开始：用两份原创样例，把产品文案和四个数字生成真正的 MP4。

- 固定 HyperFrames 0.9.5、GSAP 3.15.0，依赖由官方 npm registry 安装。
- 中文内容入口：`content.json`；对照修改：`content.variant.json`。
- `node run.mjs preview-product` 预览；`render-product` 导出。
- `preview-data` / `render-data` 是数据动画；`check` 检查两个动画。
- 原项目：https://github.com/heygen-com/hyperframes

2026-11-03 本机 macOS ARM64 完成两场景、修改输入再导出、真实帧核对与预览停止/重启。Windows/Linux 启动说明已整理，未在这些系统完成本期核心导出，不能据此视为三系统实测通过。
