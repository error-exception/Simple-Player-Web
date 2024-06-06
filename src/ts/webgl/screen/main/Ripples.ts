import {Shape2D} from "../../util/Shape2D";
import {BeatDrawable} from "../../drawable/BeatDrawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {easeInQuart, easeOut} from "../../../util/Easing";
import BeatBooster from "../../../global/BeatBooster";
import {DrawNode} from "../../drawable/DrawNode";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {DynamicQuadBuffer} from "../../buffer/DynamicQuadBuffer";
import {TextureStore} from "../../texture/TextureStore";
import {Vector} from "../../core/Vector2";
import {Shaders} from "../../shader/Shaders";
import type {AlphaTextureShaderWrapper} from "../../shader/AlphaTextureShaderWrapper";
import Coordinate from "../../base/Coordinate";
import {Blend} from "../../drawable/Blend";

export class Ripples extends BeatDrawable {

    private ripples: Ripple[] = []

    public drawNode: DrawNode = new class extends DrawNode {
        public apply() {
            this.bufferData = []
        }
    }(this)

    public onLoad(renderer: WebGLRenderer) {
        super.onLoad(renderer);
        this.drawNode.vertexBuffer = new DynamicQuadBuffer(renderer, 5)
        this.drawNode.shader = Shaders.AlphaTexture
        this.drawNode.blend = Blend.Additive
        this.drawNode.apply()
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

    protected onUpdate() {
        super.onUpdate();
        const ripples = this.ripples
        if (ripples.length === 0) {
            return
        }
        for (let i = 0; i < ripples.length; i++) {
            const ripple = ripples[i]
            ripple.update()
        }
    }

    beforeCommit(node: DrawNode) {
        const shader = node.shader as AlphaTextureShaderWrapper
        shader.orth = Coordinate.orthographicProjectionMatrix4
        shader.sampler2D = 0
    }

    public onDraw(node: DrawNode) {
        const ripples = this.ripples
        if (ripples.length === 0) {
            return
        }
        const texture = TextureStore.get('Ripple')
        const center = Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
        let ripple: Ripple
        for (let i = 0; i < ripples.length; i++) {
            ripple = ripples[i]
            const currentRadius = ripple.innerRadius + ripple.currentThickWidth
            node.drawRect(
              center.minusValue(currentRadius),
              center.addValue(currentRadius),
              undefined,
              i
            )
            node.drawTexture(texture, undefined, undefined, i)
            node.drawOne(ripple.alpha, DrawNode.VERTEX_PER_QUAD, 4, i)
        }
    }

    public dispose() {
        super.dispose()
        this.drawNode.vertexBuffer.dispose()
    }

}

class Ripple {

    private readonly maxThickWidth: number
    public readonly innerRadius: number
    public currentThickWidth: number = 1
    private readonly defaultAlpha = 0.045
    private transition: ObjectTransition = new ObjectTransition(this, 'currentThickWidth')
    public alpha = this.defaultAlpha
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