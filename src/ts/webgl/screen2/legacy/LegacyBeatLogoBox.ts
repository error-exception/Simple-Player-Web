import { effectScope, watch } from "vue";
import { BeatDispatcher, BeatState, type IBeat } from "../../../global/Beater";
import { Time } from "../../../global/Time";
import { UIState } from "../../../global/UISettings";
import AudioChannel from "../../../player/AudioChannel";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import { easeOut, easeOutQuint } from "../../../util/Easing";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { Interpolation } from "../../util/Interpolation";
import { ImageView } from "../../view/ImageView";
import { ViewGroup } from "../../view/ViewGroup";
import { Ripples } from "../main/Ripples";
import { LegacyRoundVisualizer } from "./LegacyRoundVisualizer";
import { Blend } from "../../drawable/Blend";
import { SizeMode } from "../../view/View";

class LegacyBeatLogo extends ViewGroup implements IBeat {

  // @ts-ignore
  private readonly logo: ImageView

  constructor() {
    super();
    const logo = new ImageView()
    {
      logo.texture = TextureStore.getTexture("LegacyLogo")
      logo.anchor = anchor.Center
      logo.size = SizeMode.fill()
      logo.origin = anchor.Center
    }
    this.logo = logo
    this.addView(logo)
    BeatDispatcher.register(this)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume + 0.4, 1)
    this.logo.clearTransform()
      .scaleTo(vector2.fromValues(1 - adjust * 0.02, 1 - adjust * 0.02), 60, easeOut)
      .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)
    if (BeatState.isKiai) {
      // this.logo.brightnessBegin()
      //   .transitionTo(.05)
      //   .transitionTo(0, 60, easeOut)
      //   .transitionTo(.05, gap * 2, easeOutQuint)
    } else {
      // this.logo.brightnessBegin()
      //   .transitionTo(0)
    }
  }

  public onDispose(): void {
    super.onDispose()
    BeatDispatcher.unregister(this)
  }
}

class LegacyFadeBeatLogo extends ViewGroup implements IBeat {

  // @ts-ignore
  private readonly logo: ImageView

  constructor() {
    super();
    const logo = new ImageView()
    {
      logo.texture = TextureStore.getTexture("LegacyLogo")
      logo.alpha = .08
      logo.anchor = anchor.Center
      logo.size = SizeMode.fill()
      logo.origin = anchor.Center
    }
    this.logo = logo
    this.addView(logo)
    BeatDispatcher.register(this)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume, 1)

    this.logo.clearTransform()
      .scaleTo(vector2.fromValues(1 + adjust * 0.02, 1 + adjust * 0.02), 60, easeOut)
      .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)
  }

  public onDispose(): void {
    super.onDispose()
    BeatDispatcher.unregister(this)
  }
}

class LegacyLogoBeatBox extends ViewGroup {

  public readonly beatLogo: LegacyBeatLogo

  constructor() {
    super();
    this.beatLogo = new LegacyBeatLogo()
    {
      this.beatLogo.anchor = anchor.Center
      this.beatLogo.origin = anchor.Center
      this.beatLogo.size = SizeMode.fill()
    }
    this.addView(this.beatLogo)
  }

  public onUpdate() {
    super.onUpdate()
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.scale
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(scale[0], 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed)
      scale[0] = a
      scale[1] = a
      this.scale = scale
    }
  }

}

class LegacyFadeLogoBeatBox extends ViewGroup {

  private readonly beatLogo: LegacyFadeBeatLogo

  constructor() {
    super();
    this.beatLogo = new LegacyFadeBeatLogo()
    {
      this.beatLogo.anchor = anchor.Center
      this.beatLogo.origin = anchor.Center
      this.beatLogo.size = SizeMode.fill()
    }
    this.addView(this.beatLogo)
  }

  public onUpdate() {
    super.onUpdate()
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.scale
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(2 - scale[0], 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed)
      scale[0] = (2 - a) * 0.99
      scale[1] = (2 - a) * 0.99
      this.scale = scale
    }
  }

}

class LogoAmpBox extends ViewGroup implements IBeat {

  private readonly visualizer: LegacyRoundVisualizer
  private readonly logoBeatBox: LegacyLogoBeatBox
  private readonly fadeLogoBeatBox: LegacyFadeLogoBeatBox
  private readonly logoFlash: ImageView
  private logoHoverable = false
  private scope = effectScope()

  constructor(visSize: number) {
    super();
    this.visualizer = new LegacyRoundVisualizer(visSize * 0.92 / 2)
    {
      this.visualizer.size = SizeMode.percentSize(vector2.fromValues(0.96, 0.96))
      this.visualizer.anchor = anchor.Center
      this.visualizer.origin = anchor.Center
    }
    const ripple = new Ripples()
    {
      ripple.size = SizeMode.percentSize(vector2.fromValues(0.9, 0.9))
      ripple.anchor = anchor.Center
      ripple.origin = anchor.Center
      ripple.duration = 1000
      ripple.maxThickWidth = 200
    }
    this.logoBeatBox = new LegacyLogoBeatBox()
    {
      this.logoBeatBox.anchor = anchor.Center
      this.logoBeatBox.origin = anchor.Center
      this.logoBeatBox.size = SizeMode.fill()
    }
    this.fadeLogoBeatBox = new LegacyFadeLogoBeatBox()
    {
      this.fadeLogoBeatBox.anchor = anchor.Center
      this.fadeLogoBeatBox.origin = anchor.Center
      this.fadeLogoBeatBox.size = SizeMode.fill()
    }
    const logoFlash = new ImageView()
    {
      logoFlash.texture = TextureStore.getTexture("WhiteRound")
      logoFlash.alpha = 0
      logoFlash.blend = Blend.Additive
      logoFlash.size = SizeMode.percentSize(vector2.fromValues(0.96, 0.96))
      logoFlash.anchor = anchor.Center
      logoFlash.origin = anchor.Center
      this.logoFlash = logoFlash
    }
    this.addViews([this.visualizer, ripple, this.logoBeatBox, logoFlash, this.fadeLogoBeatBox])
    this.scope.run(() => {
      watch(() => UIState.logoHover, val => this.logoHoverable = val, {immediate: true})
    })
    this.isMouseEventEnabled = true
    BeatDispatcher.register(this)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    this.fadeLogoBeatBox.isVisible = !BeatState.isKiai
    if (BeatState.isKiai) {
      this.logoFlash.clearTransform()
        .fadeTo(0.05, 0)
        .fadeTo(0, 60, easeOut)
        .fadeTo(0.05, gap * 2, easeOutQuint)
    }
  }

  public onHover(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.clearTransform()
      .scaleTo(vector2.fromValues(1.08, 1.08), 360, easeOutQuint)
    return true
  }

  public onHoverLost(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.clearTransform()
      .scaleTo(vector2.fromValues(1, 1), 500, easeOutQuint)
    return true
  }

  public onDispose() {
    super.onDispose();
    BeatDispatcher.unregister(this)
    this.scope.stop()
  }
}

export class LogoBounceBox extends ViewGroup {

  // private readonly logoAmpBox: LogoAmpBox

  constructor(visSize: number) {
    super();
    const box = new LogoAmpBox(visSize)
    {
      box.anchor = anchor.Center
      box.origin = anchor.Center
      box.size = SizeMode.fill()
    }
    this.addView(box)
  }

  // private flag = true
  public onClick(event: MouseEvent): boolean {
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