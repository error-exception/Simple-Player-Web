import {TransitionQueue} from "../TransitionQueue";
import {OSBColorEvent} from "../../../../osu/OSUFile";
import {Transition} from "../../../transition/Transition";
import {easeFunction} from "../StoryEvent2";
import {TransitionEvent} from "./TransitionEvent";
import {IEntry} from "../IEntry";
import {Color} from "../../../base/Color";

export class StoryColorEvent extends TransitionEvent<OSBColorEvent, Color> {
  private transitionRQueue = new TransitionQueue()
  private transitionGQueue = new TransitionQueue()
  private transitionBQueue = new TransitionQueue()
  protected eventCount = 0

  constructor(sprite: IEntry) {
    super(sprite);
  }

  public addEvent(event: OSBColorEvent) {
    const { startTime, endTime, ease, from, to } = event
    const redTransition = new Transition(
      startTime, endTime, easeFunction[ease], to.red, from.red
    )
    const greenTransition = new Transition(
      startTime, endTime, easeFunction[ease], to.green, from.green
    )
    const blueTransition = new Transition(
      startTime, endTime, easeFunction[ease], to.blue, from.blue
    )
    this.transitionRQueue.add(redTransition)
    this.transitionGQueue.add(greenTransition)
    this.transitionBQueue.add(blueTransition)
    this.eventCount++
  }

  public update(timestamp: number) {
    if (this.eventCount === 0) {
      return
    }
    const r = this.transitionRQueue.update(timestamp)
    const g = this.transitionGQueue.update(timestamp)
    const b = this.transitionBQueue.update(timestamp)
    const color = this.sprite.color
    if (r !== null) {
      color.red = r
    }
    if (g !== null) {
      color.green = g
    }
    if (b !== null) {
      color.blue = b
    }
  }

  public hasEvent() {
    return this.eventCount > 0
  }

  public startTime() {
    return Math.min(this.transitionRQueue.startTime, this.transitionGQueue.startTime, this.transitionBQueue.startTime)
  }

  public endTime() {
    return Math.max(this.transitionRQueue.endTime, this.transitionGQueue.endTime, this.transitionBQueue.endTime)
  }

  public startValue(): Color {
    return new Color(
      this.transitionRQueue.startValue,
      this.transitionGQueue.startValue,
      this.transitionBQueue.startValue,
      1
    )
  }

  public endValue(): Color {
    return new Color(
      this.transitionRQueue.endValue,
      this.transitionGQueue.endValue,
      this.transitionBQueue.endValue,
      1
    )
  }
}