import {Time} from "../../../global/Time";
import {Color} from "../../base/Color";
import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Interpolation} from "../../util/Interpolation";
import {Shape2D} from "../../util/Shape2D";
import {ObjectTransition} from "../../transition/Transition";
import {Shader} from "../../core/Shader";
import {Vector2} from "../../core/Vector2";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying mediump vec4 v_color;
    
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    void main() {
        vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
        gl_Position = position * u_orth;
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
    private MAX_SIZE = 300
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
        const width = this.width;
        const height = this.height;
        const { x, y } = this.position
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        const vertex = this.vertex
        Shape2D.quadVector2(topLeft, bottomRight, vertex, 0, 6)
        Shape2D.oneColor(this.startColor, vertex, 2, 6)

        this.updateParticles()
    }

    private updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            if (triangle.isFinish()) {
                triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
                const { x, y } = this.position
                triangle.position = new Vector2(
                    Interpolation.valueAt(Math.random(), x, x + this.width),
                    y - this.height - triangle.size
                )
                triangle.color = colorAt(Math.random(), this.startColor, this.endColor)
                triangle.updateVertex()
            } else {
                const size = triangle.size
                triangle.position.y += 0.2 + size / 400 + this.velocityIncrement * (size / 400)
                triangle.updateVertex()
                triangle.copyTo(this.vertex, 36 + 18 * i, 6)
            }
        }
    }

    public onLoad(): void {
        super.onLoad()
        this.initParticles()
    }

    private isInitialed = false

    private initParticles() {
        if (this.isInitialed) return
        this.isInitialed = true
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
            const { x, y } = this.position
            triangle.position = new Vector2(
                Interpolation.valueAt(Math.random(), x, x + this.width),
                Interpolation.valueAt(Math.random(), y, y - this.height)
            )
            triangle.color = colorAt(Math.random(), this.startColor, this.endColor)
            triangle.updateVertex()
        }
    }

    protected onTransformApplied() {
        super.onTransformApplied();
        const transform = this.appliedTransform
        const scaledWidth = this.width / Coordinate.ratio * transform.scale.x * window.devicePixelRatio
        const scaledHeight = this.height / Coordinate.ratio * transform.scale.y * window.devicePixelRatio
        const circleMaxRadius = Math.min(scaledWidth, scaledHeight) / 2
        const circleCenter = new Vector2(
            (Coordinate.nativeWidth / 2 + transform.translate.x) * window.devicePixelRatio,
            (Coordinate.nativeHeight / 2 + transform.translate.y) * window.devicePixelRatio
        )
        this.circleInfo[0] = circleCenter.x
        this.circleInfo[1] = circleCenter.y
        this.circleInfo[2] = circleMaxRadius
    }


    public bind(): void {
        this.vertexArray.bind()
        this.vertexBuffer.bind()
        this.shader.bind()
    }

    public onDraw(): void {
        const gl = this.gl

        this.shader.setUniform1f('u_light', this.light)
        this.shader.setUniform3fv('u_circle', this.circleInfo)
        this.shader.setUniformMatrix4fv("u_transform", this.matrixArray)
        this.shader.setUniformMatrix4fv("u_orth", Coordinate.orthographicProjectionMatrix4)
        this.vertexBuffer.setBufferData(this.vertex)

        this.vertexArray.addBuffer(this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)

    }

    public unbind(): void {
        this.vertexArray.unbind()
        this.vertexBuffer.unbind()
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
        return centerY > this.parent.width / 2
    }

    public updateVertex() {

        const position = this.position
        const size = this.size
        this.top.set(
            position.x,
            position.y + size
        )
        this.bottomLeft.set(
            position.x - size * this.cos30,
            position.y - size * this.sin30
        )
        this.bottomRight.set(
            position.x + size * this.cos30,
            position.y - size * this.sin30
        )
    }

    public copyTo(out: Float32Array, offset: number, stride: number) {
        const top = this.top
        const bottomLeft = this.bottomLeft
        const bottomRight = this.bottomRight
        Shape2D.triangle(top, bottomLeft, bottomRight, out, offset, stride)
        Shape2D.oneColor(this.color, out, offset + 2, stride)
    }

}

function colorAt(randomValue: number, startColor: Color, endColor: Color): Color {
    const r = startColor.red + (endColor.red - startColor.red) * randomValue
    const g = startColor.green + (endColor.green - startColor.green) * randomValue
    const b = startColor.blue + (endColor.blue - startColor.blue) * randomValue
    return new Color(r, g, b, 1)
}