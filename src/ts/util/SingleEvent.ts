import {onMounted, onUnmounted} from "vue";

export type EventCallback<T> = (e: T) => void

export class SingleEvent<T> {

  public eventList: EventCallback<T>[] = [];

  public add(callback: EventCallback<T>) {
    this.eventList.push(callback)
    return () => this.remove(callback)
  }

  public remove(callback: EventCallback<T>) {
    const index = this.eventList.indexOf(callback)
    if (index !== -1) {
      this.eventList.splice(index, 1)
    }
  }

  public fire(p: T) {
    const list = this.eventList
    for (let i = 0; i < list.length; i++) {
      list[i](p)
    }
  }

  public removeAll() {
    this.eventList.length = 0
  }

}

export function useSingleEvent<T>(event: SingleEvent<T>, callback: (e: T) => void) {
  onMounted(() => {
    event.add(callback)
  })
  onUnmounted(() => {
    event.remove(callback)
  })
}