import {BaseDrawableConfig} from "./Drawable";
import {ImageDrawable} from "./ImageDrawable";
import {ImageLoader} from "../ImageResources";
import {easeIn, easeOut, easeOutExpo, easeOutQuint} from "../util/Easing";
import {BeatBox} from "./BeatBox";

export class LegacyLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        this.logo = new ImageDrawable(gl, config, ImageLoader.get('legacyLogo'))
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {

        this.logo.scaleBegin()
            .scaleTo(1.1, 60, easeOut)
            .scaleTo(1, gap, easeOutExpo)
    }


}