import {BulletTimingPoints, BulletTimingPointsItem, TimingInfo} from "../type";
import {createMutableSharedFlow} from "../util/flow";
import MusicDao from "../dao/MusicDao";

class TimingManager {

    public defaultTiming: TimingInfo = {
        version: "1.0",
        bpm: 60,
        offset: 0,
        id: -1,
        timingList: []
    }

    public onTimingUpdate = createMutableSharedFlow<TimingInfo>()

    private timingCache = new Map<number, TimingInfo>()

    private isInit = false

    private async init() {
        const list = await MusicDao.getAllTimingList()
        console.log(list)
        if (!list) return
        for (let i = 0; i < list.length; i++) {
            const timing = list[i]
            this.addTimingInfoToCache(timing)
        }
        this.isInit = true
    }

    async getTiming(id: number): Promise<TimingInfo | null> {
        if (!this.isInit) {
            await this.init()
        }
        const timing = this.timingCache.get(id)
        if (timing) {
            return timing
        } else {
            return null
        }
    }

    public addTimingInfoToCache(timingInfo: TimingInfo) {
        if (timingInfo.id < 0) {
            return timingInfo
        }
        this.timingCache.set(timingInfo.id, timingInfo)
        return timingInfo
    }

    public async updateTiming(newTiming: TimingInfo) {
        const success = await MusicDao.uploadTimingInfo(newTiming)
        if (success) {
            this.addTimingInfoToCache(newTiming)
            this.onTimingUpdate.emit(newTiming)
        }
        return success
    }

    public toBulletTimingPoints(timingInfo: TimingInfo): BulletTimingPoints {
        return {
            beatGap: 60 / timingInfo.bpm * 1000,
            offset: timingInfo.offset,
            timingList: timingInfo.timingList.map<BulletTimingPointsItem>(v => {
                return { time: v.timestamp, isKiai: v.isKiai }
            })
        }
    }

}

export default new TimingManager()