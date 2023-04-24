import {Matrix3} from "./Matrix3";
import {Vector2} from "./Vector2";

// 先进行缩放操作，然后是旋转，最后才是位移，

// 乘法顺序（从左到右）平移 旋转 缩放
export class TransformUtils {

    public static rotate(radius: number): Matrix3 {
        const cos = Math.cos(radius),
            sin = Math.sin(radius)
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

    public static apply(vec2: Vector2, matrix: Matrix3): Vector2 {
        const result = new Vector2()
        result.x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13
        result.y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23
        return result
    }

}