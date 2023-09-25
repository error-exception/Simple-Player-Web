export type MediaDataSource = string | Blob | ArrayBuffer

export abstract class AbstractPlayer {

    public abstract play(): Promise<void>

    public abstract pause(): void

    public abstract setSource(src: MediaDataSource): Promise<void>

    public abstract seek(time: number): Promise<void>

    public abstract duration(): number

    public abstract currentTime(): number

    public abstract speed(rate: number): void

    public abstract setVolume(v: number): void

    public abstract stop(): void

    public abstract isPlaying(): boolean

}