import type {Matrix3} from "./Matrix3";
import {Vector2} from "./Vector2";
import {degreeToRadian} from "../../../Utils";

/**
 * 受到 osu.framework 的 MatrixExtension.cs 的启发，对变换进行优化
 * left 和 right 指的是 Vector2 对应的矩阵
 */
export class TransformUtils2 {

  public static translateFromLeft(m: Matrix3, v: Vector2) {
    m.M31 += m.M11 * v.x + m.M21 * v.y
    m.M32 += m.M12 * v.x + m.M22 * v.y
    m.M33 += m.M13 * v.x + m.M23 * v.y
  }

  public static translateFromRight(m: Matrix3, v: Vector2) {
    m.M11 += m.M13 * v.x;
    m.M21 += m.M23 * v.x;
    m.M31 += m.M33 * v.x;

    //m.Column1 += m.Column2 * v.Y;
    m.M12 += m.M13 * v.y;
    m.M22 += m.M23 * v.y;
    m.M32 += m.M33 * v.y;
  }

  public static rotateFromLeft(m: Matrix3, radian: number) {
    // const radian = degreeToRadian(degree)
    // const cos = Math.cos(radian),
    //   sin = Math.sin(radian)
    //
    // const m11 = m.M11 * cos + m.M21 * sin
    // const m12 = m.M12 * cos + m.M22 * sin
    // const m13 = m.M13 * cos + m.M23 * sin
    //
    // m.M21 = m.M21 * cos - m.M11 * sin
    // m.M22 = m.M22 * cos - m.M12 * sin
    // m.M23 = m.M23 * cos - m.M13 * sin
    //
    // m.M11 = m11
    // m.M12 = m12
    // m.M13 = m13

    // const cos = Math.cos(radian);
    // const sin = Math.sin(radian);
    //
    // // 缓存原始值
    // const m11 = m.M11, m12 = m.M12, m13 = m.M13;
    // const m21 = m.M21, m22 = m.M22, m23 = m.M23;
    //
    // // 直接旋转矩阵的值
    // m.M11 = m11 * cos + m21 * sin;
    // m.M12 = m12 * cos + m22 * sin;
    // m.M13 = m13 * cos + m23 * sin;
    //
    // m.M21 = m21 * cos - m11 * sin;
    // m.M22 = m22 * cos - m12 * sin;
    // m.M23 = m23 * cos - m13 * sin;

    const c = Math.cos(radian);
    const s = Math.sin(radian);

    // 临时保存原矩阵值
    const m11 = m.M11, m12 = m.M12;
    const m21 = m.M21, m22 = m.M22;
    const m31 = m.M31, m32 = m.M32;

    // 矩阵乘法：旋转矩阵 × 原矩阵
    m.M11 = c * m11 - s * m21;
    m.M12 = c * m12 - s * m22;
    m.M21 = s * m11 + c * m21;
    m.M22 = s * m12 + c * m22;
    m.M31 = c * m31 - s * m32;
    m.M32 = s * m31 + c * m32;
  }

  public static rotateFromRight(m: Matrix3, radian: number) {
    // const radian = degreeToRadian(degree)
    const cos = Math.cos(radian),
      sin = Math.sin(radian)

    const m11 = m.M11 * cos - m.M12 * sin;
    const m21 = m.M21 * cos - m.M22 * sin;
    const m31 = m.M31 * cos - m.M32 * sin;

    //m.Column1 = m.Column1 * cos - m.Column0 * sin;
    m.M12 = m.M12 * cos + m.M11 * sin;
    m.M22 = m.M22 * cos + m.M21 * sin;
    m.M32 = m.M32 * cos + m.M31 * sin;

    //m.Column0 = row0;
    m.M11 = m11;
    m.M21 = m21;
    m.M31 = m31;
  }

  public static scaleFromLeft(m: Matrix3, s: Vector2) {
    m.M11 *= s.x
    m.M12 *= s.x
    m.M13 *= s.x

    m.M21 *= s.y
    m.M22 *= s.y
    m.M23 *= s.y
  }

  public static scaleFromRight(m: Matrix3, s: Vector2) {
    m.M11 *= s.x;
    m.M21 *= s.x;
    m.M31 *= s.x;

    //m.Column1 *= v.Y;
    m.M12 *= s.y;
    m.M22 *= s.y;
    m.M32 *= s.y;
  }

  public static skewFromLeft(m: Matrix3, s: Vector2) {
    const m11 = m.M11 + m.M21 * s.y + m.M11 * s.x * s.y
    const m12 = m.M12 + m.M22 * s.y + m.M12 * s.x * s.y
    const m13 = m.M13 + m.M23 * s.y + m.M13 * s.x * s.y

    m.M21 += m.M11 * s.x
    m.M22 += m.M12 * s.x
    m.M23 += m.M13 * s.x

    m.M11 = m11
    m.M12 = m12
    m.M13 = m13
  }

  public static skewFromRight(m: Matrix3, s: Vector2) {
    const xy = s.x * s.y;

    //m.Column0 += m.Column1 * v.X;
    const m11 = m.M11 + m.M12 * s.x;
    const m21 = m.M21 + m.M22 * s.x;
    const m31 = m.M31 + m.M32 * s.x;

    //m.Column1 += m.Column0 * v.Y + m.Column1 * xy;
    m.M12 += m.M11 * s.y + m.M12 * xy;
    m.M22 += m.M21 * s.y + m.M22 * xy;
    m.M32 += m.M31 * s.y + m.M32 * xy;

    m.M11 = m11;
    m.M21 = m21;
    m.M31 = m31;
  }

  public static applyTo(m: Matrix3, v: Vector2, out: Float32Array | number[], offset: number = 0, origin?: Vector2) {
    const originX = origin?.x ?? 0
    const originY = origin?.y ?? 0
    const x = v.x - originX
    const y = v.y - originY
    out[offset] = x * m.M11 + y * m.M12 + m.M13 + originX
    out[offset + 1] = x * m.M21 + y * m.M22 + m.M23 + originY
  }

  public static applyTransform(
    m: Matrix3,
    translate: Vector2,
    rotate: number,
    scale: Vector2,
    skew: Vector2,
    origin: Vector2
  ) {
    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin.negative())
    }
    if (!translate.isZero()) {
      TransformUtils2.translateFromLeft(m, translate)
    }
    if (rotate !== 0) {
      const radian = degreeToRadian(rotate)
      TransformUtils2.rotateFromLeft(m, radian)
    }
    if (!skew.isZero()) {
      TransformUtils2.skewFromLeft(m, skew.negative())
    }
    if (!scale.equals(Vector2.one)) {
      TransformUtils2.scaleFromLeft(m, scale)
    }

    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin)
    }
  }

}