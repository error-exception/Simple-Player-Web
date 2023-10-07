# 预览

https://error-exception.github.io/Simple-Player-Web/

# 开发

需要安装 node.js

使用 vscode 或 webstorm 打开本项目。vscode 需要安装插件[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

在项目根目录下，运行下面的命令安装项目所需的依赖
``` shell
npm install
```

本项目运行之前需要打开 Simple Player，启动网页播放器，此时会在手机上启动一个服务器，并在 `vite.config.ts` 修改代理服务器地址为手机的 IP 地址（仅修改 IP，不修改端口）
（注：需要手机和 PC 在同一网络环境下）

依赖安装完以后，运行下面的命令运行本项目

``` shell
npm run dev
```
