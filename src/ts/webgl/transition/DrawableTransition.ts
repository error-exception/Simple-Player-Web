import {linear, TimeFunction} from "../../util/Easing";
import {Vector2} from "../core/Vector2";
import {ObjectTransition} from "./Transition";
import {Time} from "../../global/Time";
import {Transform} from "../base/Transform";

const M = 0, MX = 1, MY = 2, F = 3, R = 4, S = 5, SX = 6, SY = 7;

/**
 * 变换过渡类，每一种变换相互独立，
 */
export class DrawableTransition {

  // public x: number = 0
  // public y: number = 0
  // public scaleX: number = 1
  // public scaleY: number = 1
  // public alpha: number = 1
  // public rotate: number = 0

  protected transitionX: ObjectTransition
  protected transitionY: ObjectTransition
  protected transitionScaleX: ObjectTransition
  protected transitionScaleY: ObjectTransition
  protected transitionAlpha: ObjectTransition
  protected transitionRotate: ObjectTransition

  private transitionDelay = 0
  private transformType = -1

  constructor(public transform: Transform) {
    this.transitionX = new ObjectTransition(transform.translate, 'x')
    this.transitionY = new ObjectTransition(transform.translate, 'y')
    this.transitionScaleX = new ObjectTransition(transform.scale, 'x')
    this.transitionScaleY = new ObjectTransition(transform.scale, 'y')
    this.transitionAlpha = new ObjectTransition(transform, 'alpha')
    this.transitionRotate = new ObjectTransition(transform, 'rotate')
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

  public update(transform: Transform) {
    // transform.translate.set(this.x, this.y)
    // transform.scale.set(this.scaleX, this.scaleY)
    // transform.alpha = this.alpha
    // transform.rotate = this.rotate
  }

  public updateTransform() {
    const time = Time.currentTime
    this.transitionX.update(time)
    this.transitionY.update(time)
    this.transitionScaleX.update(time)
    this.transitionScaleY.update(time)
    this.transitionAlpha.update(time)
    this.transitionRotate.update(time)
  }

}