import {AbstractPlayer, MediaDataSource} from "./AbstractPlayer";
import {currentMilliseconds, int, isString} from "../Utils";
import type {Nullable} from "../type";

class VideoPlayer extends AbstractPlayer {

  private readonly video = document.createElement('video')
  private isAvailable = false
  public baseOffset = 0
  private isStop = false

  constructor() {
    super();
    // this.video.muted = true
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
    if (this.isStop) {
      await this.seek(0)
      this.isStop = false
    }
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
      const targetCurrentTime = milliseconds - this.baseOffset
      if (targetCurrentTime >= 0) {
        this.video.currentTime = targetCurrentTime / 1000
      } else {
        const tick = currentMilliseconds()
        setTimeout(() => {
          const gap = currentMilliseconds() - tick
          console.log("VideoPlayer gap", gap)
          if (gap > -targetCurrentTime) {
            this.video.currentTime = (gap + targetCurrentTime) / 1000
          } else {
            // 可能不会执行到这里
            this.video.currentTime = 0
          }
        }, -targetCurrentTime)
      }
    })

  }

  private previousObjectUrl: Nullable<string> = null
  public async setSource(src: MediaDataSource) {
    this.isAvailable = false
    const video = this.video
    if (isString(src)) {
      video.src = src
    } else if (src instanceof Blob) {
      video.src = ''
      if (this.previousObjectUrl) {
        URL.revokeObjectURL(this.previousObjectUrl)
      }
      this.previousObjectUrl = URL.createObjectURL(src)
      video.src = this.previousObjectUrl
      // this.previousObjectUrl = URL.createObjectURL(src)
      // video.src = this.previousObjectUrl
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
    this.isStop = true
    this.video.pause()
  }

  public getVideoElement() {
    return this.video
  }

}

export default new VideoPlayer()