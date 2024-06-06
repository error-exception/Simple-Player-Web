import {Matrix3} from "./Matrix3";
import {Vector2} from "./Vector2";
import {MatrixUtils} from "./MatrixUtils";
import {degreeToRadian} from "../../Utils";

// 先进行缩放操作，然后是旋转，最后才是位移，

// 乘法顺序（从左到右）平移 旋转 缩放
export class TransformUtils {

    public static rotate(radian: number): Matrix3 {
        const cos = Math.cos(radian),
            sin = Math.sin(radian)
        const matrix = Matrix3.newIdentify()
        matrix.M11 = cos
        matrix.M12 = -sin
        matrix.M21 = sin
        matrix.M22 = cos
        return matrix
    }

    public static translate(translateX: number, translateY: number): Matrix3 {
        const matrix = Matrix3.newIdentify()
        matrix.M13 = translateX
        matrix.M23 = translateY
        return matrix
    }

    public static scale(scaleX: number, scaleY: number): Matrix3 {
        const matrix = Matrix3.newIdentify()
        matrix.M11 = scaleX
        matrix.M22 = scaleY
        return matrix
    }

    public static orth(left: number, right: number, bottom: number, top: number, near: number, far: number): Float32Array {
        const mat4 = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        let x_orth = 2 / (right - left);
		    let y_orth = 2 / (top - bottom);
		    let z_orth = -2 / (far - near);

		    let tx = -(right + left) / (right - left);
		    let ty = -(top + bottom) / (top - bottom);
		    let tz = -(far + near) / (far - near);
        mat4[0] = x_orth
        mat4[1] = 0
        mat4[2] = 0
        mat4[3] = tx

        mat4[4] = 0
        mat4[5] = y_orth
        mat4[6] = 0
        mat4[7] = ty

        mat4[8] = 0
        mat4[9] = 0
        mat4[10] = z_orth
        mat4[11] = tz

        mat4[12] = 0
        mat4[13] = 0
        mat4[14] = 0
        mat4[15] = 1

        return mat4
    }

    public static apply(vec2: Vector2, matrix: Matrix3): Vector2 {
        const result = new Vector2()
        result.x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13
        result.y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23
        return result
    }

    public static applyScale(vec2: Vector2, scaleX: number, scaleY: number) {
        const matrix = TransformUtils.scale(scaleX, scaleY)
        return TransformUtils.apply(vec2, matrix)
    }

    public static applyScaleSelf(vec2: Vector2, scaleX: number, scaleY: number) {
        const matrix = TransformUtils.scale(scaleX, scaleY)
        TransformUtils.applySelf(vec2, matrix)
    }

    public static applyTranslate(vec2: Vector2, translateX: number, translateY: number) {
        const matrix = TransformUtils.translate(translateX, translateY)
        return TransformUtils.apply(vec2, matrix)
    }

    public static applyTranslateSelf(vec2: Vector2, translateX: number, translateY: number) {
        const matrix = TransformUtils.translate(translateX, translateY)
        TransformUtils.applySelf(vec2, matrix)
    }

    public static applyRotate(vec2: Vector2, radian: number) {
        const matrix = TransformUtils.rotate(radian)
        return TransformUtils.apply(vec2, matrix)
    }

    public static applySelf(vec2: Vector2, matrix: Matrix3) {
        const x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13
        const y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23
        vec2.x = x;
        vec2.y = y;
    }

    public transform(translate: Vector2, scale: Vector2, rotate: number): Matrix3 {
        const m3 = MatrixUtils.m3Multi(
          TransformUtils.translate(translate.x, translate.y),
          TransformUtils.rotate(degreeToRadian(rotate))
        )
        return MatrixUtils.m3Multi(m3, TransformUtils.scale(scale.x, scale.y))
    }

}