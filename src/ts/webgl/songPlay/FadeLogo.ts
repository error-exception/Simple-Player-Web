import {BeatBox} from "./BeatBox";
import {BaseDrawableConfig} from "./Drawable";
import {ImageDrawable} from "./ImageDrawable";
import {ImageLoader} from "../ImageResources";
import {easeOut, easeOutQuint} from "../util/Easing";

export class FadeLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config);
        this.logo = new ImageDrawable(gl, config, ImageLoader.get('logo'), 1)
        this.logo.alpha = 0.3
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        this.logo.fadeBegin()
            .fadeTo(0.5, 60, easeOut)
            .fadeTo(0.3, gap * 2, easeOutQuint)
    }

}