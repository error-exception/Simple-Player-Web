import {TransitionQueue} from "../TransitionQueue";
import {OSBColorEvent} from "../../../../osu/OSUFile";
import {Transition} from "../../../transition/Transition";
import {easeFunction} from "../StoryEvent2";
import {TransitionEvent} from "./TransitionEvent";
import {Color} from "../../../base/Color";
import {Sprite} from "../Sprite";

export class StoryColorEvent extends TransitionEvent<OSBColorEvent, Color> {
  private transitionRQueue = new TransitionQueue()
  private transitionGQueue = new TransitionQueue()
  private transitionBQueue = new TransitionQueue()

  private transitionRList: Transition[] = []
  private transitionGList: Transition[] = []
  private transitionBList: Transition[] = []

  protected eventCount = 0

  constructor(sprite: Sprite) {
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
    // this.transitionRQueue.add(redTransition)
    // this.transitionGQueue.add(greenTransition)
    // this.transitionBQueue.add(blueTransition)
    this.transitionRList.push(redTransition)
    this.transitionGList.push(greenTransition)
    this.transitionBList.push(blueTransition)
    this.eventCount++
  }

  public commit() {
    this.transitionRList.sort(this.transitionSortCompare)
    this.transitionGList.sort(this.transitionSortCompare)
    this.transitionBList.sort(this.transitionSortCompare)
    for (const transitionR of this.transitionRList) {
      this.transitionRQueue.add(transitionR)
    }
    for (const transitionG of this.transitionGList) {
      this.transitionGQueue.add(transitionG)
    }
    for (const transitionB of this.transitionBList) {
      this.transitionBQueue.add(transitionB)
    }
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