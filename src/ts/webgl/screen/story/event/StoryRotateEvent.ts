import {TransitionQueue} from "../TransitionQueue";
import {OSBValueEvent} from "../../../../osu/OSUFile";
import {Transition} from "../../../transition/Transition";
import {easeFunction} from "../StoryEvent2";
import {radianToDegree} from "../../../../Utils";
import {TransitionEvent} from "./TransitionEvent";
import {Sprite} from "../Sprite";

export class StoryRotateEvent extends TransitionEvent<OSBValueEvent, number> {
  private transitionQueue = new TransitionQueue()
  private transitionList: Transition[] = []
  protected eventCount = 0

  constructor(sprite: Sprite) {
    super(sprite);
  }

  public addEvent(event: OSBValueEvent) {
    const { startTime, endTime, ease, from, to } = event
    const transition = new Transition(
      startTime, endTime, easeFunction[ease], to, from
    )
    // this.transitionQueue.add(transition)
    this.transitionList.push(transition)
    this.eventCount++
  }

  public commit() {
    this.transitionList.sort(this.transitionSortCompare)
    for (const transition of this.transitionList) {
      this.transitionQueue.add(transition)
    }
  }

  public update(timestamp: number) {
    if (this.eventCount === 0) {
      return
    }
    const value = this.transitionQueue.update(timestamp)
    if (value !== null) {
      this.sprite.transform.rotateTo(radianToDegree(-value))
    }
  }

  public hasEvent() {
    return this.eventCount > 0
  }

  public startTime() {
    return this.transitionQueue.startTime
  }

  public endTime() {
    return this.transitionQueue.endTime
  }

  public startValue(): number {
    return this.transitionQueue.startValue
  }

  public endValue(): number {
    return this.transitionQueue.endValue
  }
}