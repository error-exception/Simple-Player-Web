# Vue 3 + TypeScript + Vite


This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.


## Recommended IDE Setup


- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


## Type Support For `.vue` Imports in TS


TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.


If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:


1. Disable the built-in TypeScript Extension

   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette

   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`

2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.


# 开发（以上为项目创建自带的 README 内容）

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