import {BaseDrawableConfig} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {VertexBuffer} from "./core/VertexBuffer";
import {Texture} from "./core/Texture";
import {Shader} from "./core/Shader";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {ImageLoader} from "../ImageResources";
import Coordinate from "./Coordinate";
import {Shape2D} from "./Shape2D";
import {BeatDrawable} from "./BeatDrawable";
import {ObjectTransition} from "./Transition";
import {Time} from "../Time";
import {int} from "../Utils";
import {easeOutQuint} from "../util/Easing";
import BeatBooster from "../BeatBooster";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec2 a_tex_coord;
    attribute float a_alpha;

    varying mediump vec2 v_tex_coord;
    varying mediump float v_alpha;
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    void main() {
        vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
        gl_Position = position * u_orth;
        v_tex_coord = a_tex_coord;
        v_alpha = a_alpha;
    }
`

const fragmentShader = `
    varying mediump vec2 v_tex_coord;
    varying mediump float v_alpha;
    uniform sampler2D u_sampler;

    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        texelColor.a = texelColor.a * v_alpha;
        gl_FragColor = texelColor;
    }
`

export class Ripples extends BeatDrawable {

    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private readonly textureUnit: number = 1
    private ripples: Ripple[] = []

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const texture = new Texture(gl, ImageLoader.get("ripple"))

        buffer.bind()
        shader.bind()
        shader.setUniform1i('u_sampler', this.textureUnit)
        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_tex_coord"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_alpha"), 1)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer
        this.texture = texture
        this.layout = layout
        this.shader = shader

    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatBooster.isAvailable) {
            return
        }
        let ripple: Ripple
        const ripples = this.ripples
        if (ripples.length === 0) {
            ripple = new Ripple(this)
            ripples.unshift(ripple)
            ripple.start()
        } else {
            ripple = ripples[ripples.length - 1]
            if (ripple.isEnd()) {
                ripples.pop()
                ripples.unshift(ripple)
                ripple.reset()
            } else {
                ripple = new Ripple(this)
                ripples.unshift(ripple)
            }
        }
        ripple.start()
    }

    public bind() {
        this.vertexArray.bind()
        this.buffer.bind()
        this.texture.bind(this.textureUnit)
        this.shader.bind()
    }

    private vertexData = new Float32Array([])
    private vertexCount = 0
    protected onUpdate() {
        super.onUpdate();
        const data: number[] = []
        const ripples = this.ripples
        let currentOffset = 0
        if (ripples.length === 0) {
            return
        }
        for (let i = 0; i < ripples.length; i++) {
            const ripple = ripples[i]
            ripple.update()
            currentOffset += ripple.copyTo(data, currentOffset)
        }
        this.vertexData = new Float32Array(data)
        this.vertexCount = int(data.length / 5)
    }

    public unbind() {
        this.vertexArray.unbind()
        this.buffer.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public onDraw() {
        const gl = this.gl
        const shader = this.shader

        shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        if (this.vertexCount === 0) return

        this.buffer.setBufferData(this.vertexData)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}

class Ripple {

    private readonly maxThickWidth: number
    private readonly innerRadius: number
    private currentThickWidth: number = 1
    private transition: ObjectTransition = new ObjectTransition(this, 'currentThickWidth')
    private alpha = 0.15
    private alphaTransition: ObjectTransition = new ObjectTransition(this, 'alpha')

    constructor(
      parent: Ripples
    ) {
        this.innerRadius = parent.width / 2
        this.maxThickWidth = this.innerRadius * 0.8
        console.log(this.maxThickWidth)
        this.currentThickWidth = 0
    }

    public reset() {
        this.currentThickWidth = 0
        this.alpha = 0.15
    }

    public start() {
        this.startTransition()
          .transitionTo(this.maxThickWidth, 3000, easeOutQuint)
        this.alphaBegin()
          .transitionTo(0, 2800, easeOutQuint)
    }

    public isEnd() {
        return this.transition.isEnd
    }

    public update() {
        this.transition.update(Time.currentTime)
        this.alphaTransition.update(Time.currentTime)
    }

    public startTransition(startTime = Time.currentTime): ObjectTransition {
        this.transition.setStartTime(startTime)
        return this.transition
    }

    public alphaBegin(startTime = Time.currentTime): ObjectTransition {
        this.alphaTransition.setStartTime(startTime)
        return this.alphaTransition
    }

    public copyTo(out: Float32Array | number[], offset: number) {

        const value = (this.innerRadius + this.currentThickWidth)

        Shape2D.quad(
          -value, value,
          value, -value,
          out, offset, 5
        )
        Shape2D.quad(0, 0, 1, 1, out, offset + 2, 5)

        Shape2D.one(this.alpha, out, offset + 4, 5, 6)

        return 5 * 6
    }
}