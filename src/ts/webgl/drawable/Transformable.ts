import {Vector2} from "../core/Vector2";
import {Color} from "../base/Color";

export class Transformable {

  public _translate: Vector2 = Vector2.newZero()
  public _scale: Vector2 = Vector2.newOne()
  public _rotate: number = 0
  public _color: Color = Color.Black.copy()
  public _skew: Vector2 = Vector2.newZero()

  getTranslate() {
    return this._translate.copy()
  }

  setTranslate(t: Vector2) {
    this._translate.setFrom(t)
  }

  getScale() {
    return this._scale.copy()
  }

  setScale(s: Vector2) {
    this._scale.setFrom(s)
  }

  getSkew() {
    return this._skew
  }

  setSkew(s: Vector2) {
    this._skew.setFrom(s)
  }

  getColor() {
    return this._color.copy()
  }

  setColor(c: Color) {
    this._color.red = c.red
    this._color.green = c.green
    this._color.blue = c.blue
  }

  getTranslateX() {
    return this._translate.x
  }

  setTranslateX(x: number) {
    this._translate.x = x
  }

  getTranslateY() {
    return this._translate.y
  }

  setTranslateY(y: number) {
    this._translate.y = y
  }

  getScaleX() {
    return this._scale.x
  }

  setScaleX(x: number) {
    this._scale.x = x
  }

  getScaleY() {
    return this._scale.y
  }

  setScaleY(y: number) {
    this._scale.y = y
  }

  getColorR() {
    return this._color.red
  }

  setColorR(r: number) {
    this._color.red = r
  }

  getColorG() {
    return this._color.green
  }

  setColorG(g: number) {
    this._color.green = g
  }

  getColorB() {
    return this._color.blue
  }

  setColorB(b: number) {
    this._color.blue = b
  }

  getAlpha() {
    return this._color.alpha
  }

  setAlpha(a: number) {
    this._color.alpha = a
  }

  getSkewX() {
    return this._skew.x
  }

  setSkewX(x: number) {
    this._skew.x = x
  }

  getSkewY() {
    return this._skew.y
  }

  setSkewY(y: number) {
    this._skew.y = y
  }

  getRotate() {
    return this._rotate
  }

  setRotate(r: number) {
    this._rotate = r
  }

  public apply(block: (t: this) => void) {
    block(this)
    return this
  }

  public run<T>(block: (t: this) => T) {
    return block(this)
  }
}