import {BeatBox} from "../../box/BeatBox";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {easeOut, easeOutQuint} from "../../../util/Easing";
import {TextureStore} from "../../texture/TextureStore";
import {Blend} from "../../drawable/Blend";

export class FadeLogo extends BeatBox {

    private logo: ImageDrawable

    constructor(config: BaseDrawableConfig) {
        super({ size: ['fill-parent', 'fill-parent'] });
        this.logo = new ImageDrawable(TextureStore.get('Logo'), {
            ...config,
            blend: Blend.Additive
        })
        this.logo.alpha = 0.3
        this.add(this.logo)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        this.logo.transform()
            .fadeTo(0.3, 60, easeOut)
            .fadeTo(0.1, gap * 2, easeOutQuint)
    }

}