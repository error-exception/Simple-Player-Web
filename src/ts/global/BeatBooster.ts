import {linear, TimeFunction} from "../util/Easing";
import {int} from "../Utils";
import {BeatDispatcher} from "./Beater";
import {BulletTimingPointsItem} from "../type";
import TimingManager from "./TimingManager";
import OSUPlayer from "../player/OSUPlayer";
import {collect} from "../util/eventRef";

class BeatBooster {

  private timingList: BulletTimingPointsItem[] = []
  private beatCount: number = 0
  private prevBeat = -1
  public isAvailable: boolean = false

  constructor() {
    TimingManager.onTimingUpdate.collect((timingInfo) => {
      if (!timingInfo) {
        this.setTimingPoints(null)
        return
      }
      const bulletTimingPoints = TimingManager.toBulletTimingPoints(timingInfo)
      this.setTimingPoints(bulletTimingPoints.timingList)
    })
    collect(OSUPlayer.onChanged, ([osu]) => {
      if (osu.TimingPoints && osu.TimingPoints.timingList.length) {
        this.setTimingPoints(osu.TimingPoints.timingList)
      } else {
        this.setTimingPoints(null)
      }
    })
    // OSUPlayer.onChanged.collect(bullet => {
    //
    // })
  }

  private currentBeatLength = 1000
  private currentTime = 0
  private isDynamicBPM = false

  private beatTimingPoints: BulletTimingPointsItem[] = []

  public setTimingPoints(timingList: BulletTimingPointsItem[] | null) {
    if (timingList === null || timingList.length === 0) {
      this.isAvailable = false
      timingList = [{
        beatLength: 1000, isKiai: false, time: 0
      }]
    } else {
      this.isAvailable = true
    }
    this.prevBeat = -1
    this.timingList = timingList
    this.beatTimingPoints = timingList.filter(v => v.beatLength > 0)
    if (this.beatTimingPoints.length === 1) {
      this.isDynamicBPM = false
      this.currentTime = this.beatTimingPoints[0].time
      this.currentBeatLength = this.beatTimingPoints[0].beatLength
    } else {
      this.isDynamicBPM = true
    }
  }

  public updateBeat(timestamp: number, before: TimeFunction = linear, after: TimeFunction = linear): number {
    if (this.isDynamicBPM) {
      const timingList = this.beatTimingPoints
      let timing, i = 0
      while (i < timingList.length) {
        if (timestamp < timingList[i].time) {
          if (i > 0) {
            timing = timingList[i - 1]
          }
          break
        }
        i++
      }
      if (i === timingList.length) {
        timing = timingList[i - 1]
      }
      if (!timing || (i === 0 && timestamp < timing.time)) {
        return 0
      }
      this.currentBeatLength = timing.beatLength
      this.currentTime = timing.time
    } else {
      if (timestamp < this.currentTime) {
        return 0
      }
    }
    timestamp -= this.currentTime
    const gap = this.currentBeatLength
    timestamp += 60
    const count = int(timestamp / gap)
    timestamp -= count * gap
    this.beatCount = count
    if (count === 0) {
      return 0
    }
    if (this.prevBeat != count) {
      this.prevBeat = count
      const nextBeatTime = this.getNextBeatTime()
      BeatDispatcher.fireNewBeat(this.isKiai(nextBeatTime), nextBeatTime, this.currentBeatLength)
    }
    if (timestamp <= 60) {
      return before(timestamp / 60)
    }
    if (timestamp <= gap) {
      return after(1 - (timestamp - 60) / (gap - 60))
    }
    return 0
  }

  public getNextBeatTime(): number {
    return this.currentTime + this.currentBeatLength * (this.beatCount + 1)
  }

  public isKiai(currentTime: number): boolean {
    currentTime += 60
    const timingList = this.timingList
    if (timingList.length === 0) {
      return false
    }
    let item: BulletTimingPointsItem | null = null
    for (let i = 0; i < timingList.length; i++) {
      if (currentTime <= timingList[i].time) {
        if (i > 0) {
          item = timingList[i - 1]
        }
        break
      }
    }
    if (item === null) {
      return false
    } else {
      return item.isKiai
    }
  }

  public getCurrentBeatCount() {
    return this.beatCount
  }

}

export default new BeatBooster()

