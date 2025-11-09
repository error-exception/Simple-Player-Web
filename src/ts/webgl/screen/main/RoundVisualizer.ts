import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {degreeToRadian} from "../../../Utils";
import {Vector, Vector2} from "../../graphic/core/Vector2";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {VisualizerV2} from "../../../VisualizerV2";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {Blend} from "../../drawable/Blend";
import type {DrawNode} from "../../drawable/DrawNode";
import {Matrix3} from "../../graphic/core/Matrix3";
import {TransformUtils2} from "../../graphic/core/TransformUtils2";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {Color} from "../../base/Color";
import type {DefaultShaderWrapper} from "../../graphic/shader/DefaultShaderWrapper";
import {QuadBuffer} from "../../graphic/buffer/QuadBuffer";
import {Vector2Utils} from "../../graphic/core/Vector2Utils";
import {Quad} from "../../graphic/shape/Quad";
import {QuadUtils} from "../../graphic/shape/QuadUtils";
import {Coordinate2} from "../../base/Coordinate2";

export interface RoundVisualizerConfig extends BaseDrawableConfig {
    innerRadius?: number
}

export class RoundVisualizer extends Drawable<RoundVisualizerConfig> {

    private readonly barCountPerRound = 220
    private readonly maxSpectrumHeight: number = 160
    private readonly scaleFactor = 160 / (450 / 2 * 0.9)
    private readonly visualizer: VisualizerV2

    private readonly innerRadius: number = 236
    constructor(
        config: RoundVisualizerConfig
    ) {
        super(config)
        if (config.innerRadius) {
            this.innerRadius = config.innerRadius
        }
        this.visualizer = AudioPlayerV2.getVisualizer()
        this.maxSpectrumHeight = this.innerRadius * this.scaleFactor
        this.setColor(Color.White)
    }

    private centerOfDrawable = Vector()
    public onLoad(renderer: WebGLRenderer) {
        const node = this.drawNode
        node.vertexBuffer = new QuadBuffer(renderer, this.barCountPerRound * 5, renderer.gl.STREAM_DRAW)
        node.blend = Blend.Additive
        node.apply()
        this.setScaleX(-1)
    }

    public onUpdate() {
        super.onUpdate();
        this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
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

    public beforeCommit(node: DrawNode) {

        const shader = node.shader as DefaultShaderWrapper
        shader.orth = Coordinate2.orthographicProjectionMatrix4
        shader.color = this.computeColor(BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.08 : 0.14)
        shader.sampler2D = 0
    }

    public onDraw(node: DrawNode) {
        Vector2Utils.middleTo(Vector2.zero, this.size, this.centerOfDrawable)

        const centerX = 0, centerY = 0
        const spectrum = this.targetSpectrum
        const length = this.barCountPerRound
        const innerRadius = this.innerRadius
        const lineWidth = (
          innerRadius / 2 * Math.sin(
            degreeToRadian(360 / (length))
          )
        ) * 2
        const half = lineWidth / 2

        let k = 0;

        const texture = TextureStore.getTexture('Square')
        const maxSpectrumHeight = this.maxSpectrumHeight;
        const quad = new Quad()
        const matrix3 = Matrix3.newIdentify()

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < length; i++) {

                const degree = i / length * 360 + j * 360 / 5

                const value = innerRadius + spectrum[i] * (maxSpectrumHeight)
                const fromX = centerX
                const fromY = centerY + innerRadius
                const toX = centerX
                const toY = centerY + value

                quad.topLeft.set(fromX - half, fromY)
                quad.topRight.set(fromX + half, fromY)
                quad.bottomLeft.set(toX - half, toY)
                quad.bottomRight.set(toX + half, toY)

                matrix3.setFrom(Matrix3.identify)
                TransformUtils2.rotateFromLeft(matrix3, degree)
                TransformUtils2.translateFromLeft(matrix3, this.centerOfDrawable)

                QuadUtils.applySelf(quad, matrix3)

                QuadUtils.applySelf(quad, this.drawNode.matrix)

                // k += 8
                node.drawQuad(quad, undefined, k)
                node.drawTexture(texture, undefined, undefined, k)
                k++
            }
        }
    }

}
