# Simple Player Web (暂定)

## 简介

一个模仿 OSU 的网页播放器，只可播放，不能游玩

1. 部分支持`.osz`文件，可拖动打开
2. BPM 测量（带服务端构建）
3. 预览 Mania 4K（随机选择一个 Beatmap）
4. 预览视频（如果存在且可播放）
5. 不完全的故事板支持（测试中）

## 预览

https://error-exception.github.io/Simple-Player-Web/

## 构建

### 无服务端构建

#### 1. 修改文件

修改`/src/ts/build.ts`, 修改为以下内容：

```typescript
export const PLAYER = false
```

#### 2. 构建

```shell
npm run build
```

### 带服务端构建

因代码调整，带服务端构建未及时更新，将会产生一些问题

#### 1. 修改文件

修改`/src/ts/build.ts`, 修改为以下内容：

```typescript
export const PLAYER = true
```

#### 2. 构建

```shell
npm run build
```