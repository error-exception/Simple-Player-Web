<!--<template>-->
<!--  <div class="fill-size" style="position: relative; display: flex; justify-content: center; align-items: center">-->
<!--    <canvas ref="canvas" width="1280" height="720" style="position: absolute"></canvas>-->
<!--&lt;!&ndash;    <img :src="logo" width="270" height="270" ref="logo" alt="logo" style="position: absolute">&ndash;&gt;-->
<!--&lt;!&ndash;    <img :src="logo" width="270" height="270" ref="logo_out" alt="logo" style="position: absolute; opacity: .1;">&ndash;&gt;-->
<!--    <h1 style="position: absolute; color: white; opacity: .2; font-size: 56px" ref="logoText">Logo 文字</h1>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import {destroyVisualizer, Visualizer} from "../ts/Visualizer";-->
<!--import {beatFuncV2, degreeToRadian, findMusic} from "../ts/Utils";-->
<!--import logo from '../assets/logo.png'-->
<!--import {useEvent} from "../ts/EventBus";-->
<!--import {AudioPlayer} from "../ts/AudioPlayer";-->
<!--import {useStore} from "vuex";-->
<!--import {computed, onMounted, onUnmounted, ref} from "vue";-->

<!--const DEFAULT_BPM = 60-->

<!--const player = AudioPlayer.instance-->

<!--const store = useStore()-->
<!--//@ts-ignore-->
<!--const canvas = ref<HTMLCanvasElement>(null)-->
<!--//@ts-ignore-->
<!--const logoText = ref<HTMLHeadElement>(null)-->

<!--const maxHeight = computed(() => store.state.visConfig.maxHeight)-->

<!--const paddingBottom = computed(() => store.state.visConfig.paddingBottom)-->

<!--const mirror = computed(() => store.state.visConfig.mirror)-->

<!--const visualizerColor = computed(() => store.state.visConfig.color)-->

<!--const startOffset = computed(() => store.state.visConfig.startOffset)-->

<!--const endOffset = computed(() => store.state.visConfig.endOffset)-->

<!--const barCount = computed(() => store.state.visConfig.barCount)-->

<!--const visCount = 20-->
<!--let beat = beatFuncV2(DEFAULT_BPM)-->

<!--let canvasWidth = 0,-->
<!--    canvasHeight = 0,-->
<!--    canvasContext: CanvasRenderingContext2D | null-->

<!--let beatOffset = 0-->

<!--let previous = -1-->

<!--let indexOffset = 0-->
<!--const indexChange = 5-->

<!--let oldOffset = 0-->

<!--let isOpen = true-->


<!--useEvent({-->

<!--  onBpmChanged(id, newBpm, offset1) {-->
<!--    beat = beatFuncV2(newBpm)-->
<!--    beatOffset = offset1-->
<!--  },-->
<!--  onSongChanged(id) {-->
<!--    const bpm = findMusic(store, id)!!.bpm-->
<!--    previous = -1-->
<!--    beat = beatFuncV2(bpm)-->
<!--  }-->
<!--})-->

<!--onMounted(() => {-->
<!--  /**-->
<!--   *-->
<!--   * @type {HTMLCanvasElement}-->
<!--   */-->
<!--  const ca = canvas.value-->
<!--  ca.style.width = '100%'-->
<!--  ca.style.height = '100%'-->
<!--  canvasHeight = ca.offsetHeight-->
<!--  canvasWidth = ca.offsetWidth-->
<!--  canvasContext = ca.getContext('2d')-->
<!--  isOpen = true-->
<!--  clear()-->
<!--  draw(0)-->
<!--})-->

<!--onUnmounted(() => {-->
<!--  isOpen = false-->
<!--  destroyVisualizer(store)-->
<!--  console.info("Visualizer unmounted")-->
<!--})-->

<!--function clear() {-->
<!--  if (canvas.value) {-->
<!--    canvas.value.width = canvasWidth;-->
<!--    canvas.value.height = canvasHeight;-->
<!--  }-->
<!--}-->

<!--function draw(timestamp: number) {-->
<!--  if (!isOpen || !canvasContext) {-->
<!--    clear()-->
<!--    return-->
<!--  }-->
<!--  requestAnimationFrame(draw)-->
<!--  if (!Visualizer.instance || !Visualizer.instance.isEnabled()) {-->
<!--    return;-->
<!--  }-->
<!--  const dataArray = Visualizer.instance.getFFT()-->
<!--  clear()-->
<!--  if (!dataArray) {-->
<!--    return;-->
<!--  }-->
<!--  canvasContext.beginPath()-->
<!--  const vol = drawHorizontalVisualizer(canvasContext, dataArray)-->
<!--  store.commit('setVisualizerVolume', vol)-->
<!--  const [r, g, b] = visualizerColor.value-->
<!--  if (store.state.visConfig.alphaByVolume) {-->
<!--    canvasContext.strokeStyle = `rgba(${r}, ${g}, ${b}, ${vol})`-->
<!--  } else {-->
<!--    canvasContext.strokeStyle = `rgba(${r}, ${g}, ${b}, ${store.state.visConfig.alpha})`-->
<!--  }-->
<!--  drawRoundVisualizer(canvasContext, dataArray, timestamp)-->
<!--  drawLogo(canvasContext, vol, timestamp)-->
<!--  canvasContext.stroke()-->
<!--}-->

