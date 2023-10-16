import {AbstractPlayer, MediaDataSource} from "./AbstractPlayer";
import {int, isString} from "../Utils";

class VideoPlayer extends AbstractPlayer {

    private readonly video = document.createElement('video')
    private isAvailable = false

    constructor() {
        super();
        this.video.muted = true
    }

    public currentTime(): number {
        return this.isAvailable ? int(this.video.currentTime * 1000) : 0
    }

    public duration(): number {
        return this.isAvailable ? int(this.video.duration * 1000) : 0
    }

    public pause(): void {
        this.video.pause()
    }

    public async play(): Promise<void> {
        await this.video.play()
    }

    public isPlaying(): boolean {
        return !this.video.paused
    }

    public seek(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            this.video.onseeked = () => {
                resolve()
            }
            this.video.currentTime = milliseconds / 1000
        })

    }

    public async setSource(src: MediaDataSource) {
        this.isAvailable = false
        const video = this.video
        if (isString(src)) {
            video.src = src
        } else if (src instanceof Blob) {
            video.src = URL.createObjectURL(src)
        } else {
            return
        }
        video.load()
        await this.play()
        this.pause()
        this.isAvailable = true
    }

    public setVolume(_: number): void {
        // Do nothing
    }

    public speed(rate: number): void {
        this.video.playbackRate = rate
    }

    public stop() {
        this.video.pause()
        this.seek(0)
    }

    public getVideoElement() {
        return this.video
    }

}

export default new VideoPlayer()