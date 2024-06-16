import {linear, TimeFunction} from "../../util/Easing";
import {Vector2} from "../core/Vector2";
import {GetAndSetTransition} from "./Transition";
import {Time} from "../../global/Time";
import type {Color} from "../base/Color";
import type {Transformable} from "../drawable/Transformable";

const M = 0, MX = 1, MY = 2,
  F = 3, R = 4,
  S = 5, SX = 6, SY = 7,
  SK = 8, SKX = 9, SKY = 10, C = 11;

/**
 * 变换过渡类，每一种变换相互独立，
 */
export class DrawableTransition {

  protected transitionX: GetAndSetTransition
  protected transitionY: GetAndSetTransition
  protected transitionScaleX: GetAndSetTransition
  protected transitionScaleY: GetAndSetTransition
  transitionAlpha: GetAndSetTransition
  protected transitionRotate: GetAndSetTransition
  protected transitionSkewX: GetAndSetTransition
  protected transitionSkewY: GetAndSetTransition

  protected transitionColorR: GetAndSetTransition
  protected transitionColorG: GetAndSetTransition
  protected transitionColorB: GetAndSetTransition

  private transitionDelay = 0
  private transformType = -1

  constructor(public transform: Transformable) {
    this.transitionX = new GetAndSetTransition(
      () => transform.getTranslateX(), x => transform.setTranslateX(x)
    )
    this.transitionY = new GetAndSetTransition(
      () => transform.getTranslateY(), y => transform.setTranslateY(y)
    )
    this.transitionScaleX = new GetAndSetTransition(
      () => transform.getScaleX(), x => transform.setScaleX(x)
    )
    this.transitionScaleY = new GetAndSetTransition(
      () => transform.getScaleY(), y => transform.setScaleY(y)
    )
    this.transitionAlpha = new GetAndSetTransition(
      () => transform.getAlpha(), a => transform.setAlpha(a)
    )
    this.transitionRotate = new GetAndSetTransition(
      () => transform.getRotate(), r => transform.setRotate(r)
    )
    this.transitionSkewX = new GetAndSetTransition(
      () => transform.getSkewX(), x => transform.setSkewX(x)
    )
    this.transitionSkewY = new GetAndSetTransition(
      () => transform.getSkewY(), y => transform.setSkewY(y)
    )

    this.transitionColorR = new GetAndSetTransition(
      () => transform.getColorR(), r => transform.setColorR(r)
    )
    this.transitionColorG = new GetAndSetTransition(
      () => transform.getColorG(), g => transform.setColorG(g)
    )
    this.transitionColorB = new GetAndSetTransition(
      () => transform.getColorB(), b => transform.setColorB(b)
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

  public moveTo(v: Vector2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== M) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionX.setStartTime(time)
      this.transitionY.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = M
    }
    this.transitionX.transitionTo(v.x, duration, ease)
    this.transitionY.transitionTo(v.y, duration, ease)
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

  public scaleTo(scale: Vector2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== S) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionScaleX.setStartTime(time)
      this.transitionScaleY.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = S
    }
    this.transitionScaleX.transitionTo(scale.x, duration, ease)
    this.transitionScaleY.transitionTo(scale.y, duration, ease)
    return this
  }

  public skewTo(skew: Vector2, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SK) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionSkewX.setStartTime(time)
      this.transitionSkewY.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = SK
    }
    this.transitionSkewX.transitionTo(skew.x, duration, ease)
    this.transitionSkewY.transitionTo(skew.y, duration, ease)
    return this
  }

  public skewXTo(skewX: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SKX) {
      this.transitionSkewX.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = SKX
    }
    this.transitionSkewX.transitionTo(skewX, duration, ease)
    return this
  }

  public skewYTo(skewY: number, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== SKY) {
      this.transitionSkewY.setStartTime(Time.currentTime + this.transitionDelay)
      this.transitionDelay = 0
      this.transformType = SKY
    }
    this.transitionSkewY.transitionTo(skewY, duration, ease)
    return this
  }

  public colorTo(color: Color, duration: number, ease: TimeFunction = linear) {
    if (this.transformType !== C) {
      const time = Time.currentTime + this.transitionDelay
      this.transitionColorR.setStartTime(time)
      this.transitionColorG.setStartTime(time)
      this.transitionColorB.setStartTime(time)
      this.transitionDelay = 0
      this.transformType = C
    }
    this.transitionColorR.transitionTo(color.red, duration, ease)
    this.transitionColorG.transitionTo(color.green, duration, ease)
    this.transitionColorB.transitionTo(color.blue, duration, ease)
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
    this.transitionSkewX.update(time)
    this.transitionSkewY.update(time)
    this.transitionColorR.update(time)
    this.transitionColorG.update(time)
    this.transitionColorB.update(time)
  }

}