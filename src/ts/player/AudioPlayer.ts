// TODO: complete this class
import {TimePlayer} from "../TimePlayer";
import {ref} from "vue";
import {int} from "../Utils";
import {VisualizerV2} from "../VisualizerV2";
import {createMutableSharedFlow, createMutableStateFlow} from "../util/flow";
import {PlayerState} from "./PlayerState";
import {AbstractPlayer, MediaDataSource} from "./AbstractPlayer";


class AudioPlayer extends AbstractPlayer {

    private readonly audioContext: AudioContext
    private source: AudioBufferSourceNode | null = null
    private audioBuffer: AudioBuffer | null = null
    private isAvailable = false
    private time: TimePlayer = new TimePlayer()

    private _duration = 0
    // public isPlaying = ref(false)

    public volume = ref(1)
    // public currentMusic: Music | null = null
    public onEnd = createMutableSharedFlow<boolean>()
    // public onChange = createMutableSharedFlow<number>()
    public onSeeked = createMutableSharedFlow<boolean>()
    public playStateFlow = createMutableStateFlow(-1)
    // public onReadyToPlay = createMutableSharedFlow<boolean/* from buffer */>()

    constructor() {
        super()
        this.audioContext = new AudioContext()
    }

    // public src(music: Music): boolean {
    //     if (
    //         this.playStateFlow.value === PlayerState.STATE_DOWNLOADING ||
    //         this.playStateFlow.value === PlayerState.STATE_DECODING ||
    //         this.currentMusic?.id === music.id
    //     ) {
    //         return false;
    //     }
    //     this.currentMusic = music
    //     this.pause()
    //     this.isAvailable = false
    //     this.load(music.id).then(() => {
    //         this.isAvailable = true
    //         this.time.reset()
    //         this.duration.value = int(this.audioBuffer!!.duration * 1000)
    //         if (this.needToPlay) {
    //             this.needToPlay = false
    //             this.play()
    //         }
    //         // EventDispatcher.fireOnSongChanged(music.id)
    //         this.onChange.emit(music.id)
    //         this.onReadyToPlay.emit(false)
    //     })
    //     return true
    // }

    private _busyState = [PlayerState.STATE_DECODING]
    public async setSource(src: MediaDataSource): Promise<void> {
        if (this.isBusy()) {
            return;
        }
        this.pause()
        this.isAvailable = false
        if (!(src instanceof ArrayBuffer)) {
            return;
        }
        await this.decode(src)
        this.isAvailable = true
        this.time.reset()
        this._duration = int(this.audioBuffer!.duration * 1000)
        // if (this.needToPlay) {
        //     this.needToPlay = false
        //     this.play()
        // }
        // this.onReadyToPlay.emit(false)
    }

    // private async downloadMusic(src: string): Promise<ArrayBuffer> {
    //     this.playStateFlow.value = PlayerState.STATE_DOWNLOADING;
    //     const response = await fetch(url(src))
    //     return await response.arrayBuffer()
    // }

    private isBusy() {
        return this._busyState.includes(this.playStateFlow.value)
    }

    // public arrayBufferSrc(buffer: ArrayBuffer, ready?: () => void) {
    //     // debugger
    //     if (
    //         this.playStateFlow.value === PlayerState.STATE_DOWNLOADING ||
    //         this.playStateFlow.value === PlayerState.STATE_DECODING
    //     ) {
    //         return false;
    //     }
    //     // this.currentMusic = music
    //     this.pause()
    //     this.isAvailable = false
    //
    //     this.decode(buffer).then(() => {
    //         this.isAvailable = true
    //         this.time.reset()
    //         this.duration.value = int(this.audioBuffer!!.duration * 1000)
    //         if (this.needToPlay) {
    //             this.needToPlay = false
    //             this.play()
    //         }
    //         ready?.()
    //         // EventDispatcher.fireOnSongChanged(-1)
    //         this.onChange.emit(-1)
    //         this.onReadyToPlay.emit(true);
    //     })
    //     return true
    // }

    // private async load(musicId: number) {
    //
    //     this.playStateFlow.value = PlayerState.STATE_DOWNLOADING;
    //
    //     const response = await fetch(url(`/music?id=${musicId}`))
    //     const arrayBuffer = await response.arrayBuffer()
    //     await this.decode(arrayBuffer)
    // }

    private async decode(arrayBuffer: ArrayBuffer) {

        this.playStateFlow.value = PlayerState.STATE_DECODING;

        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

        this.playStateFlow.value = PlayerState.STATE_DECODE_DONE;

    }

    private needToPlay = false

    public async play() {
        if (this.isPlaying()) {
            return;
        }
        if (this.isBusy()) {
            this.needToPlay = true
            return
        }
        // this.isPlaying.value = true
        this.playStateFlow.value = PlayerState.STATE_PLAYING;
        // this.playerState = AudioPlayerV2.STATE_PLAYING
        // this.onState?.(AudioPlayerV2.STATE_PLAYING)
        const source = this.audioContext.createBufferSource()
        source.buffer = this.audioBuffer
        source.playbackRate.value = this.playbackRate
        source.connect(this.audioContext.destination)
        source.onended = () => {
            this.pause()
            this.onEnd.emit(false)
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
    }

    public pause() {
        if (this.playStateFlow.value === PlayerState.STATE_PAUSING) {
            return;
        }
        if (this.isBusy()) {
            this.needToPlay = false
            return
        }
        // this.isPlaying.value = false
        this.playStateFlow.value = PlayerState.STATE_PAUSING

        const source = this.source
        if (source != null) {
            source.onended = null
            source.stop()
            this.time.pause()
            source.disconnect()
            this.source = null
        }
        this.visualizer?.disable()
    }

    private seekTime = -1

    public async seek(time: number) {
        if (this.isBusy()) {
            this.seekTime = time
            return
        }
        let shouldReplay = this.isPlaying()
        if (shouldReplay) {
            this.pause()
        }
        this.time.seek(time)
        if (shouldReplay) {
            await this.play()
        }
        this.onSeeked.emit(true)
    }

    private playbackRate: number = 1

    public speed(rate: number) {
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

    public currentTime(): number {
        return Math.min(this.time.currentTime().value, this.duration())
    }

    public duration(): number {
        return this._duration
    }

    public isPlaying(): boolean {
        return this.playStateFlow.value === PlayerState.STATE_PLAYING;
    }

    public stop() {
        this.seek(0)
        this.pause()
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

export default new AudioPlayer()