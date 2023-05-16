// TODO: complete this class
import {Music} from "./type";
import {TimePlayer} from "./TimePlayer";
import {ref} from "vue";
import {int, url} from "./Utils";
import {EventDispatcher} from "./EventBus";
import {VisualizerV2} from "./VisualizerV2";

export class AudioPlayerV2 {

    public static STATE_DOWNLOADING = 0
    public static STATE_DECODING = 1
    public static STATE_PLAYING = 2
    public static STATE_DECODE_DONE = 3
    public static STATE_PAUSING = 4

    private readonly audioContext: AudioContext
    private source: AudioBufferSourceNode | null = null
    private audioBuffer: AudioBuffer | null = null
    private isAvailable = false
    private time: TimePlayer = new TimePlayer()
    private playerState: number = -1

    public duration = ref(0)
    public isPlaying = ref(false)
    public volume = ref(1)
    public currentMusic: Music | null = null
    public onEnded: (() => void) | null = null
    public onState: ((state: number) => void) | null = null

    public static readonly instance: AudioPlayerV2 = new AudioPlayerV2()

    private constructor() {
        this.audioContext = new AudioContext()
    }

    public src(music: Music): boolean {
        if (
            this.playerState === AudioPlayerV2.STATE_DOWNLOADING
            || this.playerState === AudioPlayerV2.STATE_DECODING
            || this.currentMusic?.id === music.id
        ) {
            return false
        }
        this.currentMusic = music
        this.pause()
        this.isAvailable = false
        this.load(music.id).then(() => {
            this.isAvailable = true
            this.time.reset()
            this.duration.value = int(this.audioBuffer!!.duration * 1000)
            if (this.needToPlay) {
                this.needToPlay = false
                this.play()
            }
            EventDispatcher.fireOnSongChanged(music.id)
        })
        return true
    }

    private async load(musicId: number) {
        this.playerState = AudioPlayerV2.STATE_DOWNLOADING
        this.onState?.(AudioPlayerV2.STATE_DOWNLOADING)
        const response = await fetch(url(`/music?id=${musicId}`))
        const arrayBuffer = await response.arrayBuffer()
        this.playerState = AudioPlayerV2.STATE_DECODING
        this.onState?.(AudioPlayerV2.STATE_DECODING)
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
        this.playerState = AudioPlayerV2.STATE_DECODE_DONE
        this.onState?.(AudioPlayerV2.STATE_DECODE_DONE)
    }

    private needToPlay = false

    public play() {
        if (this.isPlaying.value) {
            return;
        }
        if (!this.isAvailable) {
            this.needToPlay = true
            return
        }
        this.isPlaying.value = true
        this.playerState = AudioPlayerV2.STATE_PLAYING
        this.onState?.(AudioPlayerV2.STATE_PLAYING)
        const source = this.audioContext.createBufferSource()
        source.buffer = this.audioBuffer
        source.playbackRate.value = this.playbackRate
        source.connect(this.audioContext.destination)
        source.onended = () => {
            this.pause()
            this.onEnded?.()
        }
        let startTime = 0
        if (this.seekTime > 0) {
            startTime = this.seekTime / 1000
            this.seekTime = -1
        } else {
            startTime = this.time.currentTime().value / 1000
        }
        source.start(0, startTime)
        this.time.play()
        this.source = source
        this.visualizer?.enable()
        this.visualizer?.setSourceNode(source)
        EventDispatcher.fireOnMusicPlay()

    }

    public pause() {
        if (!this.isPlaying.value) {
            return;
        }
        if (!this.isAvailable) {
            this.needToPlay = false
            return
        }
        this.isPlaying.value = false
        this.playerState = AudioPlayerV2.STATE_PAUSING
        this.onState?.(AudioPlayerV2.STATE_PAUSING)
        const source = this.source
        if (source != null) {
            source.onended = null
            source.stop()
            this.time.pause()
            source.disconnect()
            this.source = null
        }
        this.visualizer?.disable()
        EventDispatcher.fireOnMusicPause()
    }

    private seekTime = -1

    public seek(time: number) {
        if (!this.isAvailable) {
            this.seekTime = time
            return
        }
        let shouldReplay = this.isPlaying.value
        if (shouldReplay) {
            this.pause()
        }
        this.time.seek(time)
        if (shouldReplay) {
            this.play()
        }
        EventDispatcher.fireOnMusicSeeked(this.currentMusic!!.id, time)
    }

    private playbackRate: number = 1

    public setPlaybackRate(rate: number) {
        this.playbackRate = rate
        if (!this.isAvailable) {
            return
        }
        const source = this.source
        if (source != null) {
            source.playbackRate.value = rate
            this.time.speed(rate)
        }
    }

    public setVolume(v: number) {
        this.volume.value = v
        if (!this.isAvailable)
            return
        //TODO: add volume control
    }

    public get currentTime(): number {
        return Math.min(this.time.currentTime().value, this.duration.value)
    }

    public getAudioBuffer(): AudioBuffer {
        return this.audioBuffer!!
    }

    private visualizer: VisualizerV2 | null = null

    public getVisualizer(): VisualizerV2 {
        if (this.visualizer != null) {
            return this.visualizer
        }
        const visualizer = new VisualizerV2(this.audioContext.createAnalyser())
        if (this.isAvailable && this.source != null) {
            visualizer.setSourceNode(this.source)
        }
        this.visualizer = visualizer
        return visualizer
    }

}