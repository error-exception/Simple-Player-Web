import {isRef, onUnmounted, ref, Ref, watch} from "vue";
import {Nullable} from "../type";

export function useAnimationFrame(key: Nullable<Ref<boolean>>, callback: (timestamp: number) => void) {
  let handle: number | undefined
  const k = isRef(key) ? key : ref(null)
  const animationCallback = (timestamp: number) => {
    callback(timestamp)
    handle = requestAnimationFrame(animationCallback)
  }
  watch(k, value => {
    if (value) {
      handle = requestAnimationFrame(animationCallback)
    } else if (handle !== undefined) {
      cancelAnimationFrame(handle)
      handle = undefined
    }
  }, { immediate: true })
  onUnmounted(() => {
    handle !== undefined && cancelAnimationFrame(handle)
  })
}

export function useAnimationFrame2(callback: (timestamp: number) => void) {

  let handle: number | undefined, isStop = ref(false)
  const animationCallback = (timestamp: number) => {
    callback(timestamp)
    if (!isStop.value) {
      handle = requestAnimationFrame(animationCallback)
    }
  }
  handle = requestAnimationFrame(animationCallback)
  onUnmounted(() => {
    handle !== undefined && cancelAnimationFrame(handle)
    isStop.value = true
  })
}