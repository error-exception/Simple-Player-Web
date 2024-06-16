import {Box} from "../../box/Box";
import {BeatState} from "../../../global/Beater";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {RoundVisualizer} from "./RoundVisualizer";
import {easeInCubic, easeOut, easeOutCubic, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {Time} from "../../../global/Time";
import {Vector, Vector2} from "../../core/Vector2";
import {LogoTriangles} from "./LogoTriangles";
import {MouseState} from "../../../global/MouseState";
import {Interpolation} from "../../util/Interpolation";
import {onEnterMenu} from "../../../global/GlobalState";
import {inject} from "../../util/DependencyInject";
import {Menu} from "../../menu/Menu";
import {BackgroundBounce} from "./MovableBackground";
import {effectScope, watch} from "vue";
import {UIState} from "../../../global/UISettings";
import AudioChannel from "../../../player/AudioChannel";
import {BeatBox} from "../../box/BeatBox";
import {Anchor} from "../../drawable/Anchor";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";
import {Ripples} from "./Ripples";
import type {TopBar} from "./TopBar";
import {Size} from "../../drawable/Size";

interface LogoConfig extends BaseDrawableConfig {
  size: Vector2
}

class BeatLogo extends BeatBox<LogoConfig> {

  // @ts-ignore
  private readonly logo: ImageDrawable
  private readonly triangles: LogoTriangles

  constructor(config: LogoConfig) {
    super(config);

    const logo = new ImageDrawable(TextureStore.get('Logo'), {
      size: config.size,
      anchor: Anchor.Center
    })
    const triangles = new LogoTriangles({
      size: Size.of(config.size.x * 0.9, config.size.y * 0.9),
      anchor: Anchor.Center
    })
    this.logo = logo
    this.triangles = triangles
    this.add(
      triangles,
      logo
    )
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume, 1)
    this.transform().scaleTo(Vector(1 - adjust * 0.02), 60, easeOut)
      .scaleTo(Vector(1), gap * 2, easeOutQuint)

    this.triangles.velocityBegin()
      .transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut)
      .transitionTo(0, gap * 2, easeOutQuint)

    if (BeatState.isKiai) {
      this.triangles.lightBegin()
        .transitionTo(0.2, 60, easeOut)
        .transitionTo(0, gap * 2, easeOutQuint)
    }
  }
}

class LogoBeatBox extends Box<LogoConfig> {

  private readonly beatLogo: BeatLogo

  constructor(config: LogoConfig) {
    super(config);

    this.beatLogo = new BeatLogo(config)
    this.add(this.beatLogo)
  }

  public onUpdate() {
    super.onUpdate()
    if (AudioPlayerV2.isPlaying()) {
      // if (BeatState.isAvailable) {
      const scale = this.getScale()
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(
        scale.x,
        1 - Math.max(0, adjust) * 0.04,
        0.94,
        Time.elapsed
      )
      scale.x = a
      scale.y = a
      this.setScale(scale)
      // }
    }
  }

}

class LogoAmpBox extends Box<LogoConfig> {

  private readonly visualizer: RoundVisualizer
  private readonly logoBeatBox: LogoBeatBox
  private logoHoverable = false
  private scope = effectScope()

  constructor(config: LogoConfig) {
    super(config);
    this.enableMouseEvent()
    this.visualizer = new RoundVisualizer({
      size: Size.FillParentSize,
      innerRadius: Math.min(config.size.x, config.size.y) / 2 * 0.9,
      anchor: Anchor.Center
    })
    const ripple = new Ripples({
      size: Size.of(config.size.x * 0.98, config.size.y * 0.98),
      anchor: Anchor.Center,
      maxThickWidth: 5,
      duration: 180,
      defaultRippleAlpha: 0.06
    })
    this.logoBeatBox = new LogoBeatBox({
      size: config.size,
      anchor: Anchor.Center
    })

    this.add(
      this.visualizer,
      ripple,
      this.logoBeatBox
    )
    this.scope.run(() => {
      watch(() => UIState.logoHover, val => this.logoHoverable = val, { immediate: true })
    })
  }

  public onHover(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.transform().scaleTo(new Vector2(1.1, 1.1), 500, easeOutElastic)
    const menu = inject<Menu>('Menu')
    menu.onLogoHover()
    return true
  }

  public onHoverLost(): boolean {
    if (!this.logoHoverable) {
      return true
    }
    this.transform().scaleTo(Vector2.one, 500, easeOutElastic)
    const menu = inject<Menu>('Menu')
    menu.onLogoHoverLost()
    return true
  }

  public onMouseDown(which: number): boolean {
    this.transform().scaleTo(Vector(.9), 1000, easeOut)
    const menu = inject<Menu>('Menu')
    menu.onLogoPress()
    return true
  }

  public onMouseUp(which: number): boolean {
    this.transform().scaleTo(Vector(1), 500, easeOutElastic)
    const menu = inject<Menu>('Menu')
    menu.onLogoRelease()
    return true
  }

  public dispose() {
    super.dispose();
    this.scope.stop()
  }
}

export class LogoBounceBox extends Box<LogoConfig> {

  private readonly logoAmpBox: LogoAmpBox
  private isDraggable = true
  private scope = effectScope()

  constructor(config: LogoConfig) {
    super(config);
    this.enableMouseEvent()
    this.logoAmpBox = new LogoAmpBox(config)
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
    let translateX = position.x - this.startPosition.x
    let translateY = position.y - this.startPosition.y
    translateX = Math.sqrt(Math.abs(translateX)) * (translateX < 0 ? -1 : 1)
    translateY = Math.sqrt(Math.abs(translateY)) * (translateY < 0 ? -1 : 1)
    this.setTranslate(Vector(translateX, translateY))
    return true
  }

  public onDragLost(which: number): boolean {
    if (!this.isDraggable) {
      return true
    }
    this.flag = false
    this.transform().moveTo(new Vector2(0, 0), 600, easeOutElastic)
    return true
  }

  public dispose() {
    super.dispose();
    this.scope.stop()
  }
}

export class BeatLogoBox extends Box<LogoConfig> {

  private readonly logoBounceBox: Box

  constructor(config: LogoConfig) {
    super(config);
    this.enableMouseEvent()
    this.logoBounceBox = new LogoBounceBox(config)
    this.add(this.logoBounceBox)
  }

  private flag = true
  public onClick(which: number): boolean {
    const menu = inject<Menu>('Menu')
    const bg = inject<BackgroundBounce>('BackgroundBounce')
    const topBar = inject<TopBar>('TopBar')

    const transition = this.transform()
    if (this.flag) {
      transition.moveTo(new Vector2(-480, 0), 400, easeInCubic)
        .scaleTo(new Vector2(0.5, 0.5), 400, easeInCubic)
      menu.show()
      bg.in()
      topBar.transform()
        .delay(300)
        .moveYTo(0, 500, easeOutQuint)
    } else {
      transition.moveTo(Vector2.zero, 400, easeOutCubic)
        .scaleTo(Vector2.one, 400, easeOutCubic)
      menu.hide()
      bg.out()
      topBar.transform()
        .moveYTo(-36, 500, easeOutQuint)
    }
    const v = this.flag
    onEnterMenu.emit(v)
    this.flag = !this.flag
    return true
  }

}