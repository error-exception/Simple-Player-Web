# Simple Player Web (暂定)

## 简介

一个模仿 OSU 的网页播放器，只可播放，不能游玩

1. 部分支持`.osz`文件，可拖动打开
2. 预览视频（如果存在且可播放）
3. 不完全的故事板支持（测试中）
4. 支持动态 BPM

## 预览

https://error-exception.github.io/Simple-Player-Web/

## 构建

```shell
npm run build
```

## 使用

### 添加 osz 文件夹

点击 Logo 会出现顶栏，点击顶栏上的文件夹图标，选择含有 osz 文件的文件夹

### 拖动 osz 文件

拖动任意 osz 文件至页面中，即可播放

### 切换 Screen

鼠标拖至页面的最左端，选择 Screen

#### Screen 说明

1. `Lazer! Home` osu！Lazer 的 Logo
2. `Background Preview` 预览 Beatmap 中的背景图和视频（需浏览器支持）
3. `Test` 啥都没有
4. `Stable! Home` osu！Stable 的 Logo
5. `Storyboard` 显示 Beatmap 中的故事板，目前只支持读取 osb 文件中的故事板。当前处于测试阶段，画面会有一些问题