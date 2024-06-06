import {TransformUtils} from "../core/TransformUtils"
import {Vector, type Vector2} from "../core/Vector2";

class Coordinate {

    public static readonly MAX_WIDTH = 1280
    public size: Vector2 = Vector()
    public nativeSize = Vector()
    public resolution = Vector()

    public onWindowResize: (() => void) | null = null;

    public orthographicProjectionMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public center = Vector()
    public ratio = 1
    public updateCoordinate(width: number, height: number) {
        console.log("window resize", width, height);
        this.nativeSize.set(width, height)

        this.ratio = Coordinate.MAX_WIDTH / width

        this.size.set(Coordinate.MAX_WIDTH, height * this.ratio)
        console.log("adjust", this.ratio)

        this.orthographicProjectionMatrix4 = TransformUtils.orth(
            0, this.size.x, this.size.y, 0, 0, 1
        )
        this.center.set(this.size.x / 2, this.size.y / 2)
        this.resolution.set(width * window.devicePixelRatio, height * window.devicePixelRatio)
        this.onWindowResize?.();
    }

    public get width() {
        return this.size.x;
    }

    public get height() {
        return this.size.y;
    }

    public get left() {
        return 0
    }

    public get right() {
        return this.size.x
    }

    public get top() {
        return 0
    }

    public get bottom() {
        return this.size.y
    }

    public get nativeWidth() {
        return this.nativeSize.x
    }

    public get nativeHeight() {
        return this.nativeSize.y
    }

    public get centerX() {
        return this.width / 2;
    }

    public get centerY() {
        return this.height / 2;
    }
}

export default new Coordinate()