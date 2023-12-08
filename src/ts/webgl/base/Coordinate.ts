import {TransformUtils} from "../core/TransformUtils"

class Coordinate {

    public static readonly MAX_WIDTH = 1536

    private _width: number = 0;
    private _height: number = 0;

    private _nativeWidth = 0
    private _nativeHeight = 0

    public onWindowResize: (() => void) | null = null;

    public orthographicProjectionMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public ratio = 1
    public updateCoordinate(width: number, height: number) {
        console.log("window resize", width, height);

        this._nativeWidth = width
        this._nativeHeight = height

        this.ratio = Coordinate.MAX_WIDTH / width

        this._width = Coordinate.MAX_WIDTH;
        this._height = height * this.ratio;
        console.log("adjust", this.ratio)

        this.orthographicProjectionMatrix4 = TransformUtils.orth(
            -this._width / 2, this._width / 2, -this._height / 2, this._height / 2,
            0, 1
        )

        this.onWindowResize?.();
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public get nativeWidth() {
        return this._nativeWidth
    }

    public get nativeHeight() {
        return this._nativeHeight
    }

    public get centerX() {
        return this._width / 2;
    }

    public get centerY() {
        return this._height / 2;
    }

    public glXLength(worldOrScreen: number) {
        return worldOrScreen * (2 / this.width);
    }

    public glYLength(worldOrScreen: number) {
        return worldOrScreen * (2 / this.height);
    }
}

export default new Coordinate()