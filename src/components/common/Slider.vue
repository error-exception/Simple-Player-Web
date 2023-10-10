<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {Nullable} from "../../ts/type";
const props = withDefaults(defineProps<{
  color?: string,
  max?: number,
  min?: number,
  step?: number | 'any'
}>(), {
  color: '#33cb98',
  max: 1,
  min: 0,
  step: 'any'
})
const sliderValue = defineModel<number>({ default: 0 })
const slider = ref<Nullable<HTMLDivElement>>(null)
const value = ref(0)
onMounted(() => {
  slider.value?.style.setProperty('--slider-color', props.color)
})
watch(() => props.color, value => {
  slider.value?.style.setProperty('--slider-color', value)
})
watch(value, () => {
  sliderValue.value = value.value
})

</script>
<template>
  <div class="slider stack" ref="slider">
    <div/>
    <div :style="`transform: scaleX(${value})`"/>
    <input
      type="range"
      class="range"
      :max="max"
      :min="min"
      v-model="value"
      :step="step"
    >
  </div>
</template>
<style scoped>

.slider {
  --slider-color: #33cb98;
  width: 800px;
  height: 24px;
}

.slider > div:nth-child(1) {
  @apply bg-gray-700;
  width: 100%;
  height: 4px;
}

.slider > div:nth-child(2) {
  width: 100%;
  height: 4px;
  background-color: var(--slider-color);
  align-self: flex-start;
  transform-origin: left;
}

.range {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  height: 4px;
  cursor: pointer;
  pointer-events: all;
  background-color: transparent;
  transition: opacity 220ms ease;
  --thumb-size: 16px
}
.range:focus {
  outline: none;
}
.range::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
}
.range::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--slider-color);
  border-style: none;
  width: 60px;
  height: 16px;
  border-radius: 16px;
}

.range::-moz-range-track {
  width: 100%;
  height: 4px;
}
.range::-moz-range-thumb {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--slider-color);
  border-style: none;
  width: 60px;
  height: 16px;
  border-radius: 16px;
}
.range::-webkit-slider-thumb:hover {
  box-shadow: 0 0 8px var(--slider-color);
}
</style>