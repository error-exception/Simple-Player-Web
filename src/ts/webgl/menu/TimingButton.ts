import {Box} from "../Box";
import {ColorDrawable} from "../ColorDrawable";
import {Axis} from "../layout/Axis";
import {Color} from "../Color";
import {easeOutElastic} from "../../util/Easing";
import {Vector2} from "../core/Vector2";

export class TimingButton extends Box {

    private background: ColorDrawable

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: [128, 128],
            anchor: Axis.X_CENTER | Axis.Y_CENTER,
        });
        this.background = new ColorDrawable(gl, {
            size: [128, 128],
            anchor: Axis.X_CENTER | Axis.Y_CENTER,
            color: Color.fromHex(0x00ff00),
        })
        this.add(
            this.background
        )
        this.background.scale = new Vector2(0.9, 0.9)
    }

    onHover(): boolean {
        this.background.scaleBegin()
            .to(new Vector2(1, 1), 500, easeOutElastic)
        return true
    }

    onHoverLost(): boolean {
        this.background.scaleBegin()
            .to(new Vector2(0.9, 0.9), 500, easeOutElastic)
        return true
    }

}