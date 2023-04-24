import {Matrix3} from "./Matrix3";

export class MatrixUtils {

    public static multi(mt1: Matrix3, mt2: Matrix3): Matrix3 {
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

}

