import {Box} from "../Box";
import {ColorDrawable} from "../ColorDrawable";
import {Color} from "../Color";
import {Axis} from "../layout/Axis";
import {easeInCubic, easeOutCubic} from "../../util/Easing";
import {Time} from "../../Time";
import {TimingButton} from "./TimingButton";

export class Menu extends Box {

    private readonly menuBackground: ColorDrawable

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });
        this.menuBackground = new ColorDrawable(gl, {
            size: ['fill-parent', 128],
            anchor: Axis.X_LEFT | Axis.Y_CENTER,
            color: Color.fromHex(0x323232)
        })
        // const timingButton = new TimingButton(gl)
        this.add(
            this.menuBackground,
            // timingButton
        )
        this.alpha = 0
        this.isVisible = false
    }

    public show() {
        this.isVisible = true
        this.fadeBegin(Time.currentTime + 300)
            .fadeTo(1, 220, easeInCubic)
    }

    public hide() {
        this.fadeBegin()
            .fadeTo(0, 220, easeOutCubic)
        setTimeout(() => {
            this.isVisible = false
        }, 220)
    }

}