<!--function drawHorizontalVisualizer(context: CanvasRenderingContext2D, fft: Uint8Array): number {-->

<!--  const length = barCount.value > fft.length ? fft.length : barCount.value-->
<!--  let endOffs = endOffset.value-->
<!--  if (endOffs > length || endOffs < 0)-->
<!--    endOffs = length-->

<!--  const sliceWidth = canvasWidth / 2 / length-->

<!--  context.lineWidth = 560-->
<!--  context.moveTo(0, 400)-->
<!--  context.lineTo(400, 400)-->
<!--  context.save()-->
<!--  context.moveTo(0, 400)-->
<!--  context.lineTo(200, 400)-->
<!--  context.restore()-->

<!--  context.lineWidth = sliceWidth - 1;-->

<!--  context.translate(sliceWidth / 2, 0)-->
<!--  let x = 0, vol = 0-->
<!--  for (let i = startOffset.value; i < length && i < endOffs; i++) {-->
<!--    let v = fft[i] / (128.0 * 2)-->
<!--    let tmpY = v * canvasHeight * (maxHeight.value / 100)-->
<!--    let y = tmpY < 0 ? 0 : tmpY-->

<!--    context.moveTo(x, canvasHeight - paddingBottom.value)-->
<!--    context.lineTo(x, canvasHeight - paddingBottom.value - y)-->
<!--    x += sliceWidth-->
<!--    vol += v-->
<!--  }-->
<!--  vol /= length-->
<!--  return vol-->
<!--}-->

<!--function drawRoundVisualizer(context: CanvasRenderingContext2D, fft: Uint8Array, timestamp: number) {-->
<!--  const dataArray = toFloatArray(fft)-->
<!--  updateSpectrum(dataArray, timestamp)-->
<!--  const count = 200 * 5-->

<!--  const offsetX = canvasWidth / 3;-->
<!--  const offsetY = canvasHeight / 2;-->

<!--  const innerRadius = 200-->

<!--    for (let i = 0; i < count; i++) {-->
<!--      const radius = degreeToRadian(360 * (i / count))-->
<!--      const value = innerRadius + dataArray[i % 200] * 100-->
<!--      const fromX = offsetX + Math.cos(radius) * innerRadius-->
<!--      const fromY = offsetY + Math.sin(radius) * innerRadius-->
<!--      const toX = offsetX + Math.cos(radius) * value-->
<!--      const toY = offsetY + Math.sin(radius) * value-->
<!--      context.moveTo(fromX, fromY)-->
<!--      context.lineTo(toX, toY)-->
<!--    }-->
<!--}-->

<!--function toFloatArray(fft: Uint8Array) {-->
<!--  const result = []-->
<!--  for (let i = 0; i < fft.length; i++) {-->
<!--    result.push(fft[i] / 256.0)-->
<!--  }-->
<!--  return result-->
<!--}-->

<!--let simpleSpectrum: number[] = new Array<number>(200)-->

<!--let lastTime = 0-->

<!--function updateSpectrum(fft: number[], timestamp: number) {-->
<!--  if (lastTime === 0) {-->
<!--    lastTime = timestamp-->
<!--  }-->
<!--  for (let i = 0, j = indexOffset; i < indexChange; i++, j = (j + 1) % 200) {-->
<!--    simpleSpectrum[j] = fft[i]-->
<!--  }-->

<!--  for (let i = 0; i < 200; i++) {-->
<!--    fft[i] = fft[i + indexChange]-->
<!--    const simpleValue = simpleSpectrum[i] * 2.254-->
<!--    if (simpleValue > fft[i]) {-->
<!--      fft[i] = simpleValue-->
<!--    }-->
<!--  }-->
<!--  const decayFactor = (timestamp - lastTime) * 0.0036-->
<!--  for (let i = 0; i < 200; i++) {-->
<!--    simpleSpectrum[i] -= decayFactor * (simpleSpectrum[i] + 0.03)-->
<!--    if (simpleSpectrum[i] < 0) {-->
<!--      simpleSpectrum[i] = 0-->
<!--    }-->
<!--  }-->
<!--  lastTime = timestamp-->
<!--  indexOffset = (indexOffset + indexChange) % 200-->
<!--}-->

<!--function drawLogo(context: CanvasRenderingContext2D, vol: number, timestamp: number) {-->

<!--  const time = player.currentTime-->
<!--  let scale = 0-->
<!--  if (time > beatOffset) {-->
<!--    scale = beat(time - beatOffset + 40)-->
<!--    logoText.value.style.opacity = (.2 + scale * 0.2) + ''-->
<!--  } else {-->
<!--    logoText.value.style.opacity = (.2 + vol * 0.2) + ''-->
<!--    scale = vol-->
<!--  }-->
<!--  store.commit('setBeat', scale)-->
<!--}-->

<!--</script>-->

<!--<style scoped>-->
<!--canvas {-->
<!--  pointer-events: none;-->
<!--}-->
<!--img {-->
<!--  right: 128px;-->
<!--  bottom: 128px;-->
<!--}-->
<!--</style>-->