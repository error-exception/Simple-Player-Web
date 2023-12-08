import {TransitionEvent} from "./TransitionEvent";
import {OSBParamEvent} from "../../../../osu/OSUFile";
import {IEntry} from "../IEntry";

export class StoryParamEvent extends TransitionEvent<OSBParamEvent, void>{

  private paramList: OSBParamEvent[] = []
  private updateSprite: (value: boolean) => void

  constructor(sprite: IEntry, private paramType: "A" | "V" | "H") {
    super(sprite);
    if (paramType === "A") {
      this.updateSprite = (value) => {
        sprite.additiveBlend = value
      }
    } else if (paramType === "V") {
      this.updateSprite = (value) => {
        sprite.verticalFlip = value
      }
    } else {
      this.updateSprite = (value) => {
        sprite.horizontalFlip = value
      }
    }
  }

  addEvent(event: OSBParamEvent): void {
    if (event.p === this.paramType) {
      this.paramList.push(event)
      this.eventCount++
    }
  }

  hasEvent(): boolean {
    return this.eventCount > 0;
  }

  private _startTime = -1
  private _endTime = -1
  endTime(): number {
    if (this._endTime < 0) {
      const list = this.paramList
      let max = -1
      for (let i = 0; i < list.length; i++) {
        max = Math.max(list[i].endTime, max)
      }
      this._endTime = max
    }
    return this._endTime;
  }

  startTime(): number {
    if (this._startTime < 0) {
      const list = this.paramList
      let min = Number.MAX_SAFE_INTEGER
      for (let i = 0; i < list.length; i++) {
        min = Math.min(list[i].startTime, min)
      }
      this._startTime = min
    }
    return this._startTime;
  }

  update(timestamp: number): void {
    const list = this.paramList
    if (list.length === 0) {
      return
    }
    let value = false
    if (timestamp <= list[0].startTime) {
      value = list[0].p === this.paramType
      this.updateSprite(value)
      return;
    } else if (timestamp <= list[list.length - 1].endTime) {
      value = list[0].p === this.paramType
      this.updateSprite(value)
    } else {
      for (let i = 1; i < list.length - 1; i++) {
        const e = list[i]
        if (timestamp >= e.startTime && timestamp <= e.endTime) {
          value = e.p === this.paramType
        }
      }
      this.updateSprite(value)
    }
  }

  startValue(): void {
  }

  endValue(): void {
  }

}