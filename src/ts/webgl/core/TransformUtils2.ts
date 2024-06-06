import type {Matrix3} from "./Matrix3";
import type {Vector2} from "./Vector2";
import {degreeToRadian} from "../../Utils";

/**
 * 受到 osu.framework 的 MatrixExtension.cs 的启发，对变换进行优化
 * 平移向量对应的矩阵
 * [1, 0, x]
 * [0, 1, y]
 * [0, 0, 1]
 */
export class TransformUtils2 {

  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param v
   */
  public static translateFromLeft(m: Matrix3, v: Vector2) {
    // m.row0 += m.row2 * v.x
    m.M11 += m.M31 * v.x
    m.M12 += m.M32 * v.x
    m.M13 += m.M33 * v.x
    // m.row1 += m.row2 * v.y
    m.M21 += m.M31 * v.y
    m.M22 += m.M32 * v.y
    m.M23 += m.M33 * v.y
  }

  public static rotateFromLeft(m: Matrix3, degree: number) {
    const radian = degreeToRadian(degree)
    const cos = Math.cos(radian),
      sin = Math.sin(radian)
    const m11 = m.M11 * cos + (-sin) * m.M21
    const m12 = m.M12 * cos + (-sin) * m.M22
    const m13 = m.M13 * cos + (-sin) * m.M23

    const m21 = m.M11 * sin + m.M21 * cos
    const m22 = m.M12 * sin + m.M22 * cos
    const m23 = m.M13 * sin + m.M23 * cos
    m.M11 = m11
    m.M12 = m12
    m.M13 = m13

    m.M21 = m21
    m.M22 = m22
    m.M23 = m23
  }

  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param s
   */
  public static scaleFromLeft(m: Matrix3, s: Vector2) {
    // m.row0 *= s.x
    m.M11 *= s.x
    m.M12 *= s.x
    m.M13 *= s.x
    // m.row1 *= s.y
    m.M21 *= s.y
    m.M22 *= s.y
    m.M23 *= s.y
  }

  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param s
   */
  public static skewFromLeft(m: Matrix3, s: Vector2) {

    const m11 = m.M21 * s.x + m.M11
    const m12 = m.M22 * s.x + m.M12
    const m13 = m.M23 * s.x + m.M13
    const m21 = m.M11 * s.y + m.M21
    const m22 = m.M12 * s.y + m.M22
    const m23 = m.M13 * s.y + m.M23
    m.M11 = m11
    m.M12 = m12
    m.M13 = m13
    m.M21 = m21
    m.M22 = m22
    m.M23 = m23
  }

  public static applyTo(m: Matrix3, v: Vector2, out: Float32Array | number[], offset: number = 0) {
    const x = v.x * m.M11 + v.y * m.M12 + m.M13
    const y = v.x * m.M21 + v.y * m.M22 + m.M23
    out[offset] = x
    out[offset + 1] = y
  }

}