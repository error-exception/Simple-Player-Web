import {StoryMoveEvent} from "./StoryMoveEvent";
import {StoryFadeEvent} from "./StoryFadeEvent";
import {StoryRotateEvent} from "./StoryRotateEvent";
import {StoryScaleEvent} from "./StoryScaleEvent";
import {StoryColorEvent} from "./StoryColorEvent";
import {StoryParamEvent} from "./StoryParamEvent";
import {StoryLoopEvent} from "./StoryLoopEvent";
import {Sprite} from "../Sprite";
import {Nullable} from "../../../../type";
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
  private param: StoryParamEvent

  private loop: Nullable<StoryLoopEvent>

  private readonly _startTime = Number.MAX_VALUE
  private readonly _endTime = Number.MIN_VALUE

  constructor(sprite: Sprite, events: OSBEvent[]) {
    this.move = new StoryMoveEvent(sprite)
    this.fade = new StoryFadeEvent(sprite)
    this.rotate = new StoryRotateEvent(sprite)
    this.scale = new StoryScaleEvent(sprite)
    this.color = new StoryColorEvent(sprite)
    this.param = new StoryParamEvent(sprite)

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
        this.param.addEvent(event as OSBParamEvent)
      }
    }
    let startTime = Math.min(
      this.move.startTime(), this.scale.startTime(), this.color.startTime(), this.rotate.startTime(), this.param.startTime(), this.fade.startTime()
    )
    let endTime = Math.max(
      this.move.endTime(), this.scale.endTime(), this.color.endTime(), this.rotate.endTime(), this.param.endTime(), this.fade.endTime()
    )

    const loopEvent = events.find(v => isLoopEvent(v))
    if (loopEvent) {
      this.loop = new StoryLoopEvent(sprite, loopEvent as OSBLoopEvent)
      startTime = Math.min(this.loop.startTime(), startTime)
      endTime = Math.max(this.loop.endTime(), endTime)
    } else {
      this.loop = null
    }
    console.log(sprite.path, "story group", startTime, endTime)
    this._startTime = startTime
    this._endTime = endTime
  }

  public update(timestamp: number) {
    this.loop?.update(timestamp)

    this.fade.update(timestamp)
    this.move.update(timestamp)
    this.color.update(timestamp)
    this.scale.update(timestamp)
    this.rotate.update(timestamp)
    this.param.update(timestamp)
  }

  public startTime() {
    return this._startTime
  }

  public endTime() {
    return this._endTime
  }

}