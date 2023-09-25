import {BeatBox} from "../BeatBox";
import {ImageDrawable} from "../ImageDrawable";
import {BaseDrawableConfig} from "../Drawable";
import {ImageLoader} from "../../ImageResources";
import {easeOut, easeOutQuint} from "../../util/Easing";
import { init } from "../../Utils";
import { Axis } from "../layout/Axis";

export class LegacyLogoAlpha extends BeatBox {


    private logo: ImageDrawable

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, { size: ['fill-parent', 'fill-parent'] });
        
        this.logo = new ImageDrawable(gl, ImageLoader.get('legacyLogo'), 0, config)
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        // this.scale = new Vector2(1, 1)
        // this.logo.alpha = 1
        this.logo.scaleBegin()
            .scaleTo(1.11)
            .scaleTo(1.11, 60, easeOut)
            .scaleTo(1.17, gap, easeOutQuint)
        this.logo.fadeBegin()
            .fadeTo(.6, 60, easeOut)
            .fadeTo(0, gap * 2, easeOutQuint)
    }


}