import {onMounted, onUnmounted, type Ref, unref} from "vue";

export function useDomEvent<
  E extends keyof HTMLElementEventMap,
  T extends HTMLElement | null = HTMLElement
>(target: T | Ref<T>, eventName: E, handler: (event: HTMLElementEventMap[E]) => any) {
  onMounted(() => {
    //@ts-ignore
    unref(target)?.addEventListener(eventName, handler);
  })
  onUnmounted(() => {
    //@ts-ignore
    unref(target)?.removeEventListener(eventName, handler);
  })
}