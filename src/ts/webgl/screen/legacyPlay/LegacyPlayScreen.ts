import {LegacyLogo} from "../legacy/LegacyLogo";
import {BeatBox} from "../../box/BeatBox";
import {Vector} from "../../core/Vector2";
import {easeOut, easeOutQuint} from "../../../util/Easing";
import type {BaseDrawableConfig} from "../../drawable/Drawable";
import {Anchor} from "../../drawable/Anchor";

export class LegacyPlayScreen extends BeatBox {

  private readonly logo: LegacyLogo
  private readonly fadeLogo: LegacyLogo

  private readonly activeScale = Vector(1.10)
  private readonly fadeLogoMinScale = Vector(1.12)
  private readonly fadeLogoMaxScale = Vector(1.18)
  private readonly fade = 0.65

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent']
    });
    const config: BaseDrawableConfig = {
      size: [225, 225],
      offset: [36, 65],
      anchor: Anchor.BottomRight,
    }
    this.logo = new LegacyLogo(config)
    this.fadeLogo = new LegacyLogo(config)
    this.fadeLogo.alpha = this.fade
    this.add(this.logo, this.fadeLogo)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    this.logo.transform()
      .delay(30)
      .scaleTo(this.activeScale, 30, easeOut)
      .scaleTo(Vector(1), gap * 2, easeOutQuint)
    this.fadeLogo.transform()
      .delay(60)
      .fadeTo(this.fade, 0)
      .fadeTo(0, gap * 2, easeOutQuint)
      .clear
      .delay(60)
      .scaleTo(this.fadeLogoMinScale, 0)
      .scaleTo(this.fadeLogoMaxScale, gap * 2, easeOutQuint)
  }

}