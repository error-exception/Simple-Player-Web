import {ArrayUtils} from "../util/ArrayUtils";

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

export const BeatState = {

    currentBeat: 0,
    isKiai: false,
    beatIndex: 0,
    currentRMS: 0,
    isAvailable: false,
    nextBeatRMS: 0
}