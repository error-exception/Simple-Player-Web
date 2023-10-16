import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {Vector2} from "../../core/Vector2";
import {Axis} from "../../layout/Axis";
import {FadeLogo} from "./FadeLogo";
import {easeOutBack} from "../../../util/Easing";

export class SongPlayScreen extends Box {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });
        const fadeLogo = new FadeLogo(gl, {
            size: [250, 250]
        })
        const logo = new LogoBounceBox(gl, { 
            size: [520, 520],
            anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
            offset: [ 250 - 66, -250 + 24]
        })
        logo.scale = new Vector2(0.4, 0.4)
        logo.translate = new Vector2(0, -128)
        logo.translateBegin()
            .translateTo(new Vector2(0, 0), 400, easeOutBack)
        this.add(
            fadeLogo,
            logo
        )

    }
}