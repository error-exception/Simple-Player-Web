import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {Vector} from "../../core/Vector2";
import {Axis} from "../../drawable/Axis";
import {FadeLogo} from "./FadeLogo";
import {easeOutQuint} from "../../../util/Easing";

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
        logo.scale = Vector(0)
        // logo.translate = new Vector2(0, -128)

        this.add(
            fadeLogo,
            logo
        )

    }

    onLoad() {
        super.onLoad();
        this.lastChild.transform()
          .scaleTo(Vector(0.4), 250, easeOutQuint)
    }
}