<template>
  <div class="toast-box" :style="`opacity: ${ state.opacity };`">
    <Row center>
      {{ state.message }}
    </Row>
  </div>
</template>

<script setup lang="ts">
import Row from "./Row.vue";
import {Toaster} from "../ts/Toaster";
import {reactive} from "vue";

const state = reactive({
  opacity: 0,
  message: ""
})

let timeoutId: any = undefined

Toaster.toast.collect(message => {
    clearTimeout(timeoutId)
    state.opacity = 1
    state.message = message
    timeoutId = setTimeout(() => {
        state.opacity = 0
        state.message = ""
    }, 3000)
})

</script>

<style scoped>
.toast-box {
  width: 100%;
  bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.toast-box > :deep(div) {
  background-color: #00000080;
  color: white;
  font-size: 32px;
  padding: 32px 64px;
  border-radius: 12px;
}
</style>