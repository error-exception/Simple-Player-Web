import BeatBooster from "../../../global/BeatBooster";
import { BeatDispatcher, type IBeat } from "../../../global/Beater";
import { Time } from "../../../global/Time";
import { OSUApplication } from "../../../OSUApplication";
import { easeInQuart, easeOut } from "../../../util/Easing";
import type { Canvas } from "../../canvas/Canvas";
import { Blend } from "../../drawable/Blend";
import { DynamicQuadBuffer } from "../../graphic/buffer/DynamicQuadBuffer";
import { vector2 } from "../../graphic/matrix/vec2";
import type { AlphaTextureExtra } from "../../graphic/shader/AlphaTextureShaderWrapper";
import { Shaders } from "../../graphic/shader/Shaders";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ObjectTransition } from "../../transition/Transition";
import { View } from "../../view/View";


export class Ripples extends View implements IBeat {

  public maxThickWidth?: number
  public duration?: number
  public defaultRippleAlpha?: number

  private ripples: Ripple[] = []

  //@ts-ignore
  public dynamicQuadBuffer: DynamicQuadBuffer

  constructor() {
    super()
    BeatDispatcher.register(this)
  }

  public onLoad() {
    super.onLoad();
    const renderer = OSUApplication.renderer
    if (!renderer) {
      return
    }

    this.dynamicQuadBuffer = new DynamicQuadBuffer(renderer, 5)
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

  // TODO: define an interface to type this object. used for AlphaTextureShader
  private extra: AlphaTextureExtra = {
    applyAlpha: 0
  }

  public onDraw(canvas: Canvas) {
    
    const ripples = this.ripples
    if (ripples.length === 0) {
      return
    }
    const texture = TextureStore.getTexture('Ripple')
    const center = vector2.middle(vector2.create(), vector2.create(), this.size);

    let ripple: Ripple
    canvas.useShader(Shaders.AlphaTexture)
    canvas.useVertexBuffer(this.dynamicQuadBuffer)
    canvas.setBlend(Blend.Additive)

    canvas.beginBatch()
    for (let i = 0; i < ripples.length; i++) {
      ripple = ripples[i]

      const currentRadius = ripple.innerRadius + ripple.currentThickWidth;

      this.extra.applyAlpha = ripple.alpha
      canvas.setExtra(this.extra)
      
      canvas.drawTexture(
        texture,
        center[0] - currentRadius,
        center[1] - currentRadius,
        currentRadius * 2, currentRadius * 2
      )
    }
    canvas.endBatch()
  }

  public onDispose() {
    super.dispose()
    this.dynamicQuadBuffer.dispose()
    BeatDispatcher.unregister(this)
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
    this.innerRadius = parent.width / 2
    this.maxThickWidth = parent.maxThickWidth ?? this.innerRadius * 0.6
    this.movementDuration = parent.duration ?? 1000
    this.defaultAlpha = parent.defaultRippleAlpha ?? 0.045
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