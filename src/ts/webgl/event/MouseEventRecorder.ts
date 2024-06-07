import type {DrawableMouseEvent} from "./DrawableMouseEvent";

export class MouseEventRecorder {

  public static eventList: DrawableMouseEvent[] = []

  public static record(event: DrawableMouseEvent) {
    this.eventList.push(event)
  }

  public static remove(event: DrawableMouseEvent) {
    const index = this.eventList.indexOf(event)
    this.eventList.splice(index, 1)
  }
}