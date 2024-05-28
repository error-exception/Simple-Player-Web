import {LegacyLogo} from "../legacy/LegacyLogo";
import {Axis} from "../../drawable/Axis";
import {BeatBox} from "../../box/BeatBox";
import {Vector} from "../../core/Vector2";
import {easeOut, easeOutQuint} from "../../../util/Easing";
import type {BaseDrawableConfig} from "../../drawable/Drawable";

export class LegacyPlayScreen extends BeatBox {

  private readonly logo: LegacyLogo
  private readonly fadeLogo: LegacyLogo

  private readonly activeScale = Vector(1.10)
  private readonly fadeLogoMinScale = Vector(1.12)
  private readonly fadeLogoMaxScale = Vector(1.18)
  private readonly fade = 0.65

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    const config: BaseDrawableConfig = {
      size: [520, 520],
      offset: [ 250 - 66, -250 + 36],
      anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
    }
    this.logo = new LegacyLogo(gl, config)
    this.fadeLogo = new LegacyLogo(gl, config)
    this.fadeLogo.alpha = this.fade
    this.scale = Vector(0.45)
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