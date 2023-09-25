import { Matrix3 } from "./core/Matrix3"
import { TransformUtils } from "./core/TransformUtils"
import { Vector2 } from "./core/Vector2"

class Coordinate {
    public static WIDTH = 1536;

    private _width: number = 0;
    private _height: number = 0;

    private pixelRatio: number = 0;

    public onWindowResize: (() => void) | null = null;

    /**
     * @deprecated
     */
    public coordinateScale: Matrix3 = Matrix3.newIdentify();

    /**
     * @deprecated
     */
    public orthographicProjection: Matrix3 = Matrix3.newIdentify();

    public orthographicProjectionMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    private flag = false

    public updateCoordinate(width: number, height: number) {
        console.log("window resize");
        
        this._width = width;
        this._height = height;

        this.coordinateScale = TransformUtils.scale(
            2 / this._width,
            2 / this._height
        );
        if (!this.flag) {
            this.orthographicProjection = TransformUtils.scale(
                2 / this._width,
                2 / this._height
            );
            this.orthographicProjection.M13 = -1;
            this.orthographicProjection.M23 = 1;
            this.flag = true
            // this.orthographicProjectionMatrix4 = TransformUtils.orth(
            //     -width / 2, width / 2, -height / 2, height / 2,
            //     0, 1
            // )
        }
        this.orthographicProjectionMatrix4 = TransformUtils.orth(
            -width / 2, width / 2, -height / 2, height / 2,
            0, 1
        )
        console.log(this.orthographicProjectionMatrix4)

        // const aspect = this._width / this._height
        

        // const mat4 = this.orthographicProjectionMatrix4
        // mat4[0] = this.orthographicProjection.M11
        // mat4[5] = this.orthographicProjection.M22
        // mat4[3] = this.orthographicProjection.M13
        // mat4[7] = this.orthographicProjection.M23

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