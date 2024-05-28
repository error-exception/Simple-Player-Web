import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {VertexBuffer} from "../../core/VertexBuffer";
import {degreeToRadian} from "../../../Utils";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector2} from "../../core/Vector2";
import {IndexBuffer} from "../../core/IndexBuffer";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {VisualizerV2} from "../../../VisualizerV2";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import Coordinate from "../../base/Coordinate";
import type {WhiteShaderWrapper} from "../../shader/WhiteShaderWrapper";
import {Shaders} from "../../shader/Shaders";

export interface RoundVisualizerConfig extends BaseDrawableConfig {
    innerRadius?: number
}

export class RoundVisualizer extends Drawable<RoundVisualizerConfig> {

    private readonly buffer: VertexBuffer
    private readonly shader: WhiteShaderWrapper
    private readonly indexBuffer: IndexBuffer
    private vertexCount = 0
    private readonly barCountPerRound = 256

    private readonly visualizer: VisualizerV2

    private innerRadius = 236
    constructor(
        gl: WebGL2RenderingContext,
        config: RoundVisualizerConfig
    ) {
        super(gl, config)
        if (config.innerRadius) {
            this.innerRadius = config.innerRadius
        }
        const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const indexBuffer = new IndexBuffer(gl)
        const index: number[] = [
            0, 1, 2, 1, 2, 3
        ]
        const c = this.barCountPerRound
        const indexArray: number[] = new Array(index.length * c * 5)
        for (let i = 0, j = 0; i < c * 5; i++, j += 6) {
            const increment = i << 2
            indexArray[j] = index[0] + increment
            indexArray[j + 1] = index[1] + increment
            indexArray[j + 2] = index[2] + increment
            indexArray[j + 3] = index[3] + increment
            indexArray[j + 4] = index[4] + increment
            indexArray[j + 5] = index[5] + increment
        }
        indexBuffer.bind()
        indexBuffer.setIndexBuffer(new Uint32Array(indexArray))
        indexBuffer.unbind()
        this.buffer = buffer
        this.shader = Shaders.White
        this.indexBuffer = indexBuffer

        this.visualizer = AudioPlayerV2.getVisualizer()
    }

    private vertexData = new Float32Array(0)

    protected onUpdate() {
        super.onUpdate();
        this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
        this.updateVertex(this.targetSpectrum, this.barCountPerRound)
    }

    private updateVertex(spectrum: number[], length: number = spectrum.length) {
        // const centerX = this.boundary.getAbsoluteLeft() + this.boundary.rect.getWidth() / 2 - Coordinate.width / 2
        //const centerX = this.rawPosition.x + this.rawSize.x / 2
        // const centerY = this.boundary.getAbsoluteTop() + this.boundary.rect.getHeight() / 2 - Coordinate.height / 2
        // const centerY = this.rawPosition.y - this.rawSize.y / 2
        const centerX = 0, centerY = 0
        if (this.vertexData.length !== length) {
            this.vertexData = new Float32Array(length * 8 * 5)
        }
        const array = this.vertexData
        const innerRadius = this.innerRadius
        const lineWidth = (
            innerRadius / 2 * Math.sin(
                degreeToRadian(360 / (length))
            )
        ) * 2
        const half = lineWidth / 2

        let k = 0;

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < length; i++) {

                const degree = i / length * 360 + j * 360 / 5

                const radian = degreeToRadian(degree)
                const value = innerRadius + spectrum[i] * (160)
                const fromX = centerX
                const fromY = centerY + innerRadius
                const toX = centerX
                const toY = centerY + value

                let point1 = new Vector2(fromX - half, fromY)
                let point2 = new Vector2(fromX + half, fromY)
                let point3 = new Vector2(toX - half, toY)
                let point4 = new Vector2(toX + half, toY)

                const matrix3 = TransformUtils.rotate(radian)

                point1 = TransformUtils.apply(point1, matrix3)
                point2 = TransformUtils.apply(point2, matrix3)
                point3 = TransformUtils.apply(point3, matrix3)
                point4 = TransformUtils.apply(point4, matrix3)

                this.updateAt(array, k, point1)
                this.updateAt(array, k + 2, point2)
                this.updateAt(array, k + 4, point3)
                this.updateAt(array, k + 6, point4)

                k += 8

            }
        }

        this.vertexCount = length * 6 * 5

        this.buffer.bind()
        this.buffer.setBufferData(array)
        this.buffer.unbind()
    }

    private updateAt(array: Float32Array, offset: number, point: Vector2) {
        // array[offset] = this.viewport.convertX(point.x);
        // array[offset + 1] = this.viewport.convertY(point.y);
        array[offset] = point.x// * 1 / (Coordinate.width / 2)
        array[offset + 1] = point.y// * 1 / (Coordinate.height / 2)
    }

    private simpleSpectrum: number[] = new Array<number>(this.barCountPerRound)

    private lastTime = 0
    private updateOffsetTime = 0

    private indexOffset = 0
    private indexChange = ~~Math.round(this.barCountPerRound / 40)

    private targetSpectrum: number[] = new Array<number>(this.barCountPerRound).fill(0)

    // TODO: 调整频谱
    private spectrumShape: number[] = [
        1.5, 2, 2.7, 2.1, 1.4,
        1.1, 1, 1, 1, 1,
        ...(new Array<number>(this.barCountPerRound - 10).fill(1))
    ]

    private getSpectrum(timestamp: number, barScale: number) {
        if (this.lastTime === 0 || this.updateOffsetTime === 0) {
            this.lastTime = timestamp
            this.updateOffsetTime = timestamp
        }
        const fftData = this.visualizer.getFFT()
        for (let i = 0; i < fftData.length; i++) {
            this.simpleSpectrum[i] = fftData[i] / 255.0
        }
        const c = this.barCountPerRound
        for (let i = 0; i < c; i++) {
            const targetIndex = (i + this.indexOffset) % c
            const target = this.simpleSpectrum[targetIndex]
            if (target > this.targetSpectrum[i]) {
                this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale)
            }
        }
        if (timestamp - this.updateOffsetTime >= 50) {
            this.updateOffsetTime = timestamp
            this.indexOffset = (this.indexOffset - this.indexChange) % c
        }
        const decayFactor = (timestamp - this.lastTime) * 0.0024
        for (let i = 0; i < c; i++) {
            this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03)
            if (this.targetSpectrum[i] < 0) {
                this.targetSpectrum[i] = 0
            }
        }
        this.lastTime = timestamp
    }

    public bind() {
        this.shader.bind()
        this.indexBuffer.bind()
        this.buffer.bind()
    }

    public unbind() {
        this.shader.unbind()
        this.indexBuffer.unbind()
        this.buffer.unbind()
    }

    public onDraw() {
        const gl = this.gl
        this.shader.alpha = BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14
        this.shader.transform = this.matrixArray
        this.shader.orth = Coordinate.orthographicProjectionMatrix4
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
        this.shader.use()
        gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_INT, 0)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    public dispose() {
        this.buffer.dispose()
        this.indexBuffer.dispose()
    }

}
