import {Box} from "../box/Box";
import {ColorDrawable} from "../drawable/ColorDrawable";
import {Color} from "../base/Color";
import {Axis} from "../drawable/Axis";
import {easeInCubic, easeOutBack, easeOutCubic} from "../../util/Easing";
import {Vector2} from "../core/Vector2";

export class Menu extends Box {

    private readonly menuBackground: ColorDrawable

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });
        this.menuBackground = new ColorDrawable(gl, {
            size: ['fill-parent', 96],
            anchor: Axis.X_LEFT | Axis.Y_CENTER,
            color: Color.fromHex(0x323232)
        })
        this.add(this.menuBackground)
        this.alpha = 0
        this.scale = new Vector2(1, 0)
        this.isVisible = false
    }

    onLoad() {
        super.onLoad();
        console.log("menu", this.alpha)
    }

    public show() {
        this.isVisible = true
        this.transform().delay(300).fadeTo(1, 220, easeInCubic)
          .delay(300).scaleTo(new Vector2(1, 1), 400, easeOutBack)
    }

    public hide() {
        this.transform().fadeTo(0, 220, easeOutCubic)
          .scaleTo(new Vector2(1, 0), 220, easeOutCubic)
        setTimeout(() => {
            this.isVisible = false
        }, 220)
    }

}