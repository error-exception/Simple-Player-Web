import {Disposable} from "./core/Disposable";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import {Alignment, Bound, defaultViewport, Viewport} from "./Viewport";
import {VertexArray} from "./core/VertexArray";
import {VertexBuffer} from "./core/VertexBuffer";
import {Shader} from "./core/Shader";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {degreeToRadian} from "../Utils";
import {TransformUtils} from "./core/TransformUtils";
import {Vector2} from "./core/Vector2";
import {isUndef} from "./core/Utils";
import {IndexBuffer} from "./core/IndexBuffer";
import {AudioPlayerV2} from "../AudioPlayerV2";
import {VisualizerV2} from "../VisualizerV2";
import {Time} from "../Time";
import {BeatState} from "../Beater";
import {Matrix3} from "./core/Matrix3";

export interface RoundVisualizerConfig extends BaseDrawableConfig {}

const vertexShader = `
    attribute vec2 a_vertexPosition;
    uniform mat4 u_transform;
    void main() {
        vec4 coord = vec4(a_vertexPosition.xy, 0.0, 1.0) * u_transform;
        gl_Position = coord;
    }
`

const fragmentShader = `
    uniform lowp float u_alpha;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, u_alpha);
    }
`

export class RoundVisualizer extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private readonly indexBuffer: IndexBuffer
    private vertexCount = 0

    private readonly visualizer: VisualizerV2


    constructor(
        gl: WebGL2RenderingContext,
        config: RoundVisualizerConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const indexBuffer = new IndexBuffer(gl)
        const index: number[] = [
            0, 1, 2, 1, 2, 3
        ]
        const indexArray: number[] = new Array(index.length * 200 * 5)
        for (let i = 0, j = 0; i < 200 * 5; i++, j += 6) {
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

        buffer.bind()
        shader.bind()

        const location = shader.getAttributeLocation('a_vertexPosition')
        layout.pushFloat(location, 2)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        indexBuffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer
        this.shader = shader
        this.layout = layout
        this.indexBuffer = indexBuffer

        this.visualizer = AudioPlayerV2.instance.getVisualizer()
    }

    private vertexData = new Float32Array(0)

    protected onUpdate() {
        super.onUpdate();
        this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
        this.updateVertex(this.targetSpectrum, 200)
    }

    protected onTransformApplied() {
        super.onTransformApplied();
        this.shader.bind()
        this.shader.setUniform1f("u_alpha", BeatState.isKiai ? 0.25 + BeatState.currentBeat * 0.05 : 0.25)
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.unbind()
    }

    private updateVertex(spectrum: number[], length: number = spectrum.length) {
        const centerX = this.position.x + this.size.x / 2
        const centerY = this.position.y - this.size.y / 2
        if (this.vertexData.length !== length) {
            this.vertexData = new Float32Array(length * 8 * 5)
        }
        const array = this.vertexData
        const innerRadius = 260
        const lineWidth = (
            innerRadius / 2 * Math.sin(
                degreeToRadian(360 / (length))
            )
        ) * 2
        const half = lineWidth / 2

        let k = 0;

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < length; i++) {

                const degree = i / 200 * 360 + j * 360 / 5

                const radian = degreeToRadian(degree)
                const value = innerRadius + spectrum[i] * 160
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

                this.addPoint(array, k, point1)
                this.addPoint(array, k + 2, point2)
                this.addPoint(array, k + 4, point3)
                this.addPoint(array, k + 6, point4)

                k += 8

            }
        }

        this.vertexCount = length * 6 * 5

        this.buffer.bind()
        this.buffer.setBufferData(array)
        this.buffer.unbind()
    }

    private addPoint(array: Float32Array, offset: number, point: Vector2) {
        array[offset] = this.viewport.convertX(point.x);
        array[offset + 1] = this.viewport.convertY(point.y);
    }

    private simpleSpectrum: number[] = new Array<number>(200)

    private lastTime = 0
    private updateOffsetTime = 0

    private indexOffset = 0
    private indexChange = 5

    private targetSpectrum: number[] = new Array<number>(200).fill(0)

    // TODO: 调整频谱
    private spectrumShape: number[] = [
        1.5, 2, 2.7, 2.1, 1.4,
        1.1, 1, 1, 1, 1,
        ...(new Array<number>(190).fill(1))
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
        for (let i = 0; i < 200; i++) {
            const targetIndex = (i + this.indexOffset) % 200
            const target = this.simpleSpectrum[targetIndex]
            if (target > this.targetSpectrum[i]) {
                this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale)
            }
        }
        if (timestamp - this.updateOffsetTime >= 50) {
            this.updateOffsetTime = timestamp
            this.indexOffset = (this.indexOffset - this.indexChange) % 200
        }
        const decayFactor = (timestamp - this.lastTime) * 0.0024
        for (let i = 0; i < 200; i++) {
            this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03)
            if (this.targetSpectrum[i] < 0) {
                this.targetSpectrum[i] = 0
            }
        }
        this.lastTime = timestamp
    }

    public bind() {
        this.shader.bind()
        this.vertexArray.bind()
    }

    public unbind() {
        this.shader.unbind()
        this.vertexArray.unbind()
    }

    public onDraw() {
        const gl = this.gl
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_INT, 0)
    }

    public dispose() {
        this.vertexArray.dispose()
        this.buffer.dispose()
        this.shader.dispose()
        this.indexBuffer.dispose()
    }

}