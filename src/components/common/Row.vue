<template>
  <div :class="'row ' + classes" :style="'column-gap: ' + gap + 'px'">
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
.row {
  display: flex;
  flex-direction: row;
}
.center-vertical {
  align-items: center;
  justify-content: start;
}
.center {
  align-items: center;
  justify-content: center;
}
.center-horizontal {
  align-items: start;
  justify-content: center;
}
.left {
  justify-content: start;
}
.right {
  justify-content: end;
}
.top {
  align-items: start;
}
.bottom {
  align-items: end;
}
</style>