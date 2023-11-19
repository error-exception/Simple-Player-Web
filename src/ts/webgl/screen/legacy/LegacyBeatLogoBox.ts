import {Box} from "../../box/Box";
import {BeatDispatcher, BeatState, IBeat} from "../../../global/Beater";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {easeOut, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {Time} from "../../../global/Time";
import {Vector, Vector2} from "../../core/Vector2";
import {MouseState} from "../../../global/MouseState";
import {Interpolation} from "../../util/Interpolation";
import {effectScope, watch} from "vue";
import {UIState} from "../../../global/UISettings";
import {LegacyLogo} from "./LegacyLogo";
import {Ripples} from "../main/Ripples";
import {BeatBox} from "../../box/BeatBox";
import {LegacyRoundVisualizer} from "./LegacyRoundVisualizer";
import AudioChannel from "../../../player/AudioChannel";

const logoSize = 610

class LegacyBeatLogo extends Box implements IBeat {

  // @ts-ignore
  private readonly logo: LegacyLogo

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    const logo = new LegacyLogo(gl, {
      size: [logoSize, logoSize]
    })
    this.logo = logo
    this.add(
      logo
    )
    BeatDispatcher.register(this)

  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume + 0.4, 1)
    this.logo.scaleBegin()
      .to(Vector(1 - adjust * 0.02), 60, easeOut)
      .to(Vector(1), gap * 2, easeOutQuint)
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

  public dispose() {
    super.dispose();
    BeatDispatcher.unregister(this)
  }

}
class LegacyFadeBeatLogo extends Box implements IBeat {

  // @ts-ignore
  private readonly logo: LegacyLogo

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    const logo = new LegacyLogo(gl, {
      size: [logoSize, logoSize]
    })
    this.logo = logo
    this.logo.alpha = .1
    this.add(logo)
    BeatDispatcher.register(this)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume, 1)

    this.logo.scaleBegin()
      .to(Vector(1 + adjust * 0.02), 60, easeOut)
      .to(Vector(1), gap * 2, easeOutQuint)
  }

  public dispose() {
    super.dispose();
    BeatDispatcher.unregister(this)
  }

}

class LegacyLogoBeatBox extends Box {

  public readonly beatLogo: LegacyBeatLogo

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    this.beatLogo = new LegacyBeatLogo(gl, config)
    this.add(this.beatLogo)
  }

  protected onUpdate() {
    if (AudioPlayerV2.isPlaying()) {
      if (BeatState.isAvailable) {
        const scale = this.scale
        const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
        const a = Interpolation.damp(
          scale.x,
          1 - Math.max(0, adjust) * 0.04,
          0.94,
          Time.elapsed
        )
        scale.x = a
        scale.y = a
        this.scale = scale
        // this.scale = Vector(1 - BeatState.currentRMS * 0.04)
      }
    }
  }

}
class LegacyFadeLogoBeatBox extends Box {

  private readonly beatLogo: LegacyFadeBeatLogo

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    this.beatLogo = new LegacyFadeBeatLogo(gl, config)
    this.add(this.beatLogo)
  }

  protected onUpdate() {
    if (AudioPlayerV2.isPlaying()) {
      if (BeatState.isAvailable) {
        const scale = this.scale
        const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
        const a = Interpolation.damp(
          2 - scale.x,
          1 - Math.max(0, adjust) * 0.04,
          0.94,
          Time.elapsed
        )
        // console.log(scale.x, a)
        scale.x = 2 - a
        scale.y = 2 - a
        this.scale = scale
      } else {
        const a = 1 + AudioChannel.maxVolume() * 0.08
        this.scale = new Vector2(a, a)
      }
    }
  }

}

class LogoAmpBox extends BeatBox {

  private readonly visualizer: LegacyRoundVisualizer
  private readonly logoBeatBox: LegacyLogoBeatBox
  private readonly fadeLogoBeatBox: LegacyFadeLogoBeatBox
  private logoHoverable = false
  private scope = effectScope()

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    this.visualizer = new LegacyRoundVisualizer(gl, {
      size: ['fill-parent', 'fill-parent'],
      innerRadius: logoSize * 0.92 / 2
    })
    const ripple = new Ripples(gl, {
      size: [600, 600]
    })
    this.logoBeatBox = new LegacyLogoBeatBox(gl, config)
    this.fadeLogoBeatBox = new LegacyFadeLogoBeatBox(gl, config)
    this.add(
      this.visualizer,
      ripple,
      this.logoBeatBox,
      this.fadeLogoBeatBox
    )
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
    this.scaleBegin()
      .to(Vector(1.1), 500, easeOutElastic)
    return true
  }

  public onHoverLost(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.scaleBegin()
      .to(Vector(1), 500, easeOutElastic)
    return true
  }

  public dispose() {
    super.dispose();
    this.scope.stop()
  }
}

export class LogoBounceBox extends Box {

  private readonly logoAmpBox: LogoAmpBox
  private isDraggable = true
  private scope = effectScope()

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    this.logoAmpBox = new LogoAmpBox(gl, { size: config.size })
    this.add(this.logoAmpBox)
    this.scope.run(() => {
      watch(() => UIState.logoDrag, value => {
        this.isDraggable = value
      }, { immediate: true })
    })
  }

  private flag = false
  private startPosition = Vector2.newZero()
  public onDrag(which: number): boolean {
    if (!this.isDraggable) {
      return true
    }
    const position = MouseState.position
    if (!this.flag) {
      this.flag = true
      this.startPosition.x = MouseState.position.x
      this.startPosition.y = MouseState.position.y
    }
    this.translate = new Vector2(
      (position.x - this.startPosition.x) * 0.05,
      (position.y - this.startPosition.y) * 0.05
    )
    // console.log(this._translate)
    return true
  }

  public onDragLost(which: number): boolean {
    if (!this.isDraggable) {
      return true
    }
    this.flag = false
    this.translateBegin()
      .translateTo(new Vector2(0, 0), 600, easeOutElastic)
    return true
  }

  public dispose() {
    super.dispose();
    this.scope.stop()
  }
}

export class LegacyBeatLogoBox extends Box {

  private readonly logoBounceBox: Box

  constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
    super(gl, config);

    this.logoBounceBox = new LogoBounceBox(gl, { size: config.size })
    this.add(this.logoBounceBox)
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