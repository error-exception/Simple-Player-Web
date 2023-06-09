import {BaseDrawableConfig, Drawable} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {Shader} from "./core/Shader";
import {Vector2} from "./core/Vector2";
import {Matrix3} from "./core/Matrix3";
import {TransformUtils} from "./core/TransformUtils";
import {Viewport} from "./Viewport";
import {ObjectTransition} from "./Transition";
import {Time} from "../Time";
import {BeatDrawable} from "./BeatDrawable";
import {Color} from "./Color";
import {Interpolation} from "./Interpolation";
import {BeatState} from "../Beater";
import {easeOut, easeOutQuint} from "../util/Easing";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying mediump vec4 v_color;
    
    uniform mat4 u_transform;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_transform;
        v_color = a_color;
    }
`

const fragmentShader = `
    varying mediump vec4 v_color;
    uniform mediump vec3 u_circle;
    uniform mediump float u_light;
    void main() {
//        gl_FragColor = v_color;
        lowp float dist = distance(u_circle.xy, gl_FragCoord.xy);
        if (dist < u_circle.z) {
            mediump vec4 color = vec4(0.0);
            color.rgb = min(v_color.rgb + u_light, 1.0);
            color.a = v_color.a;
            gl_FragColor = color;
//            gl_FragColor = v_color;
        } else {
//            gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);
            discard;
        }
    }
