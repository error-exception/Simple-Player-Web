<template>
  <Column class="fill-size" :gap="16" style="padding: 16px; color: white">
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        高度：
        <input type="range" min="0" max="100" v-model="maxHeight">
      </label>
      <span>{{ maxHeight }}%</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        平滑度：
        <input type="range" min="0" max="100" v-model="smooth">
      </label>
      <span>{{ smooth }}</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        条数：
        <input type="number" v-model="barCount">
      </label>
      <span>{{ barCount }}</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        底边距：
        <input type="number" v-model="paddingBottom">
      </label>
      <span>{{ paddingBottom }}</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        颜色：
        <input type="color" v-model="color">
      </label>
      <span>{{ color }}</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        最大分贝：
        <input type="range" min="-200" max="0" v-model="maxDB">
      </label>
      <span>{{ maxDB }}dB</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        最小分贝：
        <input type="range" min="-200" max="0" v-model="minDB">
      </label>
      <span>{{ minDB }}dB</span>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        透明度随音量变化：
        <input type="checkbox" v-model="alphaByVolume">
      </label>
    </Row>
    <Row class="fill-width" :gap="16" center-vertical>
      <label>
        透明度：
        <input type="range" min="0" max="100" v-model="alpha" :disabled="alphaByVolume">
      </label>
      <span>{{ alpha }}%</span>
    </Row>
  </Column>
</template>

<script setup lang="ts">
import {computed, reactive} from "vue";
import Column from "../Column.vue";
import {useStore} from "vuex";
import Row from "../Row.vue";
import {Visualizer} from "../../ts/Visualizer";
import {byteToHex, toRGB} from "../../ts/Utils";

const state = reactive({
  alphaByVolume: false
})

const store = useStore()

const maxHeight = computed({
  set(v: number) {
    store.commit("setVisualizerMaxHeight", v)
  },
  get() {
    return store.state.visConfig.maxHeight
  }
})

const smooth = computed({
  set(v: number) {
    store.commit('setVisualizerSmooth', v / 100)
    if (Visualizer.instance && Visualizer.instance.isEnabled()) {
      Visualizer.instance.setSmooth(v / 100)
    }
  },
  get() {
    return Math.floor(store.state.visConfig.smooth * 100)
  }
})

const barCount = computed({
  set(v: number) {
    store.commit('setVisualizerBarCount', Math.floor(v))
  },
  get() {
    return store.state.visConfig.barCount
  }
})

const paddingBottom = computed({
  set(v: number) {
    store.commit('setVisualizerPaddingBottom', Math.floor(v))
  },
  get() {
    return store.state.visConfig.paddingBottom
  }
})

const color = computed({
  set(v: string) {
    store.commit('setVisualizerColor', toRGB(v))
  },
  get() {
    const [red, green, blue] = store.state.visConfig.color
    return '#' + byteToHex(red) + byteToHex(green) + byteToHex(blue)
  }
})

const maxDB = computed({
  set(v: number) {
    store.commit('setVisualizerMaxDB', v)
    if (Visualizer.instance && Visualizer.instance.isEnabled()) {
      Visualizer.instance.setMaxDecibels(v)
    }
  },
  get() {
    return store.state.visConfig.maxDB
  }
})

const minDB = computed({
  set(v: number) {
    store.commit('setVisualizerMinDB', v)
    if (Visualizer.instance && Visualizer.instance.isEnabled()) {
      Visualizer.instance.setMinDecibels(v)
    }
  },
  get() {
    return store.state.visConfig.minDB
  }
})

const alpha = computed({
  set(v: number) {
    store.commit('setVisualizerAlpha', v / 100)
  },
  get(){
    return Math.floor(store.state.visConfig.alpha * 100)
  }
})

const alphaByVolume = computed({
  set(v: boolean) {
    store.commit('setVisualizerAlphaByVolume', v)
  },
  get() {
    return store.state.visConfig.alphaByVolume
  }
})

</script>

<style scoped>

</style>