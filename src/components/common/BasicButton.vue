<script setup lang="ts">

import {Color} from "../../ts/webgl/base/Color";
import {ColorUtils} from "../../ts/webgl/base/ColorUtils";
import {computed, ref} from "vue";
import {useTransitionRef} from "../../ts/use/useTransitionRef";
import {easeOutElastic, easeOutQuint, type TimeFunction} from "../../ts/util/Easing";
import {useDomEvent} from "../../ts/use/useDomEvent";

const props = withDefaults(defineProps<{
  color: Color,
  applyScale?: boolean
}>(), {
  applyScale: true
})

const normalColor = props.color
const hoverColor = ColorUtils.lum(normalColor, .2)
const activeColor = ColorUtils.lum(normalColor, .4)

const red = ref(normalColor.red)
const green = ref(normalColor.green)
const blue = ref(normalColor.blue)
// const alpha = ref(normalColor.alpha)

const redTo = useTransitionRef(red)
const greenTo = useTransitionRef(green)
const blueTo = useTransitionRef(blue)
// const alphaTo = useTransitionRef(alpha)

const rgba = computed(() => {
  return `rgb(${red.value * 255}, ${green.value * 255}, ${blue.value * 255})`
})

function colorTo(color: Color, duration: number, timeFunc: TimeFunction, delay: number) {
  redTo(color.red, duration, timeFunc, delay)
  greenTo(color.green, duration, timeFunc, delay)
  blueTo(color.blue, duration, timeFunc, delay)
  // alphaTo(color.alpha, duration, timeFunc, delay)
}
const buttonRef = ref<HTMLButtonElement | null>(null)

const value = ref(1)
if (props.applyScale) {
  const to = useTransitionRef(value)
  useDomEvent(buttonRef, 'mousedown', () => {
    to(.9, 4000, easeOutQuint)
  })
  useDomEvent(buttonRef, 'mouseup', () => {
    to(1, 1000, easeOutElastic)
  })
  useDomEvent(buttonRef, 'mouseleave', () => {
    to(1, 1000, easeOutElastic)
  })
}

useDomEvent(buttonRef, 'mouseup', () => {
  colorTo(activeColor, 40, easeOutQuint, 0)
  colorTo(hoverColor, 800, easeOutQuint, 40)
})
useDomEvent(buttonRef, 'mouseleave', () => {
  colorTo(normalColor, 800, easeOutQuint, 0)
})
useDomEvent(buttonRef, 'mouseenter', () => {
  colorTo(hoverColor, 800, easeOutQuint, 0)
})

</script>

<template>
  <button
      :style="{
        transform: `scale(${value})`,
        backgroundColor: rgba
      }"
      ref="buttonRef"
  >
    <slot/>
  </button>
</template>