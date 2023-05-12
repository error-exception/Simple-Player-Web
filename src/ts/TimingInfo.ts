import {Beater} from "./Beater";
import {TimingItem} from "./TimingItem";
import axios, {AxiosResponse} from "axios";
import {ResponseResult} from "./type";

export interface TimingInfo {
    version: string
    bpm: number
    offset: number
    id: number
    timingList: TimingItem[]
}

export const defaultBeater = new Beater({
    bpm: 60,
    offset: 0,
    available: false
})

const beaterCache = new Map<number, Beater>()

export async function getBeater(id: number): Promise<Beater> {
    const cache = beaterCache.get(id)
    if (cache) {
        return cache
    }
    const timingInfo = await fetchTimingInfo(id)
    if (timingInfo === null) {
        return defaultBeater
    }
    const beater = new Beater({
        bpm: timingInfo.bpm,
        offset: timingInfo.offset
    })
    beater.setTimingList(timingInfo.timingList || [])
    beaterCache.set(id, beater)
    return beater
}

async function fetchTimingInfo(id: number): Promise<TimingInfo | null> {
    const response = await fetch(`/api/timing?id=${id}`)
    const result = await response.json()
    console.log(result)
    if (result.code != 0) {
        return null
    }
    return result.data
}

export async function uploadTimingInfo(timingInfo: TimingInfo) {
    const response: AxiosResponse<ResponseResult> = await axios.post("/api/uploadTiming", timingInfo);
    console.log(response.data)
    if (!response.data || response.data.code != 0) {
        console.error("request error", response.data.code, response.data.message)
    } else {
        console.log("upload timing info success! id=", timingInfo.id)
    }
}

export function addTimingInfoToCache(timingInfo: TimingInfo): Beater {
    const beater = new Beater({
        bpm: timingInfo.bpm,
        offset: timingInfo.offset
    })
    beater.setTimingList(timingInfo.timingList || [])
    beaterCache.set(timingInfo.id, beater)
    return beater
}