import {BeatBox} from "../BeatBox";
import {BaseDrawableConfig} from "../Drawable";
import {ImageDrawable} from "../ImageDrawable";
import {ImageLoader} from "../../ImageResources";
import {easeOut, easeOutQuint} from "../../util/Easing";
import { toHandlerKey } from "vue";
import { init } from "../../Utils";
import { Axis } from "../layout/Axis";

export class FadeLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, { size: ['fill-parent', 'fill-parent'] });
        this.logo = new ImageDrawable(gl, ImageLoader.get('logo'), 1, config)
        this.logo.alpha = 0.3
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        this.logo.fadeBegin()
            .fadeTo(0.5, 60, easeOut)
            .fadeTo(0.3, gap * 2, easeOutQuint)
    }

}