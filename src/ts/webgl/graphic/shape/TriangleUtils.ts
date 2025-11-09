import {Triangle} from "./Triangle";
import type {Matrix3} from "../core/Matrix3";
import {Vector2Utils} from "../core/Vector2Utils";

export class TriangleUtils {

  public static apply(triangle: Triangle, matrix: Matrix3) {
    const newTriangle = new Triangle()
    this.applyTo(triangle, matrix, newTriangle)
    return newTriangle
  }

  public static applySelf(triangle: Triangle, matrix: Matrix3) {
    Vector2Utils.applySelf(triangle.angle1, matrix)
    Vector2Utils.applySelf(triangle.angle2, matrix)
    Vector2Utils.applySelf(triangle.angle3, matrix)
  }

  public static applyTo(triangle: Triangle, matrix: Matrix3, out: Triangle) {
    out.setFrom(triangle)
    this.applySelf(out, matrix)
  }

}