import {BaseDrawableConfig, Drawable} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {Shader} from "./core/Shader";
import {Vector2} from "./core/Vector2";
import {degreeToRadian} from "../Utils";
import {Matrix3} from "./core/Matrix3";
import {TransformUtils} from "./core/TransformUtils";
import {Viewport} from "./Viewport";
import {ObjectTransition} from "./Transition";
import {Time} from "../Time";

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

const fragmentShader1 = `
    varying mediump vec4 v_color;
    uniform mediump vec3 u_circle;
    uniform mediump float u_light;
    void main() {
//        gl_FragColor = v_color;
//        lowp float dist = distance(u_circle.xy, gl_FragCoord.xy);
//        if (dist < u_circle.z) {
//            mediump vec4 color = vec4(0.0);
//            color.rgb = min(v_color.rgb + u_light, 1.0);
//            color.a = v_color.a;
//            gl_FragColor = color;
            gl_FragColor = v_color;
//        } else {
//            gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);
//            discard;
//        }
    }
`

export class LogoTriangles extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly vertexBuffer: VertexBuffer
    private readonly layout: VertexBufferLayout
    private readonly shader: Shader
    private vertexCount: number = 0
    private vertex: Float32Array
    private triangles: Triangle[] = []

    public light: number = 0
    private lightTransition = new ObjectTransition(this, 'light')

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
            const triangle = new Triangle(this)
            this.triangles.push(triangle)
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

    private circleInfo = new Float32Array(3)

    protected onUpdate() {
        super.onUpdate();
        this.lightTransition.update(Time.currentTime)
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
        const [r, g, b, a] = [1.0, 0x7d / 0xff, 0xb7 / 0xff, 1.0]
        const vertex = this.vertex

        vertex[0] = topLeft.x
        vertex[1] = topLeft.y
        vertex[2] = r
        vertex[3] = g
        vertex[4] = b
        vertex[5] = a

        vertex[6] = bottomLeft.x
        vertex[7] = bottomLeft.y
        vertex[8] =  r
        vertex[9] =  g
        vertex[10] = b
        vertex[11] = a


        vertex[12] = bottomRight.x
        vertex[13] = bottomLeft.y
        vertex[14] = r
        vertex[15] = g
        vertex[16] = b
        vertex[17] = a

        vertex[18] = bottomRight.x
        vertex[19] = bottomRight.y
        vertex[20] = r
        vertex[21] = g
        vertex[22] = b
        vertex[23] = a

        vertex[24] = topLeft.x
        vertex[25] = topLeft.y
        vertex[26] = r
        vertex[27] = g
        vertex[28] = b
        vertex[29] = a

        vertex[30] = topRight.x
        vertex[31] = topRight.y
        vertex[32] = r
        vertex[33] = g
        vertex[34] = b
        vertex[35] = a

        for (let i = 0; i < this.triangles.length; i++) {
            const triangle = this.triangles[i]
            triangle.update()
            triangle.copyTo(this.coordinateScale, vertex, 36 + 18 * i, 6)
        }

        this.shader.bind()
        this.shader.setUniform1f('u_light', this.light)
        this.vertexBuffer.bind()
        this.vertexBuffer.setBufferData(vertex)
        this.vertexBuffer.unbind()
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
        this.shader.setUniform3fv('u_circle', this.circleInfo)
        this.shader.setUniformMatrix4fv("u_transform", this.matrixArray)
        this.shader.unbind()
    }

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport);
    }

    public bind(): void {
        this.vertexArray.bind()
        this.shader.bind()
    }

    public onDraw(): void {
        const gl = this.gl
        this.vertexArray.addBuffer(this.vertexBuffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
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

export class Color {
    public red: number = 0.0
    public green: number = 0
    public blue: number = 0
    public alpha: number = 0

    constructor(colorInt: number, alphaInt: number = 255) {
        const red = (colorInt >> 16) & 0xff
        const green = (colorInt >> 8) & 0xff
        const blue = (colorInt) & 0xff
        this.red = red / 255
        this.green = green / 255
        this.blue = blue / 255
        this.alpha = alphaInt / 255
    }

}
const colors: Color[] = [
    new Color(0xFF66AA),
    new Color(0xEE3399),
    new Color(0xBB1177)
]

class Triangle {

    public top: Vector2 = Vector2.newZero()
    public bottomLeft: Vector2 = Vector2.newZero()
    public bottomRight: Vector2 = Vector2.newZero()
    public velocity: number = 1
    private center: Vector2 = Vector2.newZero()
    private size: number = 0
    private color: Color = colors[1]
    private startColor = new Color(0xff7db7)
    private endColor = new Color(0xde5b95)
    private isInitialed = false

    constructor(private parent: LogoTriangles) {
    }

    private randomPosition(): Vector2 {
        const x = this.parent.rawSize.x * Math.random() - this.parent.rawSize.x / 2
        const y = this.parent.rawSize.y * Math.random() - this.parent.rawSize.y / 2
        return new Vector2(x, y)
    }

    private randomSize(): number {
        return (10 + Math.random() * 500) //* this.parent.appliedScale.x
    }

    private randomColor() {
        this.color = colorAt(Math.random(), this.startColor, this.endColor)
    }

    public update() {
        if (!this.isInitialed) {
            const center = this.randomPosition()
            const size = this.randomSize()
            const cos30 = Math.cos(degreeToRadian(30))
            const sin30 = Math.sin(degreeToRadian(30))

            this.top = new Vector2(center.x, center.y + size)
            this.bottomLeft = new Vector2(center.x - size * cos30, center.y - size * sin30)
            this.bottomRight = new Vector2(center.x + size * cos30, center.y - size * sin30)

            this.size = size
            this.center = center
            this.randomColor()
            this.isInitialed = true

        }
        if (this.isOutOfBound()) {
            this.reset()
            return
        }
        const translateY = this.velocity + this.size / 250
        const matrix = TransformUtils.translate(0, translateY)
        TransformUtils.applyOrigin(this.top, matrix)
        TransformUtils.applyOrigin(this.bottomLeft, matrix)
        TransformUtils.applyOrigin(this.bottomRight, matrix)
        TransformUtils.applyOrigin(this.center, matrix)
    }

    private isOutOfBound(): boolean {
        const centerY = this.center.y - Math.cos(degreeToRadian(60)) * this.size
        return centerY > this.parent.rawSize.y / 2
    }

    private reset() {
        const size = this.randomSize()
        const parentWidth = this.parent.rawSize.x
        const parentHeight = this.parent.rawSize.y

        const centerX = Math.random() * parentWidth - parentWidth / 2
        const centerY = -parentHeight / 2 - size
        const center = new Vector2(centerX, centerY)
        const cos30 = Math.cos(degreeToRadian(30))
        const sin30 = Math.sin(degreeToRadian(30))

        this.top = new Vector2(center.x, center.y + size)
        this.bottomLeft = new Vector2(center.x - size * cos30, center.y - size * sin30)
        this.bottomRight = new Vector2(center.x + size * cos30, center.y - size * sin30)

        this.size = size
        this.center = center
        this.randomColor()
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
    const color = new Color(0)
    color.red = r
    color.green = g
    color.blue = b
    return color
}