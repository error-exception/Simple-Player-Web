import {TransformUtils} from "../core/TransformUtils"

class Coordinate {

    private _width: number = 0;
    private _height: number = 0;

    public onWindowResize: (() => void) | null = null;

    public orthographicProjectionMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public updateCoordinate(width: number, height: number) {
        console.log("window resize");
        
        this._width = width;
        this._height = height;

        this.orthographicProjectionMatrix4 = TransformUtils.orth(
            -width / 2, width / 2, -height / 2, height / 2,
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