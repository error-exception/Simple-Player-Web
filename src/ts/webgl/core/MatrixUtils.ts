import {Matrix3} from "./Matrix3";

export class MatrixUtils {

  public static m3Multi(mt1: Matrix3, mt2: Matrix3): Matrix3 {
    return this.m3MultiTo(mt1, mt2, new Matrix3())
  }

  public static m3MultiTo(mt1: Matrix3, mt2: Matrix3, result: Matrix3) {
    result.M11 = mt1.M11 * mt2.M11 + mt1.M12 * mt2.M21 + mt1.M13 * mt2.M31
    result.M12 = mt1.M11 * mt2.M12 + mt1.M12 * mt2.M22 + mt1.M13 * mt2.M32
    result.M13 = mt1.M11 * mt2.M13 + mt1.M12 * mt2.M23 + mt1.M13 * mt2.M33

    result.M21 = mt1.M21 * mt2.M11 + mt1.M22 * mt2.M21 + mt1.M23 * mt2.M31
    result.M22 = mt1.M21 * mt2.M12 + mt1.M22 * mt2.M22 + mt1.M23 * mt2.M32
    result.M23 = mt1.M21 * mt2.M13 + mt1.M22 * mt2.M23 + mt1.M23 * mt2.M33

    result.M31 = mt1.M31 * mt2.M11 + mt1.M32 * mt2.M21 + mt1.M33 * mt2.M31
    result.M32 = mt1.M31 * mt2.M12 + mt1.M32 * mt2.M22 + mt1.M33 * mt2.M32
    result.M33 = mt1.M31 * mt2.M13 + mt1.M32 * mt2.M23 + mt1.M33 * mt2.M33

    return result
  }

  public static m3MultiToArray(mt1: Matrix3, mt2: Matrix3, result: Float32Array | number[]) {
    result[0] = mt1.M11 * mt2.M11 + mt1.M12 * mt2.M21 + mt1.M13 * mt2.M31
    result[1] = mt1.M11 * mt2.M12 + mt1.M12 * mt2.M22 + mt1.M13 * mt2.M32
    result[2] = mt1.M11 * mt2.M13 + mt1.M12 * mt2.M23 + mt1.M13 * mt2.M33

    result[3] = mt1.M21 * mt2.M11 + mt1.M22 * mt2.M21 + mt1.M23 * mt2.M31
    result[4] = mt1.M21 * mt2.M12 + mt1.M22 * mt2.M22 + mt1.M23 * mt2.M32
    result[5] = mt1.M21 * mt2.M13 + mt1.M22 * mt2.M23 + mt1.M23 * mt2.M33

    result[6] = mt1.M31 * mt2.M11 + mt1.M32 * mt2.M21 + mt1.M33 * mt2.M31
    result[7] = mt1.M31 * mt2.M12 + mt1.M32 * mt2.M22 + mt1.M33 * mt2.M32
    result[8] = mt1.M31 * mt2.M13 + mt1.M32 * mt2.M23 + mt1.M33 * mt2.M33

    return result
  }

  public static m4Multi(mt1: number[] | Float32Array, mt2: number[] | Float32Array) {
    const result = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    this.m4MultiTo(mt1, mt2, result)
    return result
  }

  public static m4MultiTo(mt1: number[] | Float32Array, mt2: number[] | Float32Array, result: number[] | Float32Array) {
    result[0] = mt1[0] * mt2[0] + mt1[1] * mt2[1] + mt1[2] * mt2[2] + mt1[3] * mt2[3]
    result[1] = mt1[0] * mt2[4] + mt1[1] * mt2[5] + mt1[2] * mt2[6] + mt1[3] * mt2[7]
    result[2] = mt1[0] * mt2[8] + mt1[1] * mt2[9] + mt1[2] * mt2[10] + mt1[3] * mt2[11]
    result[3] = mt1[0] * mt2[12] + mt1[1] * mt2[13] + mt1[2] * mt2[14] + mt1[3] * mt2[15]

    result[4] = mt1[4] * mt2[0] + mt1[5] * mt2[1] + mt1[6] * mt2[2] + mt1[7] * mt2[3]
    result[5] = mt1[4] * mt2[4] + mt1[5] * mt2[5] + mt1[6] * mt2[6] + mt1[7] * mt2[7]
    result[6] = mt1[4] * mt2[8] + mt1[5] * mt2[9] + mt1[6] * mt2[10] + mt1[7] * mt2[11]
    result[7] = mt1[4] * mt2[12] + mt1[5] * mt2[13] + mt1[6] * mt2[14] + mt1[7] * mt2[15]

    result[8] = mt1[8] * mt2[0] + mt1[9] * mt2[1] + mt1[10] * mt2[2] + mt1[11] * mt2[3]
    result[9] = mt1[8] * mt2[4] + mt1[9] * mt2[5] + mt1[10] * mt2[6] + mt1[11] * mt2[7]
    result[10] = mt1[8] * mt2[8] + mt1[9] * mt2[9] + mt1[10] * mt2[10] + mt1[11] * mt2[11]
    result[11] = mt1[8] * mt2[12] + mt1[9] * mt2[13] + mt1[10] * mt2[14] + mt1[11] * mt2[15]

    result[12] = mt1[12] * mt2[0] + mt1[13] * mt2[1] + mt1[14] * mt2[2] + mt1[15] * mt2[3]
    result[13] = mt1[12] * mt2[4] + mt1[13] * mt2[5] + mt1[14] * mt2[6] + mt1[15] * mt2[7]
    result[14] = mt1[12] * mt2[8] + mt1[13] * mt2[9] + mt1[14] * mt2[10] + mt1[15] * mt2[11]
    result[15] = mt1[12] * mt2[12] + mt1[13] * mt2[13] + mt1[14] * mt2[14] + mt1[15] * mt2[15]

    return result
  }

