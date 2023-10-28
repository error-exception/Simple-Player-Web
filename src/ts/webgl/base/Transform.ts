import { Matrix3 } from "../core/Matrix3"
import {Vector, Vector2} from "../core/Vector2"
import {MatrixUtils} from "../core/MatrixUtils";
import {degreeToRadian} from "../../Utils";

export class Transform {

    public translate: Vector2 = Vector()
    public scale: Vector2 = Vector(1)
    /** @todo to impl it */
    public skew = Vector()
    /** radian */
    public rotate = 0
    public alpha: number = 1

    public transformMatrix = Matrix3.newIdentify()

    public extractToMatrix(matrix4: Float32Array | number[]) {
        // matrix4[0] = this.scale.x
        // matrix4[5] = this.scale.y
        // matrix4[3] = this.translate.x
        // matrix4[7] = this.translate.y

        const sc = this.scale, t = this.translate, r = this.rotate;
        const scM4 = scaleM4(sc)
        const tM4 = translateM4(t)
        const rM4 = rotateM4(degreeToRadian(r))

        const m4 = MatrixUtils.m4Multi(tM4, rM4)
        MatrixUtils.m4MultiTo(m4, scM4, matrix4)
    }

    public translateTo(v: Vector2) {
        this.translate.set(v.x, v.y)
    }

    public scaleTo(v: Vector2) {
        this.scale.set(v.x, v.y)
    }

    public alphaTo(alpha: number) {
        this.alpha = alpha
    }

    public translateBy(v: Vector2) {
        this.translate.increment(v)
    }

    public alphaBy(alpha: number) {
        this.alpha *= alpha
    }

    public scaleBy(v: Vector2) {
        this.scale.x *= v.x
        this.scale.y *= v.y
    }

    public skewBy(v: Vector2) {
        this.skew.x += v.x
        this.skew.y += v.y
    }

    public skewTo(v: Vector2) {
        this.skew.x = v.x
        this.skew.y = v.y
    }

    public rotateTo(n: number) {
        this.rotate = n
    }

    public rotateBy(n: number) {
        this.rotate += n
    }
}

function scaleM4(scale: Vector2) {
    const m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
    m[0] = scale.x
    m[5] = scale.y
    return m
}

function translateM4(translate: Vector2) {
    const m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
    m[3] = translate.x
    m[7] = translate.y
    return m
}

function rotateM4(radian: number) {
    const m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
    const cos = Math.cos(radian), sin = Math.sin(radian);
    m[0] = cos
    m[1] = -sin
    m[4] = sin
    m[5] = cos
    return m
}