`

export class LogoTriangles extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly vertexBuffer: VertexBuffer
    private readonly layout: VertexBufferLayout
    private readonly shader: Shader
    private vertexCount: number = 0
    private vertex: Float32Array
    private particles: TriangleParticle[] = []
    private startColor = Color.fromHex(0xff7db7)
    private endColor = Color.fromHex(0xde5b95)
    private MAX_SIZE = 500
    private MIN_SIZE = 20

    public light: number = 0
    private lightTransition = new ObjectTransition(this, 'light')

    public velocityIncrement = 0
    private velocityTransition = new ObjectTransition(this, 'velocityIncrement')

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        vertexBuffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_color"), 4)
        this.vertexCount = 3 * 42
        this.vertex = new Float32Array(this.vertexCount * 6)
        for (let i = 0; i < this.vertexCount / 3 - 2; i++) {
            const triangle = new TriangleParticle(this)
            this.particles.push(triangle)
        }

        vertexArray.unbind()
        vertexBuffer.unbind()
        shader.unbind()

        this.shader = shader
        this.vertexBuffer = vertexBuffer
        this.vertexArray = vertexArray
        this.layout = layout
    }

    public lightBegin(atTime: number = Time.currentTime) {
        this.lightTransition.setStartTime(atTime)
        return this.lightTransition
    }

    public velocityBegin(atTime: number = Time.currentTime) {
        this.velocityTransition.setStartTime(atTime)
        return this.velocityTransition
    }

    private circleInfo = new Float32Array(3)

    protected onUpdate() {
        super.onUpdate();
        this.lightTransition.update(Time.currentTime)
        this.velocityTransition.update(Time.currentTime)
        const width = this.rawSize.x
        const height = this.rawSize.y
        const { x, y } = this.rawPosition
        const topLeft = new Vector2(x, y)
        const topRight = new Vector2(x + width, y)
        const bottomLeft = new Vector2(x, y - height)
        const bottomRight = new Vector2(x + width, y - height)
        TransformUtils.applyOrigin(topLeft, this.coordinateScale)
        TransformUtils.applyOrigin(topRight, this.coordinateScale)
        TransformUtils.applyOrigin(bottomLeft, this.coordinateScale)
        TransformUtils.applyOrigin(bottomRight, this.coordinateScale)
        const {red, green, blue, alpha} = this.startColor
        const vertex = this.vertex

        vertex[0] = topLeft.x
        vertex[1] = topLeft.y
        vertex[2] = red
        vertex[3] = green
        vertex[4] = blue
        vertex[5] = alpha

        vertex[6] = bottomLeft.x
        vertex[7] = bottomLeft.y
        vertex[8] =  red
        vertex[9] =  green
        vertex[10] = blue
        vertex[11] = alpha


        vertex[12] = bottomRight.x
        vertex[13] = bottomLeft.y
        vertex[14] = red
        vertex[15] = green
        vertex[16] = blue
        vertex[17] = alpha

        vertex[18] = bottomRight.x
        vertex[19] = bottomRight.y
        vertex[20] = red
        vertex[21] = green
        vertex[22] = blue
        vertex[23] = alpha

        vertex[24] = topLeft.x
        vertex[25] = topLeft.y
        vertex[26] = red
        vertex[27] = green
        vertex[28] = blue
        vertex[29] = alpha

        vertex[30] = topRight.x
        vertex[31] = topRight.y
        vertex[32] = red
        vertex[33] = green
        vertex[34] = blue
        vertex[35] = alpha

        this.updateParticles()
    }

    private updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            if (triangle.isFinish()) {
                triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
                triangle.position = new Vector2(
                    Interpolation.valueAt(Math.random(), this.rawPosition.x, this.rawPosition.x + this.rawSize.x),
                    this.rawPosition.y - this.rawSize.y - triangle.size
                )
                triangle.color = colorAt(Math.random(), this.startColor, this.endColor)
                triangle.updateVertex()
            } else {
                triangle.position.y += 0.2 + triangle.size / 400 + this.velocityIncrement * (triangle.size / 400)
                triangle.updateVertex()
                triangle.copyTo(this.coordinateScale, this.vertex, 36 + 18 * i, 6)
            }
        }
    }

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport);
        this.initParticles()
    }

    private isInitialed = false

    private initParticles() {
        if (this.isInitialed) return
        this.isInitialed = true
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
            triangle.position = new Vector2(
                Interpolation.valueAt(Math.random(), this.rawPosition.x, this.rawPosition.x + this.rawSize.x),
                Interpolation.valueAt(Math.random(), this.rawPosition.y, this.rawPosition.y - this.rawSize.y)
            )
            triangle.color = colorAt(Math.random(), this.startColor, this.endColor)
            triangle.updateVertex()
        }
    }

    protected onTransformApplied() {
        super.onTransformApplied();
        const circleMaxRadius = Math.min(this.size.x, this.size.y) / 2
        const circleCenter = new Vector2(
            this.viewport.width / 2 + this.appliedTranslate.x,
            this.viewport.height / 2 + this.appliedTranslate.y
        )
        this.circleInfo[0] = circleCenter.x
        this.circleInfo[1] = circleCenter.y
        this.circleInfo[2] = circleMaxRadius
    }


    public bind(): void {
        this.vertexArray.bind()
        this.shader.bind()
    }

    public onDraw(): void {
        const gl = this.gl

        this.shader.setUniform1f('u_light', this.light)
        this.shader.setUniform3fv('u_circle', this.circleInfo)
        this.shader.setUniformMatrix4fv("u_transform", this.matrixArray)
        this.vertexBuffer.bind()
        this.vertexBuffer.setBufferData(this.vertex)

        this.vertexArray.addBuffer(this.vertexBuffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)

        this.vertexBuffer.unbind()
    }

    public unbind(): void {
        this.vertexArray.unbind()
        this.shader.unbind()
    }

    public dispose() {
        super.dispose();
        this.shader.dispose()
        this.vertexArray.dispose()
        this.vertexBuffer.dispose()
    }

}

class TriangleParticle {

    public top: Vector2 = Vector2.newZero()
    public bottomLeft: Vector2 = Vector2.newZero()
    public bottomRight: Vector2 = Vector2.newZero()

    public position: Vector2 = Vector2.newZero()
    public size: number = 0
    public color: Color = Color.fromHex(0xff7db7)

    constructor(private parent: LogoTriangles) {}

    private cos30 = Math.sqrt(3) / 2
    private sin30 = 0.5

    public isFinish(): boolean {
        const centerY = this.position.y - 0.5 /* Math.cos(degreeToRadian(60))*/ * this.size
        return centerY > this.parent.rawSize.y / 2
    }

    public updateVertex() {

        const position = this.position
        const size = this.size
        Vector2.set(this.top,
            position.x,
            position.y + size
        )
        Vector2.set(this.bottomLeft,
            position.x - size * this.cos30,
            position.y - size * this.sin30
        )
        Vector2.set(this.bottomRight,
            position.x + size * this.cos30,
            position.y - size * this.sin30
        )
    }

    public copyTo(coordinateScale: Matrix3, out: Float32Array, offset: number, stride: number) {
        const top = TransformUtils.apply(this.top, coordinateScale)
        const bottomLeft = TransformUtils.apply(this.bottomLeft, coordinateScale)
        const bottomRight = TransformUtils.apply(this.bottomRight, coordinateScale)
        out[offset] = top.x
        out[offset + 1] = top.y
        out[offset + 2] = this.color.red
        out[offset + 3] = this.color.green
        out[offset + 4] = this.color.blue
        out[offset + 5] = this.color.alpha

        out[offset + stride] = bottomLeft.x
        out[offset + stride + 1] = bottomLeft.y
        out[offset + stride + 2] = this.color.red
        out[offset + stride + 3] = this.color.green
        out[offset + stride + 4] = this.color.blue
        out[offset + stride + 5] = this.color.alpha

        out[offset + stride * 2] = bottomRight.x
        out[offset + stride * 2 + 1] = bottomRight.y
        out[offset + stride * 2 + 2] = this.color.red
        out[offset + stride * 2 + 3] = this.color.green
        out[offset + stride * 2 + 4] = this.color.blue
        out[offset + stride * 2 + 5] = this.color.alpha
    }

}

function colorAt(randomValue: number, startColor: Color, endColor: Color): Color {
    const r = startColor.red + (endColor.red - startColor.red) * randomValue
    const g = startColor.green + (endColor.green - startColor.green) * randomValue
    const b = startColor.blue + (endColor.blue - startColor.blue) * randomValue
    return new Color(r, g, b, 1)
}