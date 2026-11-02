# 安装、运行与平台边界

## 依赖与成本

需要 Node.js ≥22、可启动的 Chrome/Chromium、FFmpeg。依赖安装使用官方 npm registry；固定版本见 package-lock.json。首次联网下载，之后本例的画面与导出都在本机，不调用模型或付费云服务。未来换用云素材、AI 配音或模型时，其费用和条款要另行检查。

本次实测：macOS ARM64 / Apple M4 / Node 26.9.0 / FFmpeg 与 ffprobe 9.0.2 / 系统 Google Chrome / HyperFrames 0.9.5。Chrome 自动使用本机硬件 GPU；不需要单独购买显卡，**不能把本次写成“纯CPU导出”**。两个样例各12秒、1920×1080、30fps、360帧；没有音轨。速度取决于硬件、动画与浏览器，不把本机时间当成普遍承诺。

| 系统 | 启动方式 | 本期验证边界 |
|---|---|---|
| macOS ARM64 | `bash start.sh` 或 `node run.mjs preview-product` | 两场景完整导出、变输入重跑和预览生命周期已实测 |
| Windows | `start.cmd` 或 `node run.mjs preview-product` | 入口已审阅，未完成核心导出实测；Windows ARM64/x64不能互相替代 |
| Linux | `bash start.sh` 或 Node 命令 | 按官方 Chrome/FFmpeg 本地运行路径整理，未完成本期 Linux 核心导出实测 |

## macOS

从 Node 官方网站安装22或更新版本，并安装 Google Chrome。已有 Homebrew 时可用 `brew install ffmpeg`。重新打开终端，运行 `node -v` 和 `ffmpeg -version`，两者均应返回版本。进入交付目录，执行 `bash start.sh`；不需要运行上游 init，本包已准备好案例，也不自动安装 agent 技能。

## Windows

安装官方 Node.js（按自身架构选择）、Chrome，以及可信来源的 FFmpeg；确保 ffmpeg.exe 所在 bin 目录在 PATH，重新打开终端后用 `ffmpeg -version` 核对。进入包目录双击 start.cmd，或在终端执行 Node 命令。`start.ps1` 仅是可选入口；**不修改 PowerShell 执行策略**，不能运行时直接使用 start.cmd。

## Linux

安装 Node.js ≥22、FFmpeg 和 Chrome/Chromium，以及系统所需图形库。Debian/Ubuntu 的 FFmpeg 通常可通过发行版 apt 安装；Chrome 包与依赖按其官方文档处理，发行版和CPU架构不同会影响可用性。不要为省事添加 `--no-sandbox` 或以root运行浏览器。服务器无浏览器/字体时，应先解决运行依赖，再执行本包，不把 help 或 doctor 输出当成功导出。

## 中文、端口与文件

字体依次尝试 PingFang SC、Hiragino Sans GB、Microsoft YaHei、Noto Sans CJK SC 和系统 sans-serif。无中文字体时先安装有合适授权的中文字体；我们不分发系统字体。不同系统字体度量可能改变换行，必须重新预览，不能保证像素一致。

预览仅绑定本机127.0.0.1，产品18831、数据18832，不需要向公网开放。`projects/` 为生成的场景与运行库，`renders/` 为输出视频，`node_modules/` 为依赖；都不应提交进原创包装仓库。不要把密钥放进 content.json；本例也不需要密钥。

## 停止、恢复、升级与备份

通过 `node run.mjs stop-product` / `stop-data` 停对应预览，再运行 preview 命令重启。安装中断时重新执行命令，让 npm ci 根据锁文件恢复；它会重建 node_modules，先关闭用到它的进程。不要删除自己的成片来“清缓存”。

修改前备份 content.json、build.mjs 与自己输出的视频；`render-product` / `render-data` 再导出会更新同名 MP4。升级前复制一份整个原创包，在副本更新依赖锁，重新进行两场景的 check、MP4解码和字体检查，确认后再替换旧版。上游0.9.x迭代快，不用浮动 latest 代替本次固定版本。
