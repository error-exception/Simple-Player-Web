import {BaseDrawableConfig} from "../../drawable/Drawable";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Texture} from "../../core/Texture";
import Coordinate from "../../base/Coordinate";
import {Shape2D} from "../../util/Shape2D";
import {BeatDrawable} from "../../drawable/BeatDrawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {int} from "../../../Utils";
import {easeInQuart, easeOut} from "../../../util/Easing";
import BeatBooster from "../../../global/BeatBooster";
import {Images} from "../../util/ImageResource";
import {Shaders} from "../../shader/Shaders";
import type {AlphaTextureShaderWrapper} from "../../shader/AlphaTextureShaderWrapper";

export class Ripples extends BeatDrawable {

    // private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly shader: AlphaTextureShaderWrapper
    // private readonly layout: VertexBufferLayout
    private readonly textureUnit: number = 1
    private ripples: Ripple[] = []

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        this.buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        this.texture = new Texture(gl, Images.Ripple)
        this.shader = Shaders.AlphaTexture

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
        // this.vertexArray.bind()
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
        this.buffer.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public onDraw() {
        const gl = this.gl
        const shader = this.shader
        shader.sampler2D = this.textureUnit
        shader.transform = this.matrixArray
        shader.orth = Coordinate.orthographicProjectionMatrix4
        if (this.vertexCount === 0) return

        this.buffer.setBufferData(this.vertexData)
        shader.use()
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        super.dispose()
        this.texture.dispose()
        this.buffer.dispose()
    }

}

class Ripple {

    private readonly maxThickWidth: number
    private readonly innerRadius: number
    private currentThickWidth: number = 1
    private readonly defaultAlpha = 0.045
    private transition: ObjectTransition = new ObjectTransition(this, 'currentThickWidth')
    private alpha = this.defaultAlpha
    private alphaTransition: ObjectTransition = new ObjectTransition(this, 'alpha')

    constructor(
      parent: Ripples
    ) {
        this.innerRadius = parent.width / 2
        this.maxThickWidth = this.innerRadius * 0.6
        this.currentThickWidth = 0
    }

    public reset() {
        this.currentThickWidth = 0
        this.alpha = this.defaultAlpha
    }

    public start() {
        this.startTransition()
          .transitionTo(this.maxThickWidth, 1000, easeOut)
        this.alphaBegin()
          .transitionTo(0, 1000, easeInQuart)
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