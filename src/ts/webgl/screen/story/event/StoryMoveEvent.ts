import {TransitionQueue} from "../TransitionQueue";
import {isValueEvent, isVectorEvent, OSBValueEvent, OSBVectorEvent} from "../../../../osu/OSUFile";
import {Transition} from "../../../transition/Transition";
import {easeFunction} from "../StoryEvent2";
import {TransitionEvent} from "./TransitionEvent";
import {Vector, Vector2} from "../../../core/Vector2";
import {Sprite} from "../Sprite";

export class StoryMoveEvent extends TransitionEvent<OSBValueEvent | OSBVectorEvent, Vector2>{
  private transitionXQueue = new TransitionQueue()
  private transitionYQueue = new TransitionQueue()

  private transitionXList: Transition[] = []
  private transitionYList: Transition[] = []

  protected eventCount = 0

  constructor(sprite: Sprite) {
    super(sprite);
  }

  public addEvent(event: OSBValueEvent | OSBVectorEvent) {
    if (isValueEvent(event)) {
      if (event.type === "MX") {
        const { startTime, endTime, ease, from, to } = event
        const transitionX = new Transition(
          startTime, endTime, easeFunction[ease], to, from
        )
        this.transitionXList.push(transitionX)
      }
      if (event.type === "MY") {
        const { startTime, endTime, ease, from, to } = event
        const transitionY = new Transition(
          startTime, endTime, easeFunction[ease], to, from
        )
        this.transitionYList.push(transitionY)
      }
      this.eventCount++
    } else if (isVectorEvent(event)) {
      const { startTime, endTime, ease, from, to } = event
      const transitionX = new Transition(
        startTime, endTime, easeFunction[ease], to.x, from.x
      )
      const transitionY = new Transition(
        startTime, endTime, easeFunction[ease], to.y, from.y
      )
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
    const transform = this.sprite.transform
    if (x !== null) {
      transform.translate.x = x
    }
    if (y !== null) {
      transform.translate.y = y
    }
  }

  public hasEvent() {
    return this.eventCount > 0
  }

  public startTime() {
    let startTime = Number.MAX_SAFE_INTEGER
    if (this.transitionXQueue.first !== null) {
      startTime = Math.min(startTime, this.transitionXQueue.startTime)
    }
    if (this.transitionYQueue.first !== null) {
      startTime = Math.min(startTime, this.transitionYQueue.startTime)
    }
    return startTime
  }

  public endTime() {
    let endTime = -1
    if (this.transitionXQueue.first !== null) {
      endTime = Math.max(endTime, this.transitionXQueue.endTime)
    }
    if (this.transitionYQueue.first !== null) {
      endTime = Math.max(endTime, this.transitionYQueue.endTime)
    }
    return endTime
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