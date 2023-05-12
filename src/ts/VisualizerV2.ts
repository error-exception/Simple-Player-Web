export class VisualizerV2 {

    private source: AudioBufferSourceNode | null = null
    private readonly fftBuffer: Uint8Array = new Uint8Array(0)
    private readonly emptyBuffer: Uint8Array = new Uint8Array(0)
    private isAvailable: boolean = false

    constructor(private analyse: AnalyserNode) {
        analyse.smoothingTimeConstant = .3
        analyse.minDecibels = -60
        analyse.maxDecibels = 0
        analyse.fftSize = 1024

        const bufferLength = analyse.frequencyBinCount
        this.fftBuffer = new Uint8Array(bufferLength)
        this.emptyBuffer = new Uint8Array(bufferLength)
    }

    public disable() {
        this.isAvailable = false
        this.source = null
    }

    public enable() {
        this.isAvailable = true
    }

    public setSourceNode(node: AudioBufferSourceNode) {
        node.connect(this.analyse)
        this.source = node
    }

    public getFFT(): Uint8Array {
        if (this.isAvailable) {
            this.analyse.getByteFrequencyData(this.fftBuffer)
            return this.fftBuffer
        }
        return this.emptyBuffer
    }

}