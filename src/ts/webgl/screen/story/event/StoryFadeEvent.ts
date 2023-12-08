import {TransitionQueue} from "../TransitionQueue";
import {OSBValueEvent} from "../../../../osu/OSUFile";
import {Transition} from "../../../transition/Transition";
import {easeFunction} from "../StoryEvent2";
import {TransitionEvent} from "./TransitionEvent";
import {IEntry} from "../IEntry";

export class StoryFadeEvent extends TransitionEvent<OSBValueEvent, number> {

  private transitionQueue = new TransitionQueue()
  protected eventCount = 0

  constructor(sprite: IEntry) {
    super(sprite);
  }

  public addEvent(event: OSBValueEvent) {
    const { startTime, endTime, ease, from, to } = event
    const transition = new Transition(
      startTime, endTime, easeFunction[ease], to, from
    )
    this.transitionQueue.add(transition)
    this.eventCount++
  }

  public update(timestamp: number) {
    if (this.eventCount === 0) {
      return
    }
    const value = this.transitionQueue.update(timestamp)
    if (value !== null) {
      this.sprite.transform.alphaTo(value)
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