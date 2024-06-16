import {MouseEventRecorder} from "./MouseEventRecorder";
import type {Vector2} from "../core/Vector2";

/**
 * todo: 控制事件只能向根节点传递，类似与事件冒泡机制
 */
export class MouseEventFire {

  private static fireMouseEvent = true

  public static pause() {
    this.fireMouseEvent = false
  }

  public static resume() {
    this.fireMouseEvent = true
  }

  public static fireMouseDown(which: number, position: Vector2) {
    if (!this.fireMouseEvent) {
      return
    }
    const events = MouseEventRecorder.eventList
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i]
      // todo: 若实现类似冒泡的机制，则必须在此处添加当前的 Drawable 是否为 Box 的判断，只有不是 Box 才能接收鼠标按下的事件
      // todo：而此时，该 Drawable 刚好处于叶节点
      if (event.inBound(position) && event.isPresent) {
        event?.mouseDown(which, position)
      }
    }
  }

  public static fireMouseMove(which: number, position: Vector2) {
    if (!this.fireMouseEvent) {
      return
    }
    const events = MouseEventRecorder.eventList
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i]
      event?.mouseMove(which, position)
      // if (event.source !instanceof Box) {
      //   break
      // }
    }
  }

  public static fireMouseUp(which: number, position: Vector2) {
    if (!this.fireMouseEvent) {
      return
    }
    const events = MouseEventRecorder.eventListReserve
    /**
     * 在执行事件的过程中，中途可能会存在因 Drawable 被 Dispose 掉，而导致的 eventList 中的元素被移除，
     * 所以采用 for of 代替 for index
     */
    for (const event of events) {
      event.mouseUp(which, position)
    }
  }

}