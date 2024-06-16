<template>
  <div class="toast-box" :style="`opacity: ${ opacity };`">
    <Row center>
      {{ toastMessage }}
    </Row>
  </div>
</template>

<script setup lang="ts">
import Row from "./common/Row.vue";
import {Toaster} from "../ts/global/Toaster";
import {ref} from "vue";
import {useSingleEvent} from "../ts/util/SingleEvent";
import {useTransitionRef} from "../ts/use/useTransitionRef";
import {debounce} from "../ts/Utils";
import {easeOut, easeOutQuint} from "../ts/util/Easing";

const toastMessage = ref('')
const opacity = ref(0)
const opacityTo = useTransitionRef(opacity)

const clearMessage = debounce(() => {
  toastMessage.value = ''
}, 3200)

useSingleEvent(Toaster.onToast, message => {
  opacityTo(1, 200, easeOut)
  opacityTo(0, 500, easeOutQuint, 2500)
  toastMessage.value = message
  clearMessage()
})

// Toaster.toast.collect(message => {
//     clearTimeout(timeoutId)
//     state.opacity = 1
//     state.message = message
//     timeoutId = setTimeout(() => {
//         state.opacity = 0
//         state.message = ""
//     }, 3000)
// })

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
  font-weight: lighter;
}
</style>