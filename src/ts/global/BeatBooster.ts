import {linear, TimeFunction} from "../util/Easing";
import {int} from "../Utils";
import {BeatDispatcher} from "./Beater";
import {BulletTimingPointsItem} from "../type";
import TimingManager from "./TimingManager";
import OSUPlayer from "../player/OSUPlayer";

class BeatBooster {

    // private bpm: number
    private timingList: BulletTimingPointsItem[] = []
    private beatCount:number = 0
    private gap: number = 60 / 60 * 1000
    private offset: number = 0
    private prevBeat = -1
    public isAvailable: boolean = false

    constructor() {
        TimingManager.onTimingUpdate.collect((timingInfo) => {

            if (!timingInfo) {
                this.isAvailable = false
                this.gap = 60 / 60 * 1000
                this.offset = 0
                this.prevBeat = -1
                this.timingList = []
                return
            }
            const bulletTimingPoints = TimingManager.toBulletTimingPoints(timingInfo)
            this.isAvailable = true
            this.gap = bulletTimingPoints.beatGap
            this.offset = timingInfo.offset
            this.timingList = bulletTimingPoints.timingList
            this.prevBeat = -1
        })
        OSUPlayer.onChanged.collect(bullet => {
            if (bullet.general.from === "default" && !bullet.available) {
                console.log("nononnn");
                
                this.isAvailable = false
                this.gap = 1000
                this.offset = 0
                this.timingList = []
                this.prevBeat = -1
            } else {
                this.isAvailable = true
                this.gap = bullet.timingPoints.beatGap
                this.offset = bullet.timingPoints.offset
                this.timingList = bullet.timingPoints.timingList
                this.prevBeat = -1
            }
        })
    }

    public updateBeat(timestamp: number, before: TimeFunction = linear, after: TimeFunction = linear): number {
        if (timestamp < this.offset) {
            return 0
        }
        timestamp -= this.offset
        const gap = this.gap
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
            BeatDispatcher.fireNewBeat(this.isKiai(nextBeatTime), nextBeatTime, this.gap)
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
        return this.offset + this.gap * (this.beatCount + 1)
    }

    public isKiai(currentTime: number): boolean {
        currentTime += 60
        const timingList = this.timingList
        if (timingList.length === 0) {
            return false
        }
        let item: BulletTimingPointsItem | null = null
        for (let i = 0; i < timingList.length; i++) {
            if (currentTime <= timingList[i].offset) {
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

    public getGap() {
        return this.gap
    }

    public getOffset() {
        return this.offset
    }

}

export default new BeatBooster()

