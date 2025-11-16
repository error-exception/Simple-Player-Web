import {linear, TimeFunction} from "../../util/Easing";
import {Vector2} from "../graphic/core/Vector2";
import {GetAndSetTransition} from "./Transition";
import {Time} from "../../global/Time";
import type {Color, Color4} from "../base/Color";
import type {Transformable} from "../drawable/Transformable";
import type { View } from "../view/View";

const M = 0, MX = 1, MY = 2,
  F = 3, R = 4,
  S = 5, SX = 6, SY = 7,
  C = 11,
  W = 12, H = 13, SIZE = 14;

/**
 * 变换过渡类，每一种变换相互独立，
 * TODO: Refactor TransformTransition, make it more easy to use
 */
export class TransformTransition {

  protected transitionX: GetAndSetTransition
  protected transitionY: GetAndSetTransition
  protected transitionScaleX: GetAndSetTransition
  protected transitionScaleY: GetAndSetTransition
  transitionAlpha: GetAndSetTransition
  protected transitionRotate: GetAndSetTransition

  protected transitionColorR: GetAndSetTransition
  protected transitionColorG: GetAndSetTransition
  protected transitionColorB: GetAndSetTransition

  protected transitionWidth: GetAndSetTransition
  protected transitionHeight: GetAndSetTransition

  private transitionDelay = 0
  private transformType = -1

  constructor(public transform: Transformable) {
    this.transitionX = new GetAndSetTransition(
      () => transform.translateX, x => transform.translateX = x
    )
    this.transitionY = new GetAndSetTransition(
      () => transform.translateY, y => transform.translateY = y
    )
    this.transitionScaleX = new GetAndSetTransition(
      () => transform.scaleX, x => transform.scaleX = x
    )
    this.transitionScaleY = new GetAndSetTransition(
      () => transform.scaleY, y => transform.scaleY = y
    )
    this.transitionAlpha = new GetAndSetTransition(
      () => transform.alpha, a => transform.alpha = a
    )
    this.transitionRotate = new GetAndSetTransition(
      () => transform.rotate, r => transform.rotate = r
    )

    this.transitionColorR = new GetAndSetTransition(
      () => transform.colorR, r => transform.colorR = r
    )
    this.transitionColorG = new GetAndSetTransition(
      () => transform.colorG, g => transform.colorG = g
    )
    this.transitionColorB = new GetAndSetTransition(
      () => transform.colorB, b => transform.colorB = b
    )
    this.transitionWidth = new GetAndSetTransition(
      () => transform.width, w => transform.width = w
    )
    this.transitionHeight = new GetAndSetTransition(
      () => transform.height, h => transform.height = h
    )
  }

  /**
   * 仅当变换类型变化时生效
   * @param ms
   */
  public delay(ms: number) {
    this.transitionDelay = ms
    return this
  }

  /**
   * 如果想正常开始一段新动画，你必须首先调用 clear
   */
  public get clear() {
    this.transformType = -1
    return this
  }

  public moveXTo(x: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== MX) {
      this.transitionX.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = MX
    }
    this.transitionX.transitionTo(x, duration, ease)
    return this
  }

  public moveYTo(y: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== MY) {
      this.transitionY.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = MY
    }
    this.transitionY.transitionTo(y, duration, ease)
    return this
  }

  public moveTo(v: vec2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== M) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionX.setStartTime(time)
      this.transitionY.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = M
    }
    this.transitionX.transitionTo(v[0], duration, ease)
    this.transitionY.transitionTo(v[1], duration, ease)
    return this
  }

  public fadeTo(alpha: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== F) {
      this.transitionAlpha.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = F
    }
    this.transitionAlpha.transitionTo(alpha, duration, ease)
    return this
  }

  public rotateTo(degree: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== R) {
      this.transitionRotate.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = R
    }
    this.transitionRotate.transitionTo(degree, duration, ease)
    return this
  }

  public scaleYTo(y: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SY) {
      this.transitionScaleY.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = SY
    }
    this.transitionScaleY.transitionTo(y, duration, ease)
    return this
  }

  public scaleXTo(x: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SX) {
      this.transitionScaleX.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = SX
    }
    this.transitionScaleX.transitionTo(x, duration, ease)
    return this
  }

  public scaleTo(scale: vec2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== S) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionScaleX.setStartTime(time)
      this.transitionScaleY.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = S
    }
    this.transitionScaleX.transitionTo(scale[0], duration, ease)
    this.transitionScaleY.transitionTo(scale[1], duration, ease)
    return this
  }

  public colorTo(color: Color4, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== C) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionColorR.setStartTime(time)
      this.transitionColorG.setStartTime(time)
      this.transitionColorB.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = C
    }
    this.transitionColorR.transitionTo(color[0], duration, ease)
    this.transitionColorG.transitionTo(color[1], duration, ease)
    this.transitionColorB.transitionTo(color[2], duration, ease)
    return this
  }

  public widthTo(w: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== W) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionWidth.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = W
    }
    this.transitionWidth.transitionTo(w, duration, ease)
    return this
  }

  public heightTo(h: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== H) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionHeight.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = H
    }
    this.transitionHeight.transitionTo(h, duration, ease)
    return this
  }

  public sizeTo(size: vec2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SIZE) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionWidth.setStartTime(time)
      this.transitionHeight.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = SIZE
    }
    this.transitionWidth.transitionTo(size[0], duration, ease)
    this.transitionHeight.transitionTo(size[1], duration, ease)
    return this
  }

  public updateTransform() {
    const time = Time.currentTime
    this.transitionX.update(time)
    this.transitionY.update(time)
    this.transitionScaleX.update(time)
    this.transitionScaleY.update(time)
    this.transitionAlpha.update(time)
    this.transitionRotate.update(time)
    this.transitionColorR.update(time)
    this.transitionColorG.update(time)
    this.transitionColorB.update(time)
    this.transitionWidth.update(time)
    this.transitionHeight.update(time)
  }

}