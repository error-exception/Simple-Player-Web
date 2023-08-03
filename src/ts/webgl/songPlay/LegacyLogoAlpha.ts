import {BeatBox} from "./BeatBox";
import {ImageDrawable} from "./ImageDrawable";
import {BaseDrawableConfig} from "./Drawable";
import {ImageLoader} from "../ImageResources";
import {easeIn, easeOut, easeOutExpo, easeOutQuint} from "../util/Easing";
import {Time} from "../Time";
import {Vector2} from "./core/Vector2";

export class LegacyLogoAlpha extends BeatBox {


    private logo: ImageDrawable

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        this.logo = new ImageDrawable(gl, config, ImageLoader.get('legacyLogo'))
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        // this.scale = new Vector2(1, 1)
        // this.logo.alpha = 1
        this.logo.scaleBegin()
            .scaleTo(1.1)
            .scaleTo(1.1, 60, easeOut)
            .scaleTo(1.22, gap, easeOutQuint)
        this.logo.fadeBegin()
            .fadeTo(.5, 60, easeOut)
            .fadeTo(0, gap * 1.2, easeOutQuint)
    }


}