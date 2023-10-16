import { OSUStdNote } from "./osu/OSUFile"
import { NoteData } from "./webgl/screen/mania/ManiaPanel"

/**
 * 音乐标题
 * 音乐艺术家
 * Timing
 * 背景图片
 * 封面
 * 背景视频
 * StoryBoard
 * PreviewTime
 */
export interface Music {
    title: string
    artist: string
    id: number
}

export interface Video {
    backgroundVideo?: Blob
}

export interface TimingInfo {
    version: string
    bpm: number
    offset: number
    id: number
    timingList: TimingItem[]
}

export interface TimingItem {
    isKiai: boolean
    timestamp: number
}

export interface Bullet {
    general: BulletGeneral
    metadata: BulletMetadata
    timingPoints: BulletTimingPoints
    events: BulletEvents
    noteData?: NoteData[][]
    stdNotes?: OSUStdNote[]
    available: boolean
}

export interface BulletMetadata {
    title: string
    artist: string
    id: number
    source: ArrayBuffer
}

export interface BulletGeneral {
    previewTime: number
    from: 'default' | 'osu'
}

export interface BulletTimingPoints {
    offset: number
    beatGap: number
    timingList: BulletTimingPointsItem[]
}

export interface BulletTimingPointsItem {
    isKiai: boolean
    offset: number
}

export interface BulletEvents {
    backgroundImage?: Blob
    backgroundVideo?: Blob
}

export function newBullet(): Bullet {
    return {
        general: {
            previewTime: 0,
            from: "default"
        },
        metadata: {
            title: "None",
            artist: "None",
            source: new ArrayBuffer(0),
            id: -1
        },
        timingPoints: {
            beatGap: 1000,
            offset: 0,
            timingList: []
        },
        events: {},
        available: false
    }
}

export interface ResponseResult<T = any> {
    code: number
    data: T | null | undefined
    message: string
}

export type Nullable<T> = T | null