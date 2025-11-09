import { color, type Color4 } from "../base/Color";
import { vector2 } from "../graphic/matrix/vec2";

export class Transformable {

  public _translate: vec2 = vector2.create()
  public _scale: vec2 = vector2.fromValues(1, 1)
  public _rotate: number = 0
  public _color: Color4 = color.clone(color.Black)
  public _skew: vec2 = vector2.create()
  public _alpha: number = 1

  public get translate() {
    return vector2.clone(this._translate)
  }

  public set translate(t: vec2) {
    vector2.copy(this._translate, t)
  }

  public get scale() {
    return vector2.clone(this._scale)
  }

  public set scale(s: vec2) {
    vector2.copy(this._scale, s)
  }

  public get skew() {
    return this._skew
  }

  public set skew(s: vec2) {
    vector2.copy(this._skew, s)
  }

  public get color() {
    return color.clone(this._color)

  }

  public set color(c: Color4) {
    color.copy(this._color, c)
  }

  public get translateX() {
    return this._translate[0]
  }

  public set translateX(x: number) {
    this._translate[0] = x
  }

  public get translateY() {
    return this._translate[1]
  }

  public set translateY(y: number) {
    this._translate[1] = y
  }

  public get scaleX() {
    return this._scale[0]
  }

  public set scaleX(x: number) {
    this._scale[0] = x
  }  

  public get scaleY() {
    return this._scale[1]
  }

  public set scaleY(y: number) {
    this._scale[1] = y
  }

  public get colorR() {
    return this._color[0]
  }

  public set colorR(r: number) {
    this._color[0] = r
  }

  public get colorG() {
    return this._color[1]
  }

  public set colorG(g: number) {
    this._color[1] = g
  }

  public get colorB() {
    return this._color[2]
  }

  public set colorB(b: number) {
    this._color[2] = b
  }

  public get colorA() {
    return this._color[3]
  }

  public set colorA(a: number) {
    this._color[3] = a
  }

  public get alpha() {
    return this._alpha
  }

  public set alpha(a: number) {
    this._alpha = a
  }

  public get skewX() {
    return this._skew[0]
  }

  public set skewX(x: number) {
    this._skew[0] = x
  }

  public get skewY() {
    return this._skew[1]
  }
  public set skewY(y: number) {
    this._skew[1] = y
  }
  public get rotate() {
    return this._rotate
  }
  public set rotate(r: number) {
    this._rotate = r
  }

  public set width(w: number) {
    
  }
  public set height(h: number) {}

  public set size(size: vec2) {}

  public get width(): number {
    return 0
  }

  public get height(): number {
    return 0
  }
  public get size(): vec2 {
    return vector2.create()
  }

  public apply(block: (t: this) => void) {
    block(this)
    return this
  }

  public run<T>(block: (t: this) => T) {
    return block(this)
  }

}