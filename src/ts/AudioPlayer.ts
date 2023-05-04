import {Ref, ref} from "vue";
import {currentMilliseconds} from "./Utils";
import {EventDispatcher} from "./EventBus";
import {Music} from "./type";

export class AudioPlayer {

    // private isNew: boolean = true

    // private startTime: number = 0

    // private lastTime: number = 0

    public audio: HTMLAudioElement

    // private _currentTime: number = 0

    private playbackRate = 1

    /**
     * 单位：秒
     */
    public duration = ref(0)

    public isPlaying = ref(false)

    public volume = ref(1)

    public currentMusic: Music | null = null

    public static readonly instance: AudioPlayer = new AudioPlayer()

    private constructor() {
        this.audio = document.createElement('audio')
        this.audio.addEventListener('loadeddata', () => {
            this.duration.value = this.audio.duration * 1000
        })
        this.audio.addEventListener("volumechange", () => {
            this.volume.value = this.audio.volume
        })
    }

    /**
     * 单位：毫秒
     */
    public get currentTime(): number {
        // if (this.isPlaying.value) {
        //     this._currentTime = this.lastTime + (currentMilliseconds() - this.startTime)
        // } else {
        //     this._currentTime = this.lastTime
        // }
        // return this._currentTime
        return this.audio.currentTime * 1000
    }

    public src(music: Music) {
        this.audio.src = `/api/music?id=${music.id}`
        this.currentMusic = music
        EventDispatcher.fireOnSongChanged(music.id)
        // this.isNew = true
        // this.lastTime = 0
    }

    public play() {
        this.audio.play()
        // this.startTime = currentMilliseconds()
        // if (this.isNew) {
        //     this._currentTime = 0
        // }
        this.isPlaying.value = true
        EventDispatcher.fireOnMusicPlay()
    }

    public pause() {
        // this.lastTime = this.currentTime
        this.isPlaying.value = false
        this.audio.pause()
        EventDispatcher.fireOnMusicPause()
    }

    public seek(time: number) {
        // this.startTime = currentMilliseconds()
        // this.lastTime = time * 1000
        this.audio.currentTime = time / 1000
        EventDispatcher.fireOnMusicSeeked(this.currentMusic!!.id, time)
    }

    public setVolume(v: number) {
        if (v < 0) {
            v = 0
        }
        if (v > 1) {
            v = 1
        }
        this.audio.volume = v
    }

    public setPlaybackRate(rate: number) {
        this.playbackRate = rate
        this.audio.playbackRate = rate
    }

    private onEndedListener: (() => void) | undefined

    public onEnded(c: () => void) {
        this.onEndedListener = c
        this.audio.addEventListener("ended", this.onEndedListener)
    }

    public removeOnEnded() {
        if (this.onEndedListener) {
            this.audio.removeEventListener('ended', this.onEndedListener)
        }
    }

    public onTimeupdate(c: () => void) {
        this.audio.addEventListener("timeupdate", () => {
            c()
        })
    }

}