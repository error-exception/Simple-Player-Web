export interface Music {
    title: string,
    artist: string,
    id: number,
    bpm: number,
    offset: number
}

export interface MusicInfo {
    currentMusic: Music
    currentIndex: number
}

export interface Settings {
    backgroundMovable: boolean,
    showWhiteBar: boolean
}

export interface VisualizerConfig {
    maxHeight: number
    paddingBottom: number
    mirror: boolean
    smooth: number
    maxDB: number
    minDB: number
    color: [number, number, number]
    startOffset: number
    endOffset: number
    barCount: number
    alpha: number
    alphaByVolume: boolean
}

export interface IEvent {

    onMusicPlay?(): void

    onMusicPause?(): void

    onSongChanged?(id: number): void

    onBpmChanged?(id: number): void

    onMusicSeeked?(id: number, seekedTime: number): void

}

export interface ResponseResult {
    code: number
    data: any | null | undefined
    message: string
}