import {Matrix3} from "./Matrix3";

export class MatrixUtils {

    public static m3Multi(mt1: Matrix3, mt2: Matrix3): Matrix3 {
        const result = new Matrix3()

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

}

