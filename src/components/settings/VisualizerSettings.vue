<template>
  <Column class="fill-size" :gap="16" style="padding: 16px; color: white">
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

</script>

<style scoped>

</style>