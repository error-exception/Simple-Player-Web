import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {degreeToRadian} from "../../../Utils";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector, Vector2} from "../../core/Vector2";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {VisualizerV2} from "../../../VisualizerV2";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import Coordinate from "../../base/Coordinate";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {Blend} from "../../drawable/Blend";
import type {DrawNode} from "../../drawable/DrawNode";
import {Matrix3} from "../../core/Matrix3";
import {TransformUtils2} from "../../core/TransformUtils2";
import {TextureStore} from "../../texture/TextureStore";
import {Color} from "../../base/Color";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {QuadBuffer} from "../../buffer/QuadBuffer";
import {Vector2Utils} from "../../core/Vector2Utils";

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
        this.centerOfDrawable = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight)
        this.setScaleX(-1)
    }

    public onInvalidate() {
        this.centerOfDrawable = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight)
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
        shader.orth = Coordinate.orthographicProjectionMatrix4
        shader.color = this.computeColor(BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14)
        shader.sampler2D = 0
    }

    public onDraw(node: DrawNode) {
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

        const texture = TextureStore.get('Square')
        const maxSpectrumHeight = this.maxSpectrumHeight;

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < length; i++) {

                const degree = i / length * 360 + j * 360 / 5

                const value = innerRadius + spectrum[i] * (maxSpectrumHeight)
                const fromX = centerX
                const fromY = centerY + innerRadius
                const toX = centerX
                const toY = centerY + value

                const point1 = new Vector2(fromX - half, fromY)
                const point2 = new Vector2(fromX + half, fromY)
                const point3 = new Vector2(toX - half, toY)
                const point4 = new Vector2(toX + half, toY)

                const matrix3 = Matrix3.newIdentify()
                TransformUtils2.rotateFromLeft(matrix3, degree)
                TransformUtils2.translateFromLeft(matrix3, this.centerOfDrawable)

                TransformUtils.applySelf(point1, matrix3)
                TransformUtils.applySelf(point2, matrix3)
                TransformUtils.applySelf(point3, matrix3)
                TransformUtils.applySelf(point4, matrix3)

                // k += 8
                node.drawQuad(point1, point2, point3, point4, undefined, k)
                node.drawTexture(texture, undefined, undefined, k)
                k++
            }
        }
    }

}
