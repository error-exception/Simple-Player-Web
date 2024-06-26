import {onMounted, onUnmounted} from "vue";
import {ArrayUtils} from "./util/ArrayUtils";

export function degreeToRadian(degree: number) {
  return degree * ( Math.PI / 180)
}

export function radianToDegree(radian: number) {
  return radian * (180 / Math.PI)
}

export function timeString(timeUnitS: number) {
  if (isNaN(timeUnitS)) {
    return '00:00'
  }
  const time = int(timeUnitS)
  const minute = int(time / 60)
  const seconds = time % 60
  return `${ minute < 10 ? '0' + minute : minute }:${ seconds < 10 ? '0' + seconds : seconds }`
}

export function currentMilliseconds() {
  return Date.now()
}

export function useKeyboard(type: 'up' | 'down', c: (e: KeyboardEvent) => void) {
  const handler = (e: KeyboardEvent) => e.isTrusted && c(e)
  const event = type === 'up' ? "keyup" : 'keydown'
  onMounted(() => window.addEventListener(event, handler))
  onUnmounted(() => window.removeEventListener(event, handler))
}

export function int(n: number) {
  return Math.floor(n)
}

export function calcRMS(sampleRate: number, left: Float32Array, right: Float32Array, currentTime: number, wind: number = 2048) {
  const unit = sampleRate / 1000
  const index = int(currentTime * unit)
  let sum = 0
  if (!ArrayUtils.inBound(left, index)) {
    return 0
  }
  if (left.length - index < wind) {
    for (let i = left.length - 1; i > left.length - 1 - wind; i--) {
      // const max = Math.max(left[i], right[i])
      sum += (left[i] ** 2 + right[i] ** 2)// / 2
    }
  } else {
    for (let i = index; i < index + wind; i++) {
      // const max = Math.max(left[i], right[i])
      sum += (left[i] ** 2 + right[i] ** 2)// / 2
    }
  }
  return Math.sqrt(sum / wind)
}

export function url(urlString: string) {
  if (__DEV__) {
    return '/api' + urlString
  }
  return urlString
}

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min
  if (value > max) return max
  return value
}

export function scope<T>(target: T, scope: (this: T) => void) {
  scope.call(target)
}

export function isString(v: any): v is string {
  return typeof v === 'string'
}

export function sleep(m: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, m)
  })
}

export function shallowCopy<T extends object>(source: T): T {
  const result = {}
  const keys = Object.getOwnPropertyNames(source)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    //@ts-ignore
    result[key] = source[key]
  }
  return result as T
}

export function TODO(reason: string) {
  throw new Error(reason)
}

export function debounce(callback: () => void, delay: number) {
  let timeout: any
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(callback, delay)
  }
}