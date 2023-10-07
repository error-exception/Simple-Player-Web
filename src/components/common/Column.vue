<template>
  <div :class="'col ' + classes" :style="'row-gap: ' + gap + 'px'">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

import {computed} from "vue";

const p = defineProps<{
  center?: boolean,
  centerVertical?: boolean,
  centerHorizontal?: boolean,
  left?: boolean,
  right?: boolean,
  top?: boolean,
  bottom?: boolean,
  gap?: number
}>()

const classes = computed(() => {
  const classList: string[] = []
  if (p.center)
    classList.push('center')
  if (p.centerVertical)
    classList.push('center-vertical')
  if (p.centerHorizontal)
    classList.push('center-horizontal')
  if (p.left)
    classList.push('left')
  if (p.right)
    classList.push('right')
  if (p.top)
    classList.push('top')
  if (p.bottom)
    classList.push('bottom')
  return classList.join(' ')
})

</script>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
}
.center-vertical {
  align-items: start;
  justify-content: center;
}
.center {
  align-items: center;
  justify-content: center;
}
.center-horizontal {
  align-items: center;
  justify-content: start;
}
.top {
  justify-content: start;
}
.bottom {
  justify-content: end;
}
.left {
  align-items: start;
}
.right {
  align-items: end;
}
</style>