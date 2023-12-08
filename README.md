# Simple Player Web (暂定)

## 简介

一个模仿 OSU 的网页播放器，只可播放，不能游玩

1. 部分支持`.osz`文件，可拖动打开
2. BPM 测量（带服务端构建）
3. 预览 Mania 4K（随机选择一个 Beatmap）
4. 预览视频（如果存在且可播放）
5. 不支持故事板

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

#### 1. 修改文件

修改`/src/ts/build.ts`, 修改为以下内容：

```typescript
export const PLAYER = true
```

#### 2. 构建

```shell
npm run build
```

## TODO

1. change click event
2. add FlashDrawable
3. add skew and rotate transform
4. code an another webgl core(break change)