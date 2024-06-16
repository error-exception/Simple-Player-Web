import {Ref} from "vue";
import {useAnimationFrame2} from "./useAnimationFrame";
import {GetAndSetTransition} from "../webgl/transition/Transition";
import {currentMilliseconds} from "../Utils";
import {linear, type TimeFunction} from "../util/Easing";
import type {Color} from "../webgl/base/Color";

export function useTransition(
  getter: () => number, setter: (value: number) => void
) {
  const transition = new GetAndSetTransition(getter, setter)
  useAnimationFrame2(timestamp => {
    transition.update(currentMilliseconds())
  })
  return (target: number, duration: number = 0, timeFunc: TimeFunction = linear, delay: number = 0) => {
    transition.setStartTime(currentMilliseconds() + delay)
    transition.transitionTo(target, duration, timeFunc)
    return transition
  }
}

export function useTransitionRef(value: Ref<number>) {
  return useTransition(() => value.value, (val: number) => value.value = val)
}

export function useColorTransition(color: Color, onUpdate?: (color: Color) => void) {
  const transitionR = new GetAndSetTransition(
    () => color.red, red => color.red = red
  )
  const transitionG = new GetAndSetTransition(
    () => color.green, green => color.green = green
  )
  const transitionB = new GetAndSetTransition(
    () => color.blue, blue => color.blue = blue
  )
  const transitionA = new GetAndSetTransition(
    () => color.alpha, alpha => color.alpha = alpha
  )
  useAnimationFrame2(timestamp => {
    const time = performance.now()
    if (!transitionR.isEnd || !transitionG.isEnd || !transitionB.isEnd || !transitionA.isEnd) {
      onUpdate?.(color)
    }
    transitionR.update(time)
    transitionG.update(time)
    transitionB.update(time)
    transitionA.update(time)
  })

  const transition = (target: Color, duration: number = 0, timeFunc: TimeFunction = linear, delay: number = 0) => {
    const time = performance.now()
    transitionR.setStartTime(time + delay)
    transitionG.setStartTime(time + delay)
    transitionB.setStartTime(time + delay)
    transitionA.setStartTime(time + delay)

    transitionR.transitionTo(target.red, duration, timeFunc)
    transitionG.transitionTo(target.green, duration, timeFunc)
    transitionB.transitionTo(target.blue, duration, timeFunc)
    transitionA.transitionTo(target.alpha, duration, timeFunc)

    return transition
  }

  return transition
}