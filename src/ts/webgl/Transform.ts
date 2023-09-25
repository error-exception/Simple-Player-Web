import { Matrix3 } from "./core/Matrix3"
import { Vector2 } from "./core/Vector2"

export class Transform {

    public translate: Vector2 = new Vector2()
    public scale: Vector2 = new Vector2(1, 1)

    public alpha: number = 1

    public transformMatrix = Matrix3.newIdentify()

    public extractToMatrix(matrix4: Float32Array | number[]) {
        matrix4[0] = this.scale.x
        matrix4[5] = this.scale.y
        matrix4[3] = this.translate.x
        matrix4[7] = this.translate.y
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
}