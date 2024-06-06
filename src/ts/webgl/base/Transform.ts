import { Matrix3 } from "../core/Matrix3"
import {Vector, Vector2} from "../core/Vector2"
import {MatrixUtils} from "../core/MatrixUtils";
import {degreeToRadian} from "../../Utils";
import {TransformUtils} from "../core/TransformUtils";
import {Color} from "./Color";

export class Transform {

    public static emptyTransform = new Transform()

    private translateMatrix4 = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    private rotateMatrix4 = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    private scaleMatrix4 = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])

    public translate: Vector2 = Vector()
    public scale: Vector2 = Vector(1)
    /** @todo to impl it */
    public skew = Vector()
    /** radian */
    public rotate = 0
    public alpha: number = 1
    public color = Color.Black.copy()
    public transformMatrix = Matrix3.newIdentify()

    /**
     * @deprecated
     */
    public extractToMatrix4(matrix4: Float32Array | number[]) {
        const sc = this.scale, t = this.translate, r = this.rotate;
        this.scaleMatrix4[0] = sc.x
        this.scaleMatrix4[5] = sc.y
        this.translateMatrix4[3] = t.x
        this.translateMatrix4[7] = t.y

        const radian = degreeToRadian(r)
        const cos = Math.cos(radian), sin = Math.sin(radian);
        this.rotateMatrix4[0] = cos
        this.rotateMatrix4[1] = -sin
        this.rotateMatrix4[4] = sin
        this.rotateMatrix4[5] = cos

        const m4 = MatrixUtils.m4Multi(this.translateMatrix4, this.rotateMatrix4)
        MatrixUtils.m4MultiTo(m4, this.scaleMatrix4, matrix4)
    }

    /**
     * @deprecated
     */
    public extractToMatrix3(matrix3: Matrix3) {
        const sc = this.scale, t = this.translate, r = this.rotate;
        const scM3 = TransformUtils.scale(sc.x, sc.y)
        const tM3 = TransformUtils.translate(t.x, t.y)
        const rM3 = TransformUtils.rotate(degreeToRadian(r))

        const m3 = MatrixUtils.m3Multi(tM3, rM3)
        MatrixUtils.m3MultiTo(m3, scM3, matrix3)
    }

    /**
     * @deprecated
     */
    public translateTo(v: Vector2) {
        this.translate.set(v.x, v.y)
    }

    /**
     * @deprecated
     */
    public scaleTo(v: Vector2) {
        this.scale.set(v.x, v.y)
    }

    public alphaTo(alpha: number) {
        this.alpha = alpha
    }

    /**
     * @deprecated
     */
    public translateBy(v: Vector2) {
        this.translate.increment(v)
    }

    public alphaBy(alpha: number) {
        this.alpha *= alpha
    }

    /**
     * @deprecated
     */
    public scaleBy(v: Vector2) {
        this.scale.x *= v.x
        this.scale.y *= v.y
    }

    /**
     * @deprecated
     */
    public skewBy(v: Vector2) {
        this.skew.x += v.x
        this.skew.y += v.y
    }

    /**
     * @deprecated
     */
    public skewTo(v: Vector2) {
        this.skew.x = v.x
        this.skew.y = v.y
    }

    /**
     * @deprecated
     */
    public rotateTo(n: number) {
        this.rotate = n
    }

    /**
     * @deprecated
     */
    public rotateBy(n: number) {
        this.rotate += n
    }
}

// function scaleM4(scale: Vector2) {
//     const m = [
//         1, 0, 0, 0,
//         0, 1, 0, 0,
//         0, 0, 1, 0,
//         0, 0, 0, 1
//     ]
//     m[0] = scale.x
//     m[5] = scale.y
//     return m
// }
//
// function translateM4(translate: Vector2) {
//     const m = [
//         1, 0, 0, 0,
//         0, 1, 0, 0,
//         0, 0, 1, 0,
//         0, 0, 0, 1
//     ]
//     m[3] = translate.x
//     m[7] = translate.y
//     return m
// }
//
// function rotateM4(radian: number) {
//     const m = [
//         1, 0, 0, 0,
//         0, 1, 0, 0,
//         0, 0, 1, 0,
//         0, 0, 0, 1
//     ]
//     const cos = Math.cos(radian), sin = Math.sin(radian);
//     m[0] = cos
//     m[1] = -sin
//     m[4] = sin
//     m[5] = cos
//     return m
// }