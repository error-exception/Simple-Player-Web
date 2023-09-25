import {BulletTimingPoints, BulletTimingPointsItem, TimingInfo} from "./type";
import {createMutableSharedFlow} from "./util/flow";
import MusicDao from "./dao/MusicDao";

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

    // async fetchTimingInfo(id: number): Promise<TimingInfo | null> {
    //     const response = await fetch(url(`/timing?id=${id}`))
    //     const result = await response.json()
    //     // console.log(result)
    //     if (result.code != 0) {
    //         return null
    //     }
    //     return result.data
    // }

    // async uploadTimingInfo(timingInfo: TimingInfo) {
    //     const response: AxiosResponse<ResponseResult> = await axios.post(url("/uploadTiming"), timingInfo);
    //     // console.log(response.data)
    //     if (!response.data || response.data.code != 0) {
    //         console.error("request error", response.data.code, response.data.message)
    //         return false
    //     } else {
    //         console.log("upload timing info success! id=", timingInfo.id)
    //         return true
    //     }
    // }

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
                return { offset: v.timestamp, isKiai: v.isKiai }
            })
        }
    }

    // async fetchAndInitAllTiming() {
    //     const response = await fetch(url("/allTimingList"))
    //     const data: ResponseResult<TimingInfo[]> = await response.json()
    //     if (data.code === 0 && data.data) {
    //         const list = data.data
    //
    //         for (let i = 0; i < list.length; i++) {
    //             const timingInfo = list[i]
    //             addTimingInfoToCache(timingInfo)
    //             // timingCache.set(timingInfo.id, timingInfo)
    //         }
    //     } else {
    //         console.log("fetch all timing failed")
    //     }
    // }

}

// const defaultTiming: TimingInfo = {
//     version: "1.0",
//     bpm: 60,
//     offset: 0,
//     id: -1,
//     timingList: []
// }
//
// const onTimingChanged = createMutableSharedFlow<TimingInfo>()
//
// const timingCache = new Map<number, TimingInfo>()
//
// async function getTiming(id: number): Promise<TimingInfo | null> {
//     const cache = timingCache.get(id)
//     if (cache) {
//         return cache
//     }
//     const timingInfo = await fetchTimingInfo(id)
//     if (timingInfo === null) {
//         return null
//     }
//     // timingCache.set(id, timingInfo)
//     addTimingInfoToCache(timingInfo)
//     return timingInfo
// }
//
// async function fetchTimingInfo(id: number): Promise<TimingInfo | null> {
//     const response = await fetch(url(`/timing?id=${id}`))
//     const result = await response.json()
//     // console.log(result)
//     if (result.code != 0) {
//         return null
//     }
//     return result.data
// }
//
// async function uploadTimingInfo(timingInfo: TimingInfo) {
//     const response: AxiosResponse<ResponseResult> = await axios.post(url("/uploadTiming"), timingInfo);
//     // console.log(response.data)
//     if (!response.data || response.data.code != 0) {
//         console.error("request error", response.data.code, response.data.message)
//         return false
//     } else {
//         console.log("upload timing info success! id=", timingInfo.id)
//         return true
//     }
// }
//
// function addTimingInfoToCache(timingInfo: TimingInfo) {
//     if (timingInfo.id < 0) {
//         return timingInfo
//     }
//     timingCache.set(timingInfo.id, timingInfo)
//     return timingInfo
// }
//
// async function fetchAndInitAllTiming() {
//     const response = await fetch(url("/allTimingList"))
//     const data: ResponseResult<TimingInfo[]> = await response.json()
//     if (data.code === 0 && data.data) {
//         const list = data.data
//
//         for (let i = 0; i < list.length; i++) {
//             const timingInfo = list[i]
//             addTimingInfoToCache(timingInfo)
//             // timingCache.set(timingInfo.id, timingInfo)
//         }
//     } else {
//         console.log("fetch all timing failed")
//     }
// }
//
// export default {
//     uploadTimingInfo, defaultTiming, addTimingInfoToCache, fetchAndInitAllTiming, fetchTimingInfo, getTiming, onTimingChanged
// }

export default new TimingManager()