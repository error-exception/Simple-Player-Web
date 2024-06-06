import {Box} from "../../box/Box";
import {BeatState} from "../../../global/Beater";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {easeOut, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {Time} from "../../../global/Time";
import {Vector} from "../../core/Vector2";
import {Interpolation} from "../../util/Interpolation";
import {effectScope, watch} from "vue";
import {UIState} from "../../../global/UISettings";
import {LegacyLogo} from "./LegacyLogo";
import {Ripples} from "../main/Ripples";
import {BeatBox} from "../../box/BeatBox";
import {LegacyRoundVisualizer} from "./LegacyRoundVisualizer";
import AudioChannel from "../../../player/AudioChannel";
import {Anchor} from "../../drawable/Anchor";

class LegacyBeatLogo extends BeatBox<LegacyLogoConfig> {

  // @ts-ignore
  private readonly logo: LegacyLogo

  constructor(config: LegacyLogoConfig) {
    super(config);

    const logo = new LegacyLogo({
      size: config.size,
      anchor: Anchor.Center
    })
    this.logo = logo
    this.add(logo)

  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume + 0.4, 1)
    this.logo.transform()
      .scaleTo(Vector(1 - adjust * 0.02), 60, easeOut)
      .scaleTo(Vector(1), gap * 2, easeOutQuint)
    if (BeatState.isKiai) {
      this.logo.brightnessBegin()
        .transitionTo(.05)
        .transitionTo(0, 60, easeOut)
        .transitionTo(.05, gap * 2, easeOutQuint)
    } else {
      this.logo.brightnessBegin()
        .transitionTo(0)
    }
  }

}

class LegacyFadeBeatLogo extends BeatBox<LegacyLogoConfig> {

  // @ts-ignore
  private readonly logo: LegacyLogo

  constructor(config: LegacyLogoConfig) {
    super(config);

    const logo = new LegacyLogo({
      size: config.size,
      anchor: Anchor.Center
    })
    this.logo = logo
    this.logo.alpha = .08
    this.add(logo)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume, 1)

    this.logo.transform()
      .scaleTo(Vector(1 + adjust * 0.02), 60, easeOut)
      .scaleTo(Vector(1), gap * 2, easeOutQuint)
  }

}

class LegacyLogoBeatBox extends Box<LegacyLogoConfig> {

  public readonly beatLogo: LegacyBeatLogo

  constructor(config: LegacyLogoConfig) {
    super(config);

    this.beatLogo = new LegacyBeatLogo(config)
    this.add(this.beatLogo)
  }

  protected onUpdate() {
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.scale
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(scale.x, 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed)
      scale.x = a
      scale.y = a
      this.scale = scale
    }
  }

}

class LegacyFadeLogoBeatBox extends Box<LegacyLogoConfig> {

  private readonly beatLogo: LegacyFadeBeatLogo

  constructor(config: LegacyLogoConfig) {
    super(config);

    this.beatLogo = new LegacyFadeBeatLogo(config)
    this.add(this.beatLogo)
  }

  protected onUpdate() {
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.scale
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(2 - scale.x, 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed)
      // console.log(scale.x, a)
      scale.x = (2 - a) * 0.99
      scale.y = (2 - a) * 0.99

      this.scale = scale
    }
  }

}

class LogoAmpBox extends BeatBox<LegacyLogoConfig> {

  private readonly visualizer: LegacyRoundVisualizer
  private readonly logoBeatBox: LegacyLogoBeatBox
  private readonly fadeLogoBeatBox: LegacyFadeLogoBeatBox
  private logoHoverable = false
  private scope = effectScope()

  constructor(config: LegacyLogoConfig) {
    super(config);

    this.visualizer = new LegacyRoundVisualizer({
      size: [config.size[0] * 0.96, config.size[1] * 0.96],
      innerRadius: config.size[0] * 0.92 / 2,
      anchor: Anchor.Center
    })
    const ripple = new Ripples({
      size: [config.size[0] * 0.98, config.size[1] * 0.98],
      anchor: Anchor.Center
    })
    this.logoBeatBox = new LegacyLogoBeatBox(config)
    this.fadeLogoBeatBox = new LegacyFadeLogoBeatBox(config)
    this.add(this.visualizer, ripple, this.logoBeatBox, this.fadeLogoBeatBox)
    this.scope.run(() => {
      watch(() => UIState.logoHover, val => this.logoHoverable = val, {immediate: true})
    })
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    this.fadeLogoBeatBox.isVisible = !BeatState.isKiai
  }

  public onHover(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.transform()
      .scaleTo(Vector(1.1), 500, easeOutElastic)
    return true
  }

  public onHoverLost(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.transform()
      .scaleTo(Vector(1), 500, easeOutElastic)
    return true
  }

  public dispose() {
    super.dispose();
    this.scope.stop()
  }
}

interface LegacyLogoConfig extends BaseDrawableConfig {
  size: [number, number]
}

export class LogoBounceBox extends Box<LegacyLogoConfig> {

  // private readonly logoAmpBox: LogoAmpBox

  constructor(config: LegacyLogoConfig) {
    super(config);
    this.add(new LogoAmpBox(config))
  }

  // private flag = true
  public onClick(which: number): boolean {
    // const menu = inject<Menu>('Menu')
    // const bg = inject<BackgroundBounce>('BackgroundBounce')
    //
    // if (this.flag) {
    //   this.translateBegin()
    //     .translateTo(new Vector2(-240, 0), 400, easeInCubic)
    //   this.scaleBegin()
    //     .to(new Vector2(0.5, 0.5), 400, easeInCubic)
    //   menu.show()
    //   bg.in()
    // } else {
    //   this.translateBegin()
    //     .translateTo(new Vector2(0, 0), 400, easeOutCubic)
    //   this.scaleBegin()
    //     .to(new Vector2(1, 1), 400, easeOutCubic)
    //   menu.hide()
    //   bg.out()
    // }
    // const v = this.flag
    // onEnterMenu.emit(v)
    // this.flag = !this.flag
    return true
  }


}