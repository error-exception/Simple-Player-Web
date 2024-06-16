import type {DrawableMouseEvent} from "./DrawableMouseEvent";

export class MouseEventRecorder {

  public static eventList: DrawableMouseEvent[] = []
  public static eventListReserve: DrawableMouseEvent[] = []

  public static record(event: DrawableMouseEvent) {
    this.eventList.push(event)
    this.eventListReserve.unshift(event)
  }

  public static remove(event: DrawableMouseEvent) {
    let index = this.eventList.indexOf(event)
    if (index >= 0)
      this.eventList.splice(index, 1)
    index = this.eventListReserve.indexOf(event)
    if (index >= 0)
      this.eventListReserve.splice(index, 1)
  }
}