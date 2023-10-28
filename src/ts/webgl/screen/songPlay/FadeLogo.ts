import {BeatBox} from "../../box/BeatBox";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {easeOut, easeOutQuint} from "../../../util/Easing";
import {Images} from "../../util/ImageResource";

export class FadeLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, { size: ['fill-parent', 'fill-parent'] });
        this.logo = new ImageDrawable(gl, Images.Logo, 1, config)
        this.logo.alpha = 0.3
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        this.logo.fadeBegin()
            .fadeTo(0.5, 60, easeOut)
            .fadeTo(0.3, gap * 2, easeOutQuint)
    }

}