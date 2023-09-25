import {BaseDrawableConfig} from "../Drawable";
import {ImageDrawable} from "../ImageDrawable";
import {ImageLoader} from "../../ImageResources";
import {easeInQuint, easeOut, easeOutCirc, easeOutExpo, easeOutQuint} from "../../util/Easing";
import {BeatBox} from "../BeatBox";
import { init } from "../../Utils";
import { Axis } from "../layout/Axis";

export class LegacyLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, { size: ['fill-parent', 'fill-parent'] });        
        this.logo = new ImageDrawable(gl, ImageLoader.get('legacyLogo'), 0, config)
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {

        this.logo.scaleBegin()
            .scaleTo(1.12, 60, easeInQuint)
            .scaleTo(1, gap * 1.1, easeOutExpo)
    }


}