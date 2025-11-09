import { isValueEvent, isVectorEvent, OSBValueEvent, OSBVectorEvent } from "../../../../osu/OSUFile";
import { Vector, Vector2 } from "../../../graphic/core/Vector2";
import { Transition } from "../../../transition/Transition";
import type { StorySprite } from "../Sprite2";
import { easeFunction } from "../StoryEvent2";
import { TransitionQueue } from "../TransitionQueue";
import { TransitionEvent } from "./TransitionEvent";

export class StoryScaleEvent extends TransitionEvent<OSBValueEvent | OSBVectorEvent, Vector2> {
  private transitionXQueue = new TransitionQueue()
  private transitionYQueue = new TransitionQueue()

  private transitionXList: Transition[] = []
  private transitionYList: Transition[] = []

  protected eventCount = 0

  constructor(sprite: StorySprite) {
    super(sprite);
  }

  public addEvent(event: OSBValueEvent | OSBVectorEvent) {
    if (isValueEvent(event)) {
      const { startTime, endTime, ease, from, to } = event
      const transitionX = new Transition(
        startTime, endTime, easeFunction[ease], to, from
      )
      const transitionY = new Transition(
        startTime, endTime, easeFunction[ease], to, from
      )
      // this.transitionXQueue.add(transitionX)
      // this.transitionYQueue.add(transitionY)
      this.transitionXList.push(transitionX)
      this.transitionYList.push(transitionY)
      this.eventCount++
    } else if (isVectorEvent(event)) {
      const { startTime, endTime, ease, from, to } = event
      const transitionX = new Transition(
        startTime, endTime, easeFunction[ease], to.x, from.x
      )
      const transitionY = new Transition(
        startTime, endTime, easeFunction[ease], to.y, from.y
      )
      // this.transitionXQueue.add(transitionX)
      // this.transitionYQueue.add(transitionY)
      this.transitionXList.push(transitionX)
      this.transitionYList.push(transitionY)
      this.eventCount++
    }
  }

  public commit() {
    this.transitionXList.sort(this.transitionSortCompare)
    this.transitionYList.sort(this.transitionSortCompare)
    for (const transitionX of this.transitionXList) {
      this.transitionXQueue.add(transitionX)
    }
    for (const transitionY of this.transitionYList) {
      this.transitionYQueue.add(transitionY)
    }
  }

  public update(timestamp: number) {
    if (this.eventCount === 0) {
      return
    }
    const x = this.transitionXQueue.update(timestamp)
    const y = this.transitionYQueue.update(timestamp)
    const sprite = this.sprite
    if (x !== null) {
      sprite._scale[0] = x
    }
    if (y !== null) {
      sprite._scale[1] = y
    }
  }

  public hasEvent() {
    return this.eventCount > 0
  }

  public startTime() {
    return Math.min(this.transitionXQueue.startTime, this.transitionYQueue.startTime)
  }

  public endTime() {
    return Math.max(this.transitionXQueue.endTime, this.transitionYQueue.endTime)
  }

  public startValue(): Vector2 {
    return Vector(
      this.transitionXQueue.startValue,
      this.transitionYQueue.startValue
    )
  }

  public endValue(): Vector2 {
    return Vector(
      this.transitionXQueue.endValue,
      this.transitionYQueue.endValue
    )
  }

}