  public static toInverse(m: Matrix3): Matrix3 {
    const matrix = new Matrix3()
    const v = m.M11 * m.M22 * m.M33 +
      m.M12 * m.M23 * m.M31 +
      m.M13 * m.M21 * m.M32 -(
        m.M11 * m.M23 * m.M32 +
        m.M12 * m.M21 * m.M33 +
        m.M13 * m.M22 * m.M31)

    if (v === 0) {
      throw new Error('this matrix does not exists inverse matrix')
    }

    const v11 = m.M22 * m.M33 - m.M23 * m.M32
    const v12 = m.M21 * m.M33 - m.M23 * m.M31
    const v13 = m.M21 * m.M32 - m.M22 * m.M31

    const v21 = m.M12 * m.M33 - m.M13 * m.M32
    const v22 = m.M11 * m.M33 - m.M13 * m.M31
    const v23 = m.M11 * m.M32 - m.M12 * m.M31

    const v31 = m.M12 * m.M23 - m.M13 * m.M22
    const v32 = m.M11 * m.M23 - m.M13 * m.M21
    const v33 = m.M11 * m.M22 - m.M12 * m.M21

    matrix.M11 = v11 / v
    matrix.M12 = -v21 / v
    matrix.M13 = v31 / v

    matrix.M21 = -v12 / v
    matrix.M22 = v22 / v
    matrix.M23 = -v32 / v

    matrix.M31 = v13 / v
    matrix.M32 = -v23 / v
    matrix.M33 = v33 / v

    return matrix
  }

  public static inverseSelf(m: Matrix3) {
    const v = m.M11 * m.M22 * m.M33 +
      m.M12 * m.M23 * m.M31 +
      m.M13 * m.M21 * m.M32 -(
        m.M11 * m.M23 * m.M32 +
        m.M12 * m.M21 * m.M33 +
        m.M13 * m.M22 * m.M31)

    if (v === 0) {
      throw new Error('this matrix does not exists inverse matrix')
    }

    const v11 = m.M22 * m.M33 - m.M23 * m.M32
    const v12 = m.M21 * m.M33 - m.M23 * m.M31
    const v13 = m.M21 * m.M32 - m.M22 * m.M31

    const v21 = m.M12 * m.M33 - m.M13 * m.M32
    const v22 = m.M11 * m.M33 - m.M13 * m.M31
    const v23 = m.M11 * m.M32 - m.M12 * m.M31

    const v31 = m.M12 * m.M23 - m.M13 * m.M22
    const v32 = m.M11 * m.M23 - m.M13 * m.M21
    const v33 = m.M11 * m.M22 - m.M12 * m.M21

    m.M11 = v11 / v
    m.M12 = -v21 / v
    m.M13 = v31 / v

    m.M21 = -v12 / v
    m.M22 = v22 / v
    m.M23 = -v32 / v

    m.M31 = v13 / v
    m.M32 = -v23 / v
    m.M33 = v33 / v
  }

  public static inverseTo(m: Matrix3, out: Matrix3) {
    const v = m.M11 * m.M22 * m.M33 +
      m.M12 * m.M23 * m.M31 +
      m.M13 * m.M21 * m.M32 -(
        m.M11 * m.M23 * m.M32 +
        m.M12 * m.M21 * m.M33 +
        m.M13 * m.M22 * m.M31)

    if (v === 0) {
      throw new Error('this matrix does not exists inverse matrix')
    }

    const v11 = m.M22 * m.M33 - m.M23 * m.M32
    const v12 = m.M21 * m.M33 - m.M23 * m.M31
    const v13 = m.M21 * m.M32 - m.M22 * m.M31

    const v21 = m.M12 * m.M33 - m.M13 * m.M32
    const v22 = m.M11 * m.M33 - m.M13 * m.M31
    const v23 = m.M11 * m.M32 - m.M12 * m.M31

    const v31 = m.M12 * m.M23 - m.M13 * m.M22
    const v32 = m.M11 * m.M23 - m.M13 * m.M21
    const v33 = m.M11 * m.M22 - m.M12 * m.M21

    out.M11 = v11 / v
    out.M12 = -v21 / v
    out.M13 = v31 / v

    out.M21 = -v12 / v
    out.M22 = v22 / v
    out.M23 = -v32 / v

    out.M31 = v13 / v
    out.M32 = -v23 / v
    out.M33 = v33 / v
  }
}

