<script setup lang="ts">
import {Color} from "../../ts/webgl/base/Color";
import {ref} from "vue";
import {useColorTransition} from "../../ts/use/useTransitionRef";
import {useDomEvent} from "../../ts/use/useDomEvent";
import {easeOutQuint} from "../../ts/util/Easing";

const hoverColor = Color.fromHex(0xffffff, 100)
const pressColor = Color.fromHex(0xffffff, 180)
const activeColor = Color.fromHex(0xffffff, 255)
const buttonRef = ref<HTMLButtonElement | null>(null)

const color = Color.Transparent.copy()

const colorTo = useColorTransition(color, c => {
  const button = buttonRef.value
  if (button) {
    button.style.backgroundColor = toRGBAString(c)
  }
})

function toRGBAString(color: Color) {
  const red = color.red * 255,
    green = color.green * 255,
    blue = color.blue * 255
  return `rgba(${red}, ${green}, ${blue}, ${color.alpha})`
}

useDomEvent(buttonRef, 'mouseenter', () => {
  console.log('mouseenter')
  colorTo(hoverColor, 500)
})
useDomEvent(buttonRef, 'mouseleave', () => {
  console.log('mouseleave')
  colorTo(Color.Transparent, 150, easeOutQuint)
})
useDomEvent(buttonRef, 'mousedown', () => {
  console.log('mousedown')
  colorTo(pressColor, 200)
})
useDomEvent(buttonRef, 'mouseup', () => {
  console.log('mouseup')
  colorTo(activeColor, 45)(Color.Transparent, 150, easeOutQuint, 45)
})

</script>

<template>
  <button ref="buttonRef" style="--color: transparent; background-color: var(--color)">
    <slot/>
  </button>
</template>

<style scoped>
</style>