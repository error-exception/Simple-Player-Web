import {Disposable} from "./core/Disposable";
import {Drawable} from "./Drawable";
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

export interface RoundVisualizerConfig extends Alignment, Bound {}

const vertexShader = `
    attribute vec2 a_vertexPosition;
    uniform mat4 u_transform;
    void main() {
        vec4 coord = vec4(a_vertexPosition.xy, 0.0, 1.0) * u_transform;
        gl_Position = coord;
    }
`

const fragmentShader = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
    }
`

export class RoundVisualizer implements Disposable, Drawable {

    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private viewport: Viewport = defaultViewport
    private vertexCount = 0

    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(
        private gl: WebGL2RenderingContext,
        private config: RoundVisualizerConfig
    ) {

        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const indexBuffer = new IndexBuffer(gl)
        // TODO: construct an index buffer
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
    }

    private transformMatrix4 = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public setTransform(transX: number, transY: number) {
        const matrix = this.transformMatrix4;
        const viewport = this.viewport;
        matrix[3] = viewport.convertX(-transX * 0.02)
        matrix[7] = viewport.convertY(-transY * 0.02)

        this.shader.bind()
        this.shader.setUniformMatrix4fv('u_transform', matrix)
        this.shader.unbind()
    }

    private vertexData = new Float32Array(0)

    // TODO: 添加返回值，表示当前音量
    public writeData(data: number[], length: number = data.length, timestamp: number) {
        this.updateSpectrum(data, timestamp)
        const centerX = this.x + this.width / 2
        const centerY = this.y - this.height / 2
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
                const value = innerRadius + data[i] * 200
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
                // this.addPoint(array, k + 6, point3, alpha)
                // this.addPoint(array, k + 9, point2, alpha)
                this.addPoint(array, k + 4, point3)
                this.addPoint(array, k + 6, point4)

                k += 8

            }
        }

        this.vertexCount = length * 6 * 5

        this.buffer.bind()
        this.buffer.setBufferData(array)
        this.buffer.unbind()
        // this.alphas.fill(0.2)
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


    private updateSpectrum(fft: number[], timestamp: number) {
        // for (let i = 0; i < 5; i++) {
        //     fft[i] *= 2.254
        // }
        if (this.lastTime === 0 || this.updateOffsetTime === 0) {
            this.lastTime = timestamp
            this.updateOffsetTime = timestamp
        }
        for (let i = 0, j = this.indexOffset; i < this.indexChange - 2; i++, j = (j + 1) % 200) {
            this.simpleSpectrum[j] = fft[i]
        }

        for (let i = 0; i < 200; i++) {
            fft[i] = fft[i + this.indexChange]
            const simpleValue = this.simpleSpectrum[i] * 3.267
            if (simpleValue > fft[i]) {
                fft[i] = simpleValue
            }
        }
        const decayFactor = (timestamp - this.lastTime) * 0.0048
        for (let i = 0; i < 200; i++) {
            this.simpleSpectrum[i] -= decayFactor * (this.simpleSpectrum[i] + 0.03)
            if (this.simpleSpectrum[i] < 0) {
                this.simpleSpectrum[i] = 0
            }
        }
        this.lastTime = timestamp
        if (timestamp - this.updateOffsetTime >= 50) {
            this.indexOffset = (this.indexOffset + this.indexChange) % 200
            this.updateOffsetTime = timestamp
        }
    }

    public setViewport(viewport: Viewport) {
        this.viewport = viewport
        const config = this.config
        if (
            isUndef(config.y) && isUndef(config.vertical)
            || isUndef(config.x) && isUndef(config.horizontal)
        ) {
            throw new Error('config error')
        }
        if (this.config.x) {
            this.x = viewport.convertUnitX(this.config.x)
        }
        if (this.config.y) {
            this.y = viewport.convertUnitY(this.config.y)
        }
        this.width = viewport.convertUnitX(this.config.width)
        this.height = viewport.convertUnitY(this.config.height)
        if (this.config.horizontal) {
            this.x = viewport.alignmentX(this.config.horizontal, this.width)
        }
        if (this.config.vertical) {
            this.y = viewport.alignmentY(this.config.vertical, this.height)
        }
        console.log('RoundVisualizer', `x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`)
    }

    public bind() {
        this.shader.bind()
        this.vertexArray.bind()
    }

    public unbind() {
        this.shader.unbind()
        this.vertexArray.unbind()
    }

    public draw() {
        const gl = this.gl
        // this.shader.setUniform4fv('u_color', [1.0, 1.0, 1.0, 0.2])
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_INT, 0)

    }

    public dispose() {
        this.vertexArray.dispose()
        this.buffer.dispose()
        this.shader.dispose()
    }

}