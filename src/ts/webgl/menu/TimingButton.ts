import {Box} from "../box/Box";
import {ColorDrawable} from "../drawable/ColorDrawable";
import {Axis} from "../drawable/Axis";
import {Color} from "../base/Color";
import {easeOutElastic} from "../../util/Easing";
import {Vector} from "../core/Vector2";

export class TimingButton extends Box {

    private background: ColorDrawable

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: [128, 128],
            offset: [-40, 0]
        });
        this.background = new ColorDrawable(gl, {
            size: [128, 128],
            anchor: Axis.X_CENTER | Axis.Y_CENTER,
            color: Color.fromHex(0x00ff00),
            origin: Axis.X_LEFT | Axis.Y_CENTER
        })
        this.add(
            this.background
        )
        this.background.scale = Vector(0.9, 1)
    }

    onHover(): boolean {
        this.transform()
            .scaleTo(Vector(1), 500, easeOutElastic)
        return true
    }

    onHoverLost(): boolean {
        this.transform()
            .scaleTo(Vector(0.8, 1), 500, easeOutElastic)
        return true
    }

}