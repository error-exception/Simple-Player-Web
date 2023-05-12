// BpmCalculator.vue use only

import {TimingItem} from "./TimingItem";
import {easeInOut, easeOut, easeOutQuint} from "./util/Easing";

export class TestBeater {

    private bpm: number = 0
    private gap: number = 0
    private offset: number = 0
    private timingList: TimingItem[] = []
    private beatCount: number = 0

    public getGap(): number {
        return this.gap
    }

    public setBpm(bpm: number) {
        this.bpm = bpm
        this.gap = 60 / bpm * 1000
    }

    public setOffset(offset: number) {
        this.offset = offset
    }

    public setTimingList(list: TimingItem[]) {
        this.timingList = [...list]
        this.timingList = this.timingList.sort((a, b) => a.timestamp - b.timestamp)
    }

    public isKiai(currentTime: number): boolean {
        currentTime += 60
        const timingList = this.timingList
        if (timingList.length === 0) {
            return false
        }
        let item: TimingItem | null = null
        for (let i = 0; i < timingList.length; i++) {
            if (currentTime <= timingList[i].timestamp) {
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

    private beatFlag = false
    private prevBeat = -1

    public beat(timestamp: number): number {
        if (timestamp < this.offset) {
            return 0
        }
        timestamp -= this.offset
        const gap = this.gap
        timestamp += 60
        const count = Math.floor(timestamp / gap)
        timestamp -= count * gap
        this.beatCount = count
        if (timestamp <= 60) {

            return easeOut(timestamp / 60)
        }
        if (timestamp <= gap - 60) {
            if (!this.beatFlag && this.prevBeat != count) {
                this.beatFlag = true
                this.prevBeat = count
            } else {
                this.beatFlag = false
            }
            return easeInOut(1 - (timestamp - 60) / (gap - 120))
        }

        if (timestamp <= gap) {
            return 0
        }
        return 0
    }

    public getBeatCount(): number {
        return this.beatCount
    }

    public getOffset(): number {
        return this.offset
    }

    public isBeat(): boolean {
        return this.beatFlag
    }

}