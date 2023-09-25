import { OSUStdNoteCircle } from "../../OSUFile";
import { clamp } from "../../Utils";
import AudioPlayer from "../../player/AudioPlayer";
import { Color } from "../Color";
import Coordinate from "../Coordinate";
import { Interpolation } from "../Interpolation";
import { Shape2D } from "../Shape2D";
import { Vector2 } from "../core/Vector2";
import noteEffect from "../../../assets/soft-hitwhistle.wav"
import { BaseDrawableConfig, Drawable } from '../Drawable';
import { Shader } from '../core/Shader';
import { VertexArray } from "../core/VertexArray";
import { VertexBuffer } from "../core/VertexBuffer";
import { Texture } from "../core/Texture";
import { VertexBufferLayout } from '../core/VertexBufferLayout';
const key = new Audio(noteEffect)
key.load()

const vertexShader = `
    attribute vec2 a_position;
    attribute vec2 a_tex_coord;
    varying vec4 v_tex_coord;
    uniform mat4 u_orth;
    uniform mat4 u_transform;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_transform * u_orth;
        v_tex_coord = a_tex_coord;
    }
`

const fragmentShader = `
    varying vec4 v_tex_coord;
    uniform sampler2D u_sampler;
    uniform lowp float u_alpha
    void main() {
        lowp vec4 color = texture2D(u_sampler, v_tex_coord);
        color.a = color.a * u_alpha;
        gl_FragColor = color;
    }
`

export interface StdNoteConfig extends BaseDrawableConfig {
    shader: Shader
    vertexArray: VertexArray
    vertexBuffer: VertexBuffer
    texture: Texture
    note: OSUStdNoteCircle
    layout: VertexBufferLayout
    vertexOffset: number
    vertexData: number[]
}

export class StdNote1 extends Drawable<StdNoteConfig> {

    private MAX_DISTANCE = 180
    private judgeResult = 0
    private color = Color.fromHex(0xff2000)
    private approachAlpha = 0
    private shouldVisible = false

    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly vertexOffset: number
    private vertexCount: number = 0

    constructor(gl: WebGL2RenderingContext, config: StdNoteConfig) {
        super(gl, config)
        this.shader = config.shader
        this.layout = config.layout
        this.vertexArray = config.vertexArray
        this.buffer = config.vertexBuffer
        this.vertexOffset = config.vertexOffset
        let { x, y } = config.note
        const scale = Coordinate.height / 384
        x -= 256
        y -= 192
        x *= scale
        y *= -scale
        this.config.offset = [x, y]
    }

    public initVertex(): number {
        const { vertexData, vertexOffset } = this.config
        const { position, size } = this
        Shape2D.quad(
            position.x, position.y,
            position.x + size.x, position.y - size.y,
            vertexData, vertexOffset, 4
        )
        Shape2D.quad(
            0, 0, 
            1, 1, 
            vertexData, 
            vertexOffset + 2, 4
        )
        this.vertexCount = 6
        return this.vertexCount * 4
    }

    protected onUpdate(): void {
        super.onUpdate()
        const current = AudioPlayer.currentTime()
        const startTime = this.config.note.startTime
        const out = current - startTime
        if (out >= 0 && out <= 300) {
            if (this.judgeResult === 0) {
                key.play()
            }
            this.judgeResult = 1
            this.approachAlpha = 0
            this.alpha = Interpolation.valueAt(
                (out) / 300,
                1,
                0
            )
        }
        if (out >= 500)
            this.shouldVisible = false
    }

    public onDraw(): void {
        if (!this.shouldVisible) {
            return
        }
        const gl = this.gl
        const shader = this.shader
        shader.setUniformMatrix4fv('u_orth', this.matrixArray)
        shader.setUniformMatrix4fv('u_transform', Coordinate.orthographicProjectionMatrix4)
        shader.setUniform1f('u_alpha', this.alpha)

        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, this.vertexOffset, this.vertexCount)
    }

    public bind(): void {
        this.shader.bind()
    }

    public unbind(): void {
        this.shader.unbind()
    }

}

export class StdNoteBackground extends Drawable {
    public onDraw(): void {
        
    }

    public bind(): void {
        
    }

    public unbind(): void {
        
    }
}

export class StdApproachCircle extends Drawable {

    public onDraw(): void {
        
    }

    public bind(): void {
        
    }

    public unbind(): void {
        
    }

}

export class StdNote {

