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
    backgroundMovable: boolean
}

export interface VisualizerConfig {
    maxDB: number
    minDB: number
}

export interface IEvent {

    onMusicPlay?(): void

    onMusicPause?(): void

    onSongChanged?(id: number): void

    onBpmChanged?(id: number): void

    onMusicSeeked?(id: number, seekedTime: number): void

}

export interface ResponseResult<T = any> {
    code: number
    data: T | null | undefined
    message: string
}