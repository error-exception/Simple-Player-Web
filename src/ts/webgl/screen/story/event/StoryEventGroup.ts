import {StoryMoveEvent} from "./StoryMoveEvent";
import {StoryFadeEvent} from "./StoryFadeEvent";
import {StoryRotateEvent} from "./StoryRotateEvent";
import {StoryScaleEvent} from "./StoryScaleEvent";
import {StoryColorEvent} from "./StoryColorEvent";
import {StoryParamEvent} from "./StoryParamEvent";
import {StoryLoopEvent} from "./StoryLoopEvent";
import {Sprite} from "../Sprite";
import {
  isLoopEvent,
  OSBColorEvent,
  OSBEvent,
  OSBLoopEvent,
  OSBParamEvent,
  OSBValueEvent,
  OSBVectorEvent
} from "../../../../osu/OSUFile";

export class StoryEventGroup {

  private move: StoryMoveEvent
  private fade: StoryFadeEvent
  private rotate: StoryRotateEvent
  private scale: StoryScaleEvent
  private color: StoryColorEvent
  // private param: StoryParamEvent

  private vFlip: StoryParamEvent
  private hFlip: StoryParamEvent
  private additive: StoryParamEvent


  private loopList: StoryLoopEvent[] = []

  private readonly _startTime = Number.MAX_VALUE
  private readonly _endTime = Number.MIN_VALUE

  constructor(sprite: Sprite, events: OSBEvent[]) {
    this.move = new StoryMoveEvent(sprite)
    this.fade = new StoryFadeEvent(sprite)
    this.rotate = new StoryRotateEvent(sprite)
    this.scale = new StoryScaleEvent(sprite)
    this.color = new StoryColorEvent(sprite)

    this.vFlip = new StoryParamEvent(sprite, "V")
    this.hFlip = new StoryParamEvent(sprite, "H")
    this.additive = new StoryParamEvent(sprite, "A")

    for (const event of events) {
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
        // this.param.addEvent(event as OSBParamEvent)
      }
    }
    let startTime = Math.min(
      this.move.startTime(),
      this.scale.startTime(),
      this.color.startTime(),
      this.rotate.startTime(),
      this.fade.startTime(),
      this.vFlip.startTime(),
      this.hFlip.startTime(),
      this.additive.startTime()
    )
    let endTime = Math.max(
      this.move.endTime(),
      this.scale.endTime(),
      this.color.endTime(),
      this.rotate.endTime(),
      this.fade.endTime(),
      this.vFlip.endTime(),
      this.hFlip.endTime(),
      this.additive.endTime()
    )

    const loopEvent = events.filter(v => isLoopEvent(v))
    for (let i = 0; i < loopEvent.length; i++) {
      const loop = new StoryLoopEvent(sprite, loopEvent[i] as OSBLoopEvent)
      endTime = Math.max(loop.endTime(), endTime)
      startTime = Math.min(loop.startTime(), startTime)
      this.loopList.push(loop)
    }
    console.log(sprite.path, "story group", startTime, endTime)
    this._startTime = startTime
    this._endTime = endTime
  }

  public update(timestamp: number) {
    const loopList = this.loopList
    for (let i = 0; i < loopList.length; i++) {
      loopList[i].update(timestamp)
    }

    this.fade.update(timestamp)
    this.move.update(timestamp)
    this.color.update(timestamp)
    this.scale.update(timestamp)
    this.rotate.update(timestamp)
    this.vFlip.update(timestamp)
    this.hFlip.update(timestamp)
    this.additive.update(timestamp)
  }

  public startTime() {
    return this._startTime
  }

  public endTime() {
    return this._endTime
  }

}