export {}
// import {Beater} from "./Beater";
// import axios, {AxiosResponse} from "axios";
// import {ResponseResult} from "./type";
// import {url} from "./Utils";
//
//
// export const defaultBeater = new Beater({
//     bpm: 60,
//     offset: 0,
//     available: false
// })
//
// const beaterCache = new Map<number, Beater>()
//
// export async function getBeater(id: number): Promise<Beater> {
//     const cache = beaterCache.get(id)
//     if (cache) {
//         return cache
//     }
//     const timingInfo = await fetchTimingInfo(id)
//     if (timingInfo === null) {
//         return defaultBeater
//     }
//     const beater = new Beater({
//         bpm: timingInfo.bpm,
//         offset: timingInfo.offset
//     })
//     beater.setTimingList(timingInfo.timingList || [])
//     beaterCache.set(id, beater)
//     return beater
// }
//
// async function fetchTimingInfo(id: number): Promise<TimingInfo | null> {
//     const response = await fetch(url(`/timing?id=${id}`))
//     const result = await response.json()
//     console.log(result)
//     if (result.code != 0) {
//         return null
//     }
//     return result.data
// }
//
// export async function uploadTimingInfo(timingInfo: TimingInfo) {
//     const response: AxiosResponse<ResponseResult> = await axios.post(url("/uploadTiming"), timingInfo);
//     console.log(response.data)
//     if (!response.data || response.data.code != 0) {
//         console.error("request error", response.data.code, response.data.message)
//         return false
//     } else {
//         console.log("upload timing info success! id=", timingInfo.id)
//         return true
//     }
// }
//
// export function addTimingInfoToCache(timingInfo: TimingInfo): Beater {
//     const beater = new Beater({
//         bpm: timingInfo.bpm,
//         offset: timingInfo.offset
//     })
//     beater.setTimingList(timingInfo.timingList || [])
//     beaterCache.set(timingInfo.id, beater)
//     return beater
// }
//
// export async function fetchAndInitAllTiming() {
//     const response = await fetch(url("/allTimingList"))
//     const data: ResponseResult<TimingInfo[]> = await response.json()
//     if (data.code === 0 && data.data) {
//         const list = data.data
//         // const map = new Map<number, TimingInfo>()
//         // for (let i = 0; i < list.length; i++) {
//         //     map.set(list[i].id, list[i])
//         // }
//
//         for (let i = 0; i < list.length; i++) {
//             const timingInfo = list[i]
//             const beater = new Beater({
//                 bpm: timingInfo.bpm,
//                 offset: timingInfo.offset
//             })
//             beater.setTimingList(timingInfo.timingList || [])
//             beaterCache.set(timingInfo.id, beater)
//         }
//     } else {
//         console.log("fetch all timing failed")
//     }
// }