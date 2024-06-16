import {BeatDrawable} from "../../drawable/BeatDrawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {easeInQuart, easeOut} from "../../../util/Easing";
import BeatBooster from "../../../global/BeatBooster";
import {DrawNode} from "../../drawable/DrawNode";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {DynamicQuadBuffer} from "../../buffer/DynamicQuadBuffer";
import {TextureStore} from "../../texture/TextureStore";
import {Shaders} from "../../shader/Shaders";
import type {AlphaTextureShaderWrapper} from "../../shader/AlphaTextureShaderWrapper";
import Coordinate from "../../base/Coordinate";
import {Blend} from "../../drawable/Blend";
import {Vector2Utils} from "../../core/Vector2Utils";
import type {BaseDrawableConfig} from "../../drawable/Drawable";

export interface RippleConfig extends BaseDrawableConfig {
    maxThickWidth?: number
    duration?: number
    defaultRippleAlpha?: number
}

export class Ripples extends BeatDrawable<RippleConfig> {

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

    public onUpdate() {
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
        const center = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight)//. Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
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
            node.drawOne(
              this.computeColor(ripple.alpha).alpha,
              DrawNode.VERTEX_PER_QUAD,
              4,
              i
            )
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
    private readonly defaultAlpha: number = 0.045
    private transition: ObjectTransition = new ObjectTransition(this, 'currentThickWidth')
    public alpha = this.defaultAlpha
    private alphaTransition: ObjectTransition = new ObjectTransition(this, 'alpha')
    private readonly movementDuration: number = 1000

    constructor(
      parent: Ripples
    ) {
        this.innerRadius = parent.getWidth() / 2
        this.maxThickWidth = parent.config.maxThickWidth ?? this.innerRadius * 0.6
        this.movementDuration = parent.config.duration ?? 1000
        this.defaultAlpha = parent.config.defaultRippleAlpha ?? 0.045
        this.currentThickWidth = 0
    }

    public reset() {
        this.currentThickWidth = 0
        this.alpha = this.defaultAlpha
    }

    public start() {
        this.startTransition()
          .transitionTo(this.maxThickWidth, this.movementDuration, easeOut)
        this.alphaBegin()
          .transitionTo(0, this.movementDuration, easeInQuart)
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

}