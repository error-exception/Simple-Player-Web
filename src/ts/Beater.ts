import {ArrayUtils} from "./util/ArrayUtils";

export interface BeaterParam {
    bpm: number
    offset: number,
    available?: boolean
}

export interface IBeat {
    onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void
}

export class BeatDispatcher {

    private static readonly IBeatList: IBeat[] = []

    public static register(beat: IBeat) {
        this.IBeatList.push(beat)
    }

    public static unregister(beat: IBeat) {
        const index = this.IBeatList.indexOf(beat)
        if (ArrayUtils.inBound(BeatDispatcher.IBeatList, index)) {
            BeatDispatcher.IBeatList.splice(index, 1)
        }
    }

    public static fireNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        const list = BeatDispatcher.IBeatList
        for (let i = 0; i < list.length; i++) {
            list[i].onNewBeat(isKiai, newBeatTimestamp, gap)
        }
    }

}

// export class Beater {
//
//     private bpm: number
//     private timingList: TimingItem[] = []
//     private beatCount:number = 0
//     private gap: number
//     private offset: number = 0
//     public readonly isAvailable: boolean
//
//     constructor(param: BeaterParam) {
//         this.offset = param.offset
//         this.bpm = param.bpm
//         this.gap = 60 / param.bpm * 1000
//         if (isUndef(param.available)) {
//             this.isAvailable = true
//         } else {
//             this.isAvailable = param.available
//         }
//     }
//
//     public setOffset(offset: number) {
//         this.offset = offset
//     }
//
//     public setBpm(bpm: number) {
//         this.bpm = bpm
//         this.gap = 60 / bpm * 1000
//     }
//
//
//     public getOffset(): number {
//         return this.offset
//     }
//
//     public getGap(): number {
//         return this.gap
//     }
//
//     public setTimingList(timingList: TimingItem[]) {
//         this.timingList.push(...timingList)
//         this.timingList = this.timingList.sort((a, b) => a.timestamp - b.timestamp)
//     }
//
//     public getTimingList(): TimingItem[] {
//         return [...this.timingList]
//     }
//
//     public isKiai(currentTime: number): boolean {
//         currentTime += 60
//         const timingList = this.timingList
//         if (timingList.length === 0) {
//             return false
//         }
//         let item: TimingItem | null = null
//         for (let i = 0; i < timingList.length; i++) {
//             if (currentTime <= timingList[i].timestamp) {
//                 if (i > 0) {
//                     item = timingList[i - 1]
//                 }
//                 break
//             }
//         }
//         if (item === null) {
//             return false
//         } else {
//             return item.isKiai
//         }
//     }
//
//     public getBpm() {
//         return this.bpm
//     }
//
//     private beatFlag = false
//     private prevBeat = 0
//
//     public beat(timestamp: number, before: TimeFunction = linear, after: TimeFunction = linear): number {
//         if (timestamp < this.offset) {
//             return 0
//         }
//         timestamp -= this.offset
//         const gap = this.gap
//         timestamp += 60
//         const count = int(timestamp / gap)
//         timestamp -= count * gap
//         this.beatCount = count
//         if (count === 0) {
//             return 0
//         }
//         if (this.prevBeat != count) {
//             this.prevBeat = count
//             const nextBeatTime = this.getNextBeatTime()
//             BeatDispatcher.fireNewBeat(this.isKiai(nextBeatTime), nextBeatTime, this.gap)
//         }
//         if (timestamp <= 60) {
//             return before(timestamp / 60)
//         }
//         if (timestamp <= gap) {
//             return after(1 - (timestamp - 60) / (gap - 60))
//         }
//         return 0
//     }
//
//     public getBeatCount(): number {
//         return this.beatCount
//     }
//
//     public getNextBeatTime(): number {
//         return this.offset + this.gap * (this.beatCount + 1)
//     }
// }

export const BeatState = {

    currentBeat: 0,
    isKiai: false,
    beatIndex: 0,
    currentRMS: 0,
    // beat: new Beater({
    //     bpm: 60,
    //     offset: 60
    // }),
    isAvailable: false,
    nextBeatRMS: 0
}