    private MAX_DISTANCE = 180
    private judgeResult = 0
    private shouldVisible = false
    private approachDistance = 100
    private maxInnerRadius = 75
    private layoutTranslate = new Vector2()
    private color = Color.fromHex(0xff2000)
    private approachAlpha = 0
    private alpha = 1


    constructor(private note: OSUStdNoteCircle) {
        let { x, y } = note
        const scale = Coordinate.height / 384
        x -= 256
        y -= 192
        x *= scale
        y *= -scale
        this.layoutTranslate.set(x, y)
    }

    public update() {
        const current = AudioPlayer.currentTime()
        const startTime = this.note.startTime
        if (startTime - current <= 800 && startTime - current >= 0) {
            this.shouldVisible = true
            this.approachDistance = Interpolation.valueAt(
                (startTime - current) / 800, 
                this.maxInnerRadius,
                this.MAX_DISTANCE
            )
            this.approachAlpha = Interpolation.valueAt(
                (startTime - current) / 800, 
                1,
                0
            )
        }
        const out = current - startTime
        const absOut = Math.abs(out)
        if (out >= 0 && out <= 300) {
            if (this.judgeResult === 0) {
                key.play()
            }
            this.judgeResult = 1
            this.approachAlpha = 0
            this.alpha = Interpolation.valueAt(
                (out) / 300,
                1,
                0
            )
        }
        if (out >= 500)
            this.shouldVisible = false
    }

    private white = Color.fromHex(0xffffff)

    public copyTo(target: number[] | Float32Array, offset: number, stride: number): number {
        if (!this.shouldVisible) {
            return 0
        }
        const count = 30
        const color = this.color.copy()
        color.alpha = this.alpha

        const approachColor = color.copy()
        approachColor.alpha = this.approachAlpha

        let currentOffset = offset
        if (this.judgeResult) {
            // currentOffset += this.place(
            //     70, 5, Color.fromHex(0xffffff, 255 * this.alpha), count,
            //     target, currentOffset, stride
            // )
            currentOffset += this.place(
                0, 65, color, count,
                target, currentOffset, stride
            )
            return currentOffset
        }
        currentOffset += this.place(
            this.approachDistance, 8, approachColor, count,
            target, currentOffset, stride
        )
        currentOffset += this.place(
            70, 5, Color.fromHex(0xffffff, 255 * this.alpha), count,
            target, currentOffset, stride
        )
        currentOffset += this.place(
            50, 15, color, count,
            target, currentOffset, stride
        )
        brightness(color, -.3)
        currentOffset += this.place(
            35, 15, color, count, 
            target, currentOffset, stride
        )
        brightness(color, -.3)
        currentOffset += this.place(
            0, 35, color, count,
            target, currentOffset, stride
        )

        return currentOffset
    }

    private place(
        innerRadius: number, width: number, color: Color, count: number,
        target: number[] | Float32Array, offset: number, stride: number
    ): number {
        Shape2D.ring(innerRadius, width, color, count, target, offset, stride)
        this.placeTransform(count, target, offset + 6, stride)
        return count * stride * 6
    }

    private placeTransform(count: number, target: number[] | Float32Array, offset: number, stride: number) {
        let currentOffset = offset
        const translate = this.layoutTranslate
        const scale = 1
        for (let i = 0; i < count; i++) {
            target[currentOffset] = translate.x
            target[currentOffset + 1] = translate.y
            target[currentOffset + 2] = scale

            target[currentOffset + stride] = translate.x
            target[currentOffset + stride + 1] = translate.y
            target[currentOffset + stride + 2] = scale

            target[currentOffset + stride * 2] = translate.x
            target[currentOffset + stride * 2 + 1] = translate.y
            target[currentOffset + stride * 2 + 2] = scale

            target[currentOffset + stride * 3] = translate.x
            target[currentOffset + stride * 3 + 1] = translate.y
            target[currentOffset + stride * 3 + 2] = scale

            target[currentOffset + stride * 4] = translate.x
            target[currentOffset + stride * 4 + 1] = translate.y
            target[currentOffset + stride * 4 + 2] = scale

            target[currentOffset + stride * 5] = translate.x
            target[currentOffset + stride * 5 + 1] = translate.y
            target[currentOffset + stride * 5 + 2] = scale

            currentOffset += stride * 6
        }
    }

}

export function brightness(color: Color, brightness: number) {
    const r = clamp(color.red + brightness, 0, 1)
    const g = clamp(color.green + brightness, 0, 1)
    const b = clamp(color.blue + brightness, 0, 1)
    color.red = r
    color.green = g
    color.blue = b
}