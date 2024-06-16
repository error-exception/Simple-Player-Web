import {Rectangle} from "./Rectangle";
import type {Matrix3} from "../core/Matrix3";
import {Vector2Utils} from "../core/Vector2Utils";

export class RectangleUtils {

  public static apply(rectangle: Rectangle, matrix: Matrix3): Rectangle {
    const newRectangle = new Rectangle()
    newRectangle.setFrom(rectangle)
    this.applySelf(newRectangle, matrix)
    return newRectangle
  }

  public static applySelf(rectangle: Rectangle, matrix: Matrix3) {
    Vector2Utils.applySelf(rectangle.topLeft, matrix)
    Vector2Utils.applySelf(rectangle.bottomRight, matrix)
  }

  public static applyTo(rectangle: Rectangle, matrix: Matrix3, out: Rectangle) {
    out.setFrom(rectangle)
    this.applySelf(out, matrix)
  }

}