import { OSBValueEvent } from "../../../../osu/OSUFile";
import { Transition } from "../../../transition/Transition";
import type { StorySprite } from "../Sprite2";
import { easeFunction } from "../StoryEvent2";
import { TransitionQueue } from "../TransitionQueue";
import { TransitionEvent } from "./TransitionEvent";

export class StoryFadeEvent extends TransitionEvent<OSBValueEvent, number> {

  private transitionQueue = new TransitionQueue()
  protected eventCount = 0

  constructor(sprite: StorySprite) {
    super(sprite);
  }

  private transitionList: Transition[] = []
  public addEvent(event: OSBValueEvent) {
    const { startTime, endTime, ease, from, to } = event
    const transition = new Transition(
      startTime, endTime, easeFunction[ease], to, from
    )
    this.transitionList.push(transition)
    this.eventCount++
  }

  public commit() {
    const list = this.transitionList
    list.sort(this.transitionSortCompare)
    for (let i = 0; i < list.length; i++) {
      this.transitionQueue.add(list[i])
    }
  }

  public update(timestamp: number) {
    if (this.eventCount === 0) {
      return
    }
    const value = this.transitionQueue.update(timestamp)
    if (value !== null) {
      this.sprite._alpha = value
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