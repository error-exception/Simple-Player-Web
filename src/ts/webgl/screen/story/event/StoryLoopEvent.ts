import {TransitionEvent} from "./TransitionEvent";
import {ArrayUtils} from "../../../../util/ArrayUtils";
import {OSBColorEvent, OSBLoopEvent, OSBParamEvent, OSBValueEvent, OSBVectorEvent} from "../../../../osu/OSUFile";
import {StoryFadeEvent} from "./StoryFadeEvent";
import {StoryMoveEvent} from "./StoryMoveEvent";
import {StoryScaleEvent} from "./StoryScaleEvent";
import {StoryRotateEvent} from "./StoryRotateEvent";
import {StoryColorEvent} from "./StoryColorEvent";
import {IEntry} from "../IEntry";
import {StoryParamEvent} from "./StoryParamEvent";

export class StoryLoopEvent extends TransitionEvent<TransitionEvent<any, any>, any>{

  private events: TransitionEvent<any, any>[] = []
  private durationPerLoop = -1
  private readonly loopCount: number
  private readonly loopStartTime: number

  constructor(
    sprite: IEntry,
    loopEvent: OSBLoopEvent
  ) {
    super(sprite);
    this.loopCount = loopEvent.loopCount
    this.loopStartTime = loopEvent.startTime
    const children = loopEvent.children
    const fade = new StoryFadeEvent(sprite),
      move = new StoryMoveEvent(sprite),
      scale = new StoryScaleEvent(sprite),
      rotate = new StoryRotateEvent(sprite),
      color = new StoryColorEvent(sprite),
      // param = new StoryParamEvent(sprite),
      vFlip = new StoryParamEvent(sprite, "V"),
      hFlip = new StoryParamEvent(sprite, "H"),
      additive = new StoryParamEvent(sprite, "A")
    for (const event of children) {
      if (event.type === "S" || event.type === "V") {
        scale.addEvent(event as OSBValueEvent)
      } else if (event.type === "M" || event.type === "MX" || event.type === "MY") {
        move.addEvent(event as (OSBValueEvent | OSBVectorEvent))
      } else if (event.type === "F") {
        fade.addEvent(event as OSBValueEvent)
      } else if (event.type === "R") {
        rotate.addEvent(event as OSBValueEvent)
      } else if (event.type === "C") {
        color.addEvent(event as OSBColorEvent)
      } else if (event.type === "P") {
        const e = event as OSBParamEvent
        if (e.p === "V") {
          vFlip.addEvent(e)
        } else if (e.p === "H") {
          hFlip.addEvent(e)
        } else if (e.p === "A") {
          additive.addEvent(e)
        }
        // param.addEvent(event as OSBParamEvent)
      }
    }
    this.addEvent(fade)
    this.addEvent(move)
    this.addEvent(scale)
    this.addEvent(rotate)
    this.addEvent(color)
    // this.addEvent(param)
    this.addEvent(vFlip)
    this.addEvent(hFlip)
    this.addEvent(additive)
  }
  addEvent(event: TransitionEvent<any, any>): void {
    this.events.push(event)
    this.eventCount++
  }

  private calculateDurationPerLoop() {
    const times: number[] = [], events = this.events
    for (let i = 0; i < events.length; i++) {
      if (events[i].hasEvent()) {
        times.push(events[i].startTime())
      }
    }
    const startTime = ArrayUtils.minOf(times, e => e)
    times.length = 0
    for (let i = 0; i < events.length; i++) {
      if (events[i].hasEvent()) {
        times.push(events[i].endTime())
      }
    }
    const endTime = ArrayUtils.maxOf(times, e => e)
    this.durationPerLoop = endTime - startTime
  }

  endTime(): number {
    if (this.durationPerLoop < 0) {
      this.calculateDurationPerLoop()
    }
    return this.loopStartTime + this.loopCount * this.durationPerLoop;
  }

  hasEvent(): boolean {
    return this.eventCount > 0;
  }

  startTime(): number {
    return this.loopStartTime;
  }

  update(timestamp: number): void {
    if (this.eventCount === 0) {
      return
    }
    if (this.durationPerLoop < 0)
      this.calculateDurationPerLoop()
    const durationPerLoop = this.durationPerLoop
    const remainsTime = Math.max(timestamp - this.loopStartTime, 0)
    const count = Math.ceil(remainsTime / durationPerLoop)
    if (count > this.loopCount) {
      return;
    }
    const newTimestamp = remainsTime - Math.floor(remainsTime / durationPerLoop) * durationPerLoop
    const events = this.events
    for (let i = 0; i < events.length; i++) {
      events[i].update(newTimestamp)
    }
  }

  startValue(): any {
  }

  endValue(): any {
  }

}