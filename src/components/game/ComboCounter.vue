<script setup lang="ts">
import {maniaCombo, maniaTotalCombo} from "../../ts/global/ManiaState";
import {ref, watch} from "vue";
import {easeOutQuint, easeOut} from '../../ts/util/Easing'
import {useAnimationFrame} from "../../ts/use/useAnimationFrame";
import {ObjectTransition} from "../../ts/webgl/transition/Transition";

const scale = {
  scale: 1
}
const transition = new ObjectTransition(scale, 'scale')
let time = 0
useAnimationFrame(ref(true), timestamp => {
  time = timestamp
  transition.update(timestamp)
  if (comboElement.value) {
    comboElement.value.style.transform = `scale(${scale.scale})`
  }
})
const comboElement = ref<HTMLSpanElement>()
watch(maniaCombo, () => {
  transition.setStartTime(time)
  transition.transitionTo(1.3, 60, easeOut)
    .transitionTo(1, 500, easeOutQuint)
})

</script>
<template>
  <span ref="comboElement" class="text-white text-[64px] origin-bottom-left">
    {{ maniaCombo }} / {{ maniaTotalCombo }}
  </span>
</template>