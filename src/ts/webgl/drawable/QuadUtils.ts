import {Quad} from "./Quad";
import type {Matrix3} from "../core/Matrix3";
import type {Rectangle} from "./Rectangle";
import {Vector2Utils} from "../core/Vector2Utils";

export class QuadUtils {

  public static apply(quad: Quad, matrix: Matrix3): Quad {
    const newQuad = new Quad()
    newQuad.setFrom(quad)
    this.applySelf(newQuad, matrix)
    return newQuad
  }

  public static applySelf(quad: Quad, matrix: Matrix3) {
    Vector2Utils.applySelf(quad.topLeft, matrix)
    Vector2Utils.applySelf(quad.bottomLeft, matrix)
    Vector2Utils.applySelf(quad.topRight, matrix)
    Vector2Utils.applySelf(quad.bottomRight, matrix)
  }

  public static applyTo(quad: Quad, matrix: Matrix3, out: Quad) {
    out.setFrom(quad)
    this.applySelf(out, matrix)
  }

  public static fromRectangle(rectangle: Rectangle): Quad {
    const quad = new Quad()
    this.fromRectangleTo(rectangle, quad)
    return quad
  }

  public static fromRectangleTo(rectangle: Rectangle, out: Quad) {
    out.topLeft.setFrom(rectangle.topLeft)
    out.bottomRight.setFrom(rectangle.bottomRight)
    out.topRight.set(rectangle.bottomRight.x, rectangle.topLeft.y)
    out.bottomLeft.set(rectangle.topLeft.x, rectangle.bottomRight.y)
  }

}