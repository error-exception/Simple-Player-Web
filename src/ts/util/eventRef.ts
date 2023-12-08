import {customRef, queuePostFlushCb, Ref, watch, watchEffect} from "vue";

interface EventRef<T> extends Ref<T> {
  emit(val: T): void
}

export function eventRef<T = void>(val?: T): EventRef<T> {
  const event = customRef<T>((track, trigger) => {
    let value = val
    return {
      get() {
        track()
        return value as T
      },
      set(newValue?: T) {
        value = newValue
        trigger()
      }
    }
  }) as EventRef<T>
  event.emit = function (val) {
    this.value = val
  }
  return event
}

export function collect<T>(r: Ref<T>, callback: (value: T) => void) {
  let skipFirst = true
  let newValue = r.value
  const job = () => {
    callback(newValue)
  }
  return watchEffect(() => {
    newValue = r.value
    if (skipFirst) {
      skipFirst = false
      return
    }
    queuePostFlushCb(job)
  })
}

export function collectLatest<T>(r: Ref<T>, callback: (value: T) => void) {
  return watch(r, callback, { immediate: true })
}