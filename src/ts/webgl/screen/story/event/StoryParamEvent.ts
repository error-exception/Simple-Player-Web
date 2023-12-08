import {TransitionEvent} from "./TransitionEvent";
import {OSBParamEvent} from "../../../../osu/OSUFile";
import {IEntry} from "../IEntry";

export class StoryParamEvent extends TransitionEvent<OSBParamEvent, void>{

  private paramList: OSBParamEvent[] = []

  constructor(sprite: IEntry) {
    super(sprite);
  }

  addEvent(event: OSBParamEvent): void {
    this.paramList.push(event)
    this.eventCount++
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
    const list = this.paramList, sprite = this.sprite
    if (list.length === 0) {
      return
    }
    let hf = false, vf = false, ab = false
    for (let i = 0; i < list.length; i++) {
      const e = list[i]
      if (timestamp >= e.startTime && timestamp <= e.endTime) {
        ab = e.p === "A"
        vf = e.p === "V"
        hf = e.p === "H"
      }
    }
    sprite.additiveBlend = ab
    sprite.verticalFlip = vf
    sprite.horizontalFlip = hf
  }

  startValue(): void {
  }

  endValue(): void {
  }

}