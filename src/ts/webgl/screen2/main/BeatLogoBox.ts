import { BeatDispatcher, BeatState, type IBeat } from "../../../global/Beater";
import { Time } from "../../../global/Time";
import AudioChannel from "../../../player/AudioChannel";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import { playSound, Sound } from "../../../player/SoundEffect";
import { easeInQuad, easeOut, easeOutElastic, easeOutQuint } from "../../../util/Easing";
import { SingleEvent } from "../../../util/SingleEvent";
import { nullable } from "../../../Utils";
import { anchor } from "../../drawable/Anchor";
import { Blend } from "../../drawable/Blend";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { inject } from "../../util/InstanceInject";
import { Interpolation } from "../../util/Interpolation";
import { ImageView } from "../../view/ImageView";
import { ViewGroup } from "../../view/ViewGroup";
import { BackgroundScreen } from "../background/BackgroundScreen";
import { LogoTriangles } from "./LogoTriangles";
import { Menu } from "./Menu";
import { Ripples } from "./Ripples";
import { RoundVisualizer } from "./RoundVisualizer";
import { TopBar } from "./TopBar";

export class BeatLogo extends ViewGroup implements IBeat {

  private readonly triangles: LogoTriangles
  private readonly logoFlash: ImageView
  private readonly clickEffect: ImageView

  constructor(size: vec2) {
    super();
    BeatDispatcher.register(this)

    const logo = new ImageView()
    {
      logo.texture = TextureStore.getTexture("Logo")
      logo.size = size
      logo.anchor = anchor.Center
      logo.origin = anchor.Center
    }
    const triangle = new LogoTriangles()
    {
      triangle.size = vector2.fromValues(size[0] * 0.9, size[1] * 0.9)
      triangle.anchor = anchor.Center
    }
    this.triangles = triangle
    const logoFlash = new ImageView()
    {
      logoFlash.texture = TextureStore.getTexture("WhiteRound")
      logoFlash.size = vector2.fromValues(size[0] * 0.9, size[1] * 0.9)
      logoFlash.anchor = anchor.Center
      logoFlash.origin = anchor.Center
      logoFlash.alpha = 0
      logoFlash.blend = Blend.Additive
    }
    const clickEffect = new ImageView();
    {
      clickEffect.texture = TextureStore.getTexture("WhiteRound")
      clickEffect.size = vector2.fromValues(size[0] * 0.9, size[1] * 0.9)
      clickEffect.anchor = anchor.Center
      clickEffect.origin = anchor.Center
      clickEffect.alpha = 0
      clickEffect.blend = Blend.Additive
    }
    this.logoFlash = logoFlash
    this.clickEffect = clickEffect
    this.addViews([triangle, logo, logoFlash, clickEffect])
    this.size = size
    this.isMouseEventEnabled = true
    
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
    if (!BeatState.isAvailable) {
      return;
    }
    
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
    const adjust = Math.min(volume, 1)
    this.transform()
      .scaleTo(vector2.fromValues(1 - adjust * 0.02, 1 - adjust * 0.02), 60, easeOut)
      .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)

    this.triangles.velocityBegin()
      .transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut)
      .transitionTo(0, gap * 2, easeOutQuint)

    if (BeatState.isKiai) {
      this.logoFlash.transform()
        .fadeTo(0.16, 60, easeOut)
        .fadeTo(0, gap * 2, easeOutQuint)
    }
  }

  public onClick(event: MouseEvent): void {
    this.clickEffect.transform()
      .fadeTo(.4, 60)
      .fadeTo(0, 1000, easeOutQuint)
  }

  protected onDispose(): void {
    BeatDispatcher.unregister(this)
  }
}

export class LogoBeatBox extends ViewGroup {
  private readonly beatLogo: BeatLogo

  constructor(size: vec2) {
    super()

    this.beatLogo = new BeatLogo(size)
    this.beatLogo.origin = anchor.Center
    this.beatLogo.anchor = anchor.Center
    this.origin = anchor.Center
    this.addView(this.beatLogo)
    this.size = size
  }

  public onUpdate(): void {
    super.onUpdate()
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.scale
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
      const a = Interpolation.damp(
        scale[0],
        1 - Math.max(0, adjust) * 0.04,
        0.94,
        Time.elapsed
      )
      vector2.set(scale, a, a)
      this.scale = scale
    }
  }
}

class LogoAmpBox extends ViewGroup {

  private readonly visualizer: RoundVisualizer
  private readonly logoBeatBox: LogoBeatBox

  public onLogoHover = nullable<(event: MouseEvent) => void>()
  public onLogoHoverLost = nullable<(event: MouseEvent) => void>()

  constructor(size: vec2) {
    super()
    this.visualizer = new RoundVisualizer(size[0] / 2 * 0.9)
    {
      this.visualizer.anchor = anchor.Center
      this.visualizer.origin = anchor.Center
      this.visualizer.size = size
    }
    this.logoBeatBox = new LogoBeatBox(size)
    {
      this.logoBeatBox.anchor = anchor.Center
      this.logoBeatBox.origin = anchor.Center
    }
    const ripple = new Ripples()
    {
      ripple.anchor = anchor.Center
      ripple.origin = anchor.Center
      ripple.size = vector2.fromValues(size[0] * 0.98, size[1] * 0.98)
      ripple.maxThickWidth = 5
      ripple.duration = 180
      ripple.defaultRippleAlpha = 0.06
    }
    this.addViews([this.visualizer, ripple, this.logoBeatBox])
    this.size = size
    this.isMouseEventEnabled = true
    this.origin = anchor.Center
  }

  public onHover(event: MouseEvent): void {
    this.transform().scaleTo(vector2.fromValues(1.1, 1.1), 500, easeOutElastic)
    this.onLogoHover?.(event)
  }

  public onHoverLost(event: MouseEvent): void {
    this.transform().scaleTo(vector2.fromValues(1, 1), 500, easeOutElastic)
    this.onLogoHoverLost?.(event)
  }

  public onMouseDown(event: MouseEvent): void {
    this.transform().scaleTo(vector2.fromValues(0.9, 0.9), 1000, easeOut)
  }

  public onMouseUp(event: MouseEvent): void {    
    this.transform().scaleTo(vector2.fromValues(1, 1), 500, easeOutElastic)
  }

}

export class LogoBounceBox extends ViewGroup {

  private readonly logoAmpBox: LogoAmpBox

  constructor(size: vec2) {
    super()
    this.logoAmpBox = new LogoAmpBox(size)
    {
      this.logoAmpBox.origin = anchor.Center
    }
    this.addView(this.logoAmpBox)
    this.size = size
    this.isMouseEventEnabled = true
  }

  private startPosition = vector2.create()
  private isDragging = false

  public onDrag(event: MouseEvent): void {
    const { x, y } = event
    if (!this.isDragging) {
      vector2.set(this.startPosition, x, y)
      this.isDragging = true
    }
    let translateX = x - this.startPosition[0]
    let translateY = y - this.startPosition[1]
    translateX = Math.sqrt(Math.abs(translateX)) * (translateX < 0 ? -1 : 1)
    translateY = Math.sqrt(Math.abs(translateY)) * (translateY < 0 ? -1 : 1)
    this.translate = vector2.fromValues(translateX, translateY)
  }

  public onDragLost(event: MouseEvent): void {
    this.isDragging = false
    this.transform().moveTo(vector2.create(), 600, easeOutElastic)
  }

}

export class BeatLogoBox extends ViewGroup {
  private readonly logoBounceBox: LogoBounceBox

  public onClickListener: SingleEvent<MouseEvent> = new SingleEvent<MouseEvent>()
  public onLogoHoverListener: SingleEvent<MouseEvent> = new SingleEvent<MouseEvent>()
  public onLogoHoverLostListener: SingleEvent<MouseEvent> = new SingleEvent<MouseEvent>()

  constructor(size: vec2) {
    super()
    this.logoBounceBox = new LogoBounceBox(size)
    {
      this.logoBounceBox.origin = anchor.Center
    }
    this.addViews([this.logoBounceBox])
    this.size = size
    this.isMouseEventEnabled = true
    this.origin = anchor.Center
    
    const logoAmpBox = inject(LogoAmpBox)
    logoAmpBox.onLogoHover = (event) => {
      this.onLogoHoverListener.invoke(event)
    }
    logoAmpBox.onLogoHoverLost = (event) => {
      this.onLogoHoverLostListener.invoke(event)
    }
  }

  public onClick(event: MouseEvent): void {
    this.onClickListener.invoke(event)
  }
}