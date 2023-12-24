import {TransitionEvent} from "./TransitionEvent";
import {OSBParamEvent} from "../../../../osu/OSUFile";
import {Sprite} from "../Sprite";

export class StoryParamEvent extends TransitionEvent<OSBParamEvent, void>{

  private paramList: OSBParamEvent[] = []
  private readonly updateSprite: (value: boolean) => void

  constructor(sprite: Sprite, private paramType: "A" | "V" | "H") {
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

  public commit() {
    this.paramList.sort((a, b) => a.startTime - b.startTime)
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

  private currentIndex: number = -1
  update(timestamp: number): void {
    const list = this.paramList
    if (list.length === 0 || this.eventCount === 0) {
      return
    }
    let currentIndex = this.currentIndex
    if (currentIndex < 0 || timestamp < list[currentIndex].startTime) {
      currentIndex = 0
    }
    while (timestamp >= list[currentIndex].startTime && currentIndex < list.length - 1 && timestamp >= list[currentIndex + 1].startTime) {
      currentIndex++
    }
    this.currentIndex = currentIndex
    const event = list[currentIndex]
    if (event.startTime === event.endTime) {
      this.updateSprite(true)
    } else if (timestamp >= event.startTime && timestamp <= event.endTime) {
      this.updateSprite(true)
    } else {
      this.updateSprite(false)
    }
  }

  startValue(): void {
  }

  endValue(): void {
  }

}