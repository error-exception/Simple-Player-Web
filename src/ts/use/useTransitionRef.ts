import {ref, Ref} from "vue";
import {useAnimationFrame} from "./useAnimationFrame";
import {ObjectTransition} from "../webgl/transition/Transition";

export function useTransition(obj: Record<string, any>, property: string): (delay?: number) => ObjectTransition {
  const transitionKey = ref(false)
  const transition = new ObjectTransition(obj, property)
  let time = 0
  useAnimationFrame(transitionKey, timestamp => {
    if (transition.isEnd) {
      transitionKey.value = false
    }
    transition.update(timestamp)
    time = timestamp
  })
  return (delay: number = 0) => {
    transition.setStartTime(time + delay)
    transitionKey.value = true
    return transition
  }
}

export function useTransitionRef(value: Ref<number>): (delay?: number) => ObjectTransition {
  return useTransition(value, 'value')
}