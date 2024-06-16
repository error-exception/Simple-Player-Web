import {Vector2} from "./Vector2";
import type {Matrix3} from "./Matrix3";

export class Vector2Utils {

  public static middle(v1: Vector2, v2: Vector2) {
    return new Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)
  }

  public static middleTo(v1: Vector2, v2: Vector2, out: Vector2) {
    out.set((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)
  }

  public static apply(v: Vector2, matrix: Matrix3): Vector2 {
    const vector2 = new Vector2()
    this.applySelf(vector2, matrix)
    return vector2
  }

  public static applySelf(vec2: Vector2, matrix: Matrix3) {
    const x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13
    const y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23
    vec2.x = x;
    vec2.y = y;
  }

}