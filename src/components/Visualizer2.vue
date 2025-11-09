<template>
  <div class="fill-size">
    <canvas style="width: 100vw; height: 100vh;" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref } from "vue";
import AudioPlayerV2 from "../ts/player/AudioPlayer";
import OSUPlayer from "../ts/player/OSUPlayer";
import { BackgroundScreen } from "../ts/webgl/screen/background/BackgroundScreen";
import { useKeyboard } from "../ts/Utils";
import type { Nullable } from "../ts/type";
import VideoPlayer from "../ts/player/VideoPlayer";
import { OSUApplication } from "../ts/OSUApplication";

const canvas = ref<HTMLCanvasElement | null>(null)

let application: OSUApplication

onMounted(async () => {
  // test()
  let backgroundScreen: Nullable<BackgroundScreen> = null
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // 让视频和音频尽量保持同步
      if (backgroundScreen?.isVideoVisible) {
        OSUPlayer.seek(AudioPlayerV2.currentTime())
      } else {
        VideoPlayer.seek(AudioPlayerV2.currentTime())
      }
    }
  })
  const c = canvas.value
  if (!c) return
  try {
    await OSUApplication.setup(c)
    OSUApplication.render()
  } catch (e) {
    console.error(e)
  }


  //
  // renderer.updateViewport()
  //
  // myCanvas = new Canvas(renderer)

  // console.log('start add background screen')
  // backgroundScreen = new BackgroundScreen()
  // renderer.addDrawable(backgroundScreen)
  // console.log('start load screen')
  // await ApplicationLoader.loadScreen(renderer)
  //
  // renderer.root.contentView = new ImageView({
  //   size: Vector(200, 200)
  // })
  //
  // renderer.onDispose = () => {
  //   Shaders.dispose()
  //   Buffers.dispose()
  //   TextureStore.dispose()
  //   QuadIndexBuffer.dispose()
  // }
})

function test() {
  const c = canvas.value;
  const gl = c.getContext("webgl", { stencil: true });
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 创建一个顶点着色器
  gl.shaderSource(
    vertexShader,
    `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position; // 设置顶点位置
  }
`,
  ); // 编写顶点着色器代码
  gl.compileShader(vertexShader); // 编译着色器代码

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  // 创建一个片元着色器
  gl.shaderSource(
    fragmentShader,
    `
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color; // 设置片元颜色
  }
`,
  ); // 编写片元着色器代码
  gl.compileShader(fragmentShader); // 编译着色器代码

  const program = gl.createProgram(); // 创建一个程序
  gl.attachShader(program, vertexShader); // 添加顶点着色器
  gl.attachShader(program, fragmentShader); // 添加片元着色器
  gl.linkProgram(program); // 连接 program 中的着色器

  gl.useProgram(program); // 告诉 webgl 用这个 program 进行渲染

  const colorLocation = gl.getUniformLocation(program, "u_color");
  // 获取 u_color 变量位置
  gl.uniform4f(colorLocation, 0.93, 0, 0.56, 1); // 设置它的值

  const positionLocation = gl.getAttribLocation(program, "a_position");
  // 获取 a_position 位置
  const positionBuffer = gl.createBuffer();
  // 创建一个顶点缓冲对象，返回其 ID，用来放三角形顶点数据，
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
  // 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0.5, 0.5, 0, -0.5, -0.5]), // 三角形的三个顶点
    // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
    gl.STATIC_DRAW, // 表示缓冲区的内容不会经常更改
  );
  // 将顶点数据加入的刚刚创建的缓存对象

  gl.vertexAttribPointer(
    // 告诉 OpenGL 如何从 Buffer 中获取数据
    positionLocation, // 顶点属性的索引
    2, // 组成数量，必须是1，2，3或4。我们只提供了 x 和 y
    gl.FLOAT, // 每个元素的数据类型
    false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
    0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
    0, // offset 字节偏移量，必须是类型的字节长度的倍数。
  );
  gl.enableVertexAttribArray(positionLocation);
  // 开启 attribute 变量额，使顶点着色器能够访问缓冲区数据

  gl.clearColor(0, 1, 1, 1); // 设置清空颜色缓冲时的颜色值
  gl.clear(gl.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
  gl.enable(gl.STENCIL_TEST);
  gl.colorMask(false, false, false, false);
  gl.stencilFunc(gl.ALWAYS, 1, 255);
  // gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
  gl?.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)

  gl.drawArrays(
    // 从数组中绘制图元
    gl.TRIANGLES, // 画三角形
    0, // 从哪个点开始画
    3, // 需要用到多少个点
  );
  gl.colorMask(true, true, true, true);
  gl.stencilFunc(gl.EQUAL, 1, 255);
  // gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1.0, 0.0, 0.0, -1.0, 1., 0.0]), // 三角形的三个顶点
    // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
    gl.STATIC_DRAW, // 表示缓冲区的内容不会经常更改
  );
  gl.drawArrays(
    // 从数组中绘制图元
    gl.TRIANGLES, // 画三角形
    0, // 从哪个点开始画
    3, // 需要用到多少个点
  );

}

onUnmounted(() => {
  // application.dispose()
  OSUApplication.dispose()
})

useKeyboard("up", e => {
  if (e.code === "KeyF") {
    canvasFullscreen()
  }
})

function canvasFullscreen() {
  if (canvas.value) {
    canvas.value.requestFullscreen()
  }
}

</script>