import {AudioPlayer} from "./AudioPlayer";
import {Store} from "vuex";
import {StoreType} from "../main";

export class Visualizer {

    private _isEnabled = false

    public audioContext: AudioContext | undefined

    public mediaElementSource: MediaElementAudioSourceNode | undefined

    private analyser: AnalyserNode | undefined

    private audioDataBuffer: Uint8Array | undefined

    public static instance: Visualizer

    public static newInstance(audio: HTMLAudioElement) {
        Visualizer.instance = new Visualizer(audio)
    }

    constructor(private audio: HTMLAudioElement) {
    }

    public enable() {
        if (this._isEnabled) {
            return;
        }
        if (!this.audioContext) {
            this.audioContext = new AudioContext()
        }
        if (!this.analyser) {
            this.analyser = this.audioContext.createAnalyser()
        }
        if (!this.mediaElementSource) {
            this.mediaElementSource = this.audioContext.createMediaElementSource(this.audio)
        }
        this.mediaElementSource.connect(this.audioContext.destination)
        this.mediaElementSource.connect(this.analyser)

        this.analyser.smoothingTimeConstant = .4
        this.analyser.minDecibels = -55
        this.analyser.maxDecibels = 0
        this.analyser.fftSize = 2048

        const bufferLength = this.analyser.frequencyBinCount
        this.audioDataBuffer = new Uint8Array(bufferLength)
        this._isEnabled = true
    }

    public disable() {
        if (!this._isEnabled) {
            return
        }
        if (this.mediaElementSource) {
        }
        if (this.analyser) {
            this.mediaElementSource?.disconnect(this.analyser)
            this.analyser.disconnect()
        }
        // if (this.audioContext) {
        //     this.mediaElementSource?.disconnect(this.audioContext.destination)
        // }

        this._isEnabled = false

    }

    public getFFT(): Uint8Array | undefined {
        if (!this.isEnabled() || !this.audioDataBuffer) {
            return undefined
        }
        this.analyser?.getByteFrequencyData(this.audioDataBuffer)
        return this.audioDataBuffer
    }

    public getWave(data: Uint8Array) {
        if (!this._isEnabled) {
            return
        }
        if (this.analyser) {
            this.analyser.getByteTimeDomainData(data)
        }
    }

    public isEnabled(): boolean {
        return this._isEnabled
    }

    public setSmooth(value: number) {
        if (this.analyser) {
            this.analyser.smoothingTimeConstant = value
        }
    }

    public setMaxDecibels(value: number) {
        if (this.analyser) {
            this.analyser.maxDecibels = value
        }
    }

    public setMinDecibels(value: number) {
        if (this.analyser) {
            this.analyser.minDecibels = value
        }
    }

}

export function launchVisualizer(store: Store<StoreType>) {
    if (!store.state.visualizer) {
        return
    }
    if (!Visualizer.instance) {
        Visualizer.newInstance(AudioPlayer.instance.audio)
    }
    if (!Visualizer.instance.isEnabled()) {
        Visualizer.instance.enable()
    }
}

export function destroyVisualizer(store: Store<StoreType>) {
    if (Visualizer.instance && Visualizer.instance.isEnabled()) {
        Visualizer.instance.disable()
    }
}