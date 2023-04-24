import {TimingItem} from "./TimingItem";
import {Ref, ref} from "vue";
import {easeIn, easeOut} from "./util/Animation";

export interface BeaterParam {
    bpm: number
    offset: number
}

export class Beater {

    private readonly bpm: number
    private timingList: TimingItem[] = []
    private beatCount: Ref<number> = ref(0)
    private readonly gap: number
    private readonly offset: number = 0

    constructor(param: BeaterParam) {
        this.offset = param.offset
        this.bpm = param.bpm
        this.gap = 60 / param.bpm * 1000
    }

    public getOffset(): number {
        return this.offset
    }

    public setTimingList(timingList: TimingItem[]) {
        this.timingList.push(...timingList)
        this.timingList = this.timingList.sort((a, b) => a.timestamp - b.timestamp)
    }

    public getTimingList(): TimingItem[] {
        return [...this.timingList]
    }

    public isKiai(currentTime: number): boolean {
        const timingList = this.timingList
        if (timingList.length === 0) {
            return false
        }
        let item: TimingItem | null = null
        for (let i = 0; i < timingList.length; i++) {
            if (currentTime < timingList[i].timestamp) {
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

    public getBpm() {
        return this.bpm
    }

    public beat(timestamp: number): number {
        const gap = this.gap
        timestamp += 60
        const count = Math.floor(timestamp / gap)
        timestamp -= count * gap
        this.beatCount.value = count
        if (timestamp <= 60) {
            return easeIn(timestamp / 60)
        }
        if (timestamp <= gap) {
            return easeOut(1 - (timestamp - 60) / (gap - 60))
        }
        return 0
    }

    public getBeatCountRef() {
        return this.beatCount
    }
}