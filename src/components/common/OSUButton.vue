<script setup lang="ts">
import {useTransitionRef} from "../../ts/use/useTransitionRef";
import {computed, ref} from "vue";
import {useDomEvent} from "../../ts/use/useDomEvent";
import {easeOutElastic, easeOutQuint, type TimeFunction} from "../../ts/util/Easing";
import {Color} from "../../ts/webgl/base/Color";
import {ColorUtils} from "../../ts/webgl/base/ColorUtils";

withDefaults(defineProps<{
  fill?: boolean
}>(), {
  fill: false,
})

const normalColor = Color.fromHex(0x5933cc)
const hoverColor = ColorUtils.lum(normalColor, .2)
const activeColor = ColorUtils.lum(normalColor, .4)

const red = ref(normalColor.red)
const green = ref(normalColor.green)
const blue = ref(normalColor.blue)
const redTo = useTransitionRef(red)
const greenTo = useTransitionRef(green)
const blueTo = useTransitionRef(blue)

const rgb = computed(() => {
  return `rgba(${red.value * 255}, ${green.value * 255}, ${blue.value * 255}, ${normalColor.alpha})`
})

function colorTo(color: Color, duration: number, timeFunc: TimeFunction, delay: number) {
  redTo(color.red, duration, timeFunc, delay)
  greenTo(color.green, duration, timeFunc, delay)
  blueTo(color.blue, duration, timeFunc, delay)
}

const value = ref(1)
const to = useTransitionRef(value)

const buttonRef = ref<HTMLButtonElement | null>(null)

useDomEvent(buttonRef, 'mousedown', () => {
  to(.9, 4000, easeOutQuint)
})
useDomEvent(buttonRef, 'mouseup', () => {
  to(1, 1000, easeOutElastic)
  colorTo(activeColor, 40, easeOutQuint, 0)
  colorTo(hoverColor, 800, easeOutQuint, 40)
})
useDomEvent(buttonRef, 'mouseleave', () => {
  to(1, 1000, easeOutElastic)
  colorTo(normalColor, 800, easeOutQuint, 0)
})
useDomEvent(buttonRef, 'mouseenter', () => {
  colorTo(hoverColor, 800, easeOutQuint, 0)
})


</script>

<template>
  <button
      class="osu-button"
      :class="{'w-full': fill}"
      :style="{
        transform: `scale(${value})`,
        backgroundColor: rgb
      }"
      ref="buttonRef"
  >
    <slot/>
  </button>
</template>

<style scoped>
.osu-button {
  @apply rounded-full px-4 py-2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
  letter-spacing: 1px;
}
</style>