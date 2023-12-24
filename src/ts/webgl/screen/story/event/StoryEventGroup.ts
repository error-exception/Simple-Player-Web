import {StoryMoveEvent} from "./StoryMoveEvent";
import {StoryFadeEvent} from "./StoryFadeEvent";
import {StoryRotateEvent} from "./StoryRotateEvent";
import {StoryScaleEvent} from "./StoryScaleEvent";
import {StoryColorEvent} from "./StoryColorEvent";
import {StoryParamEvent} from "./StoryParamEvent";
import {Sprite} from "../Sprite";
import {
  isLoopEvent, OSBBaseEvent,
  OSBColorEvent,
  OSBEvent,
  OSBLoopEvent,
  OSBParamEvent,
  OSBValueEvent,
  OSBVectorEvent
} from "../../../../osu/OSUFile";
import {TransitionEvent} from "./TransitionEvent";
import {ArrayUtils} from "../../../../util/ArrayUtils";
import {shallowCopy} from "../../../../Utils";

export class StoryEventGroup {

  private readonly move: StoryMoveEvent
  private readonly fade: StoryFadeEvent
  private readonly rotate: StoryRotateEvent
  private readonly scale: StoryScaleEvent
  private readonly color: StoryColorEvent

  private readonly vFlip: StoryParamEvent
  private readonly hFlip: StoryParamEvent
  private readonly additive: StoryParamEvent

  private readonly _startTime = Number.MAX_VALUE
  private readonly _endTime = Number.MIN_VALUE

  private readonly storyEventList: TransitionEvent<any, any>[]

  constructor(sprite: Sprite, events: OSBEvent[]) {
    this.move = new StoryMoveEvent(sprite)
    this.fade = new StoryFadeEvent(sprite)
    this.rotate = new StoryRotateEvent(sprite)
    this.scale = new StoryScaleEvent(sprite)
    this.color = new StoryColorEvent(sprite)

    this.vFlip = new StoryParamEvent(sprite, "V")
    this.hFlip = new StoryParamEvent(sprite, "H")
    this.additive = new StoryParamEvent(sprite, "A")

    this.storyEventList = [
      this.move, this.scale, this.fade, this.rotate, this.color,
      this.vFlip, this.hFlip, this.additive
    ]

    for (const event of events) {
      this.addEvent(event)
    }
    const loopEvents = events.filter(v => isLoopEvent(v)) as OSBLoopEvent[]
    const maxOf = (e: OSBBaseEvent) => e.endTime
    for (let i = 0; i < loopEvents.length; i++) {
      const loopEvent = loopEvents[i],
        duration = ArrayUtils.maxOf(loopEvent.children, maxOf),
        loopStartTime = loopEvent.startTime
      for (let j = 0; j < loopEvent.loopCount; j++) {
        const baseTime = loopStartTime + duration * j
        for (const event of loopEvent.children) {
          const copied = shallowCopy(event)
          copied.startTime += baseTime
          copied.endTime += baseTime
          this.addEvent(copied)
        }
      }
    }

    for (const storyEvent of this.storyEventList) {
      storyEvent.commit()
    }

    const startTime = ArrayUtils.minOf(this.storyEventList, e => e.startTime())
    const endTime = ArrayUtils.maxOf(this.storyEventList, e => e.endTime())

    if (sprite.path.includes("sb/m.png")) {
      console.log(sprite.path, "story group", this)
    }
    this._startTime = startTime
    this._endTime = endTime
  }

  private addEvent(event: OSBEvent) {
    if (event.type === "S" || event.type === "V") {
      this.scale.addEvent(event as OSBValueEvent)
    } else if (event.type === "M" || event.type === "MX" || event.type === "MY") {
      this.move.addEvent(event as (OSBValueEvent | OSBVectorEvent))
    } else if (event.type === "F") {
      this.fade.addEvent(event as OSBValueEvent)
    } else if (event.type === "R") {
      this.rotate.addEvent(event as OSBValueEvent)
    } else if (event.type === "C") {
      this.color.addEvent(event as OSBColorEvent)
    } else if (event.type === "P") {
      const e = event as OSBParamEvent
      if (e.p === "V") {
        this.vFlip.addEvent(e)
      } else if (e.p === "H") {
        this.hFlip.addEvent(e)
      } else if (e.p === "A") {
        this.additive.addEvent(e)
      }
    }
  }

  public update(timestamp: number) {
    const list = this.storyEventList, length = list.length
    for (let i = 0; i < length; i++) {
      list[i].update(timestamp)
    }
  }

  public startTime() {
    return this._startTime
  }

  public endTime() {
    return this._endTime
  }

}