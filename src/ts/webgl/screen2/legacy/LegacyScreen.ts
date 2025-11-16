import { MouseState } from "../../../global/MouseState";
import { easeOutQuint } from "../../../util/Easing";
import { color } from "../../base/Color";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { inject } from "../../util/InstanceInject";
import { Screen } from "../../util/Screen";
import { ImageView } from "../../view/ImageView";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";
import { BackgroundScreen } from "../background/BackgroundScreen";
import { SideFlashlight } from "../main/SideFlashlight";
import { TopBar } from "../main/TopBar";
import { LogoBounceBox } from "./LegacyBeatLogoBox";
import { PlayControls } from "./PlayControls";

export class LegacyScreen extends Screen {

  constructor() {
    super();
    this.shouldCache = false
    this.origin = anchor.Center
    const logo = new LogoBounceBox(500)
    {
      logo.anchor = anchor.Center
      logo.origin = anchor.Center
      logo.size = vector2.fromValues(500, 500)
    }
    const sideFlash = new SideFlashlight(color.fromHex(0xffffff), 200)
    {
      sideFlash.anchor = anchor.Center
      sideFlash.size = SizeMode.fill()
    }
    const overlay = new HomeOverlay()
    this.addViews([sideFlash, logo, overlay])
    window.addEventListener('keydown', this.closeSelf)
  }

  private closeSelf = (ev: KeyboardEvent) => {
    if (ev.code === "Escape") {
      this.close()
    }
  }

  public onEntering(): void {
    super.onEntering()
    const background = inject(BackgroundScreen)
    const topBar = inject(TopBar)
    background.clearTransform()
      .scaleTo(vector2.fromValues(1, 1), 500, easeOutQuint)
      .fadeTo(1, 500, easeOutQuint)
      .moveTo(vector2.create(), 500, easeOutQuint)

    topBar.clearTransform()
      .delay(100).moveYTo(-36, 500, easeOutQuint)

    this.clearTransform()
      .fadeTo(0, 0)
      .fadeTo(1, 300, easeOutQuint)
      .scaleTo(vector2.fromValues(1.1, 1.1), 0)
      .scaleTo(vector2.fromValues(1, 1), 300, easeOutQuint)
  }

  public onExiting(): void {
    super.onExiting()
    const background = inject(BackgroundScreen)
    const topBar = inject(TopBar)
    background.clearTransform()
      .scaleTo(vector2.fromValues(0.996, 0.996), 500, easeOutQuint)
      .moveTo(vector2.fromValues(0, 35), 500, easeOutQuint)
      .fadeTo(0.8, 500, easeOutQuint)
    topBar.clearTransform()
      .delay(100)
      .moveYTo(0, 500, easeOutQuint)
    this.clearTransform()
      .scaleTo(vector2.fromValues(1.1, 1.1), 300, easeOutQuint)
      .fadeTo(0, 300, easeOutQuint)
  }

  public dispose(): void {
    super.dispose()
    window.removeEventListener("keydown", this.closeSelf)
  }
}

class HomeOverlay extends ViewGroup {

  private top: ImageView
  private bottom: ImageView

  constructor() {
    super();
    this.size = SizeMode.fill()
    const texture = TextureStore.getTexture('Square')
    const top = new ImageView()
    {
      top.size = vector2.fromValues(SizeMode.FILL_WIDTH, 100)
      top.anchor = anchor.TopCenter
      top.color = color.fromHex(0x0, 128)
      top.texture = texture
      top.objectFit = 'fill'
      this.top = top
    }

    const bottom = new ImageView()
    {
      bottom.size = vector2.fromValues(SizeMode.FILL_WIDTH, 100)
      bottom.anchor = anchor.BottomCenter
      bottom.color = color.fromHex(0x0, 128)
      bottom.texture = texture
      bottom.objectFit = 'fill'
      this.bottom = bottom
    }
    const controls = new PlayControls()
    {
      controls.size = vector2.fromValues(SizeMode.FILL_WIDTH, 36)
      controls.anchor = anchor.TopRight
    }
    this.addViews([top, bottom])
    // this.add(
    //   this.top, this.bottom,
    //   new PlayControls({
    //     size: Size.of(Size.FillParent, 36),
    //     anchor: Anchor.TopRight,
    //     space: 8,
    //     offset: Vector(-8, 8)
    //   }),
    //   new ProgressBar({
    //     size: Size.of(168, 4),
    //     anchor: Anchor.TopRight,
    //     offset: Vector(-8, 36 + 16)
    //   }),
    //   new TextDrawable({
    //     size: Size.of(40),
    //     text: 'OSU!Stable',
    //     fontSize: 36,
    //     fitSize: true,
    //     fontColor: Color.White,
    //     anchor: Anchor.BottomLeft,
    //     origin: Anchor.BottomLeft,
    //     offset: Vector(16, -16)
    //   }).apply(it => {
    //     it.enableMouseEvent()
    //     it.setOnHover(() => {
    //       it.transform()
    //         .scaleTo(Vector(1.2), 800, easeOutElastic)
    //         .colorTo(Color.fromHex(0xffff00), 800, easeOutQuint)
    //     })
    //     it.setOnHoverLost(() => {
    //       it.transform()
    //         .scaleTo(Vector2.one, 500, easeOutQuint)
    //         .colorTo(Color.White, 500, easeOutQuint)
    //     })
    //   }),
    // )
    this.alpha = 0.01
    this.isMouseEventEnabled = true
  }

  private lastPosition = vector2.create()
  private zero = vector2.create()

  onMouseMove(ev: MouseEvent) {
    const position = MouseState.position
    if (vector2.equals(position, this.zero)) {
      vector2.copy(this.lastPosition, position)
    }
    const distance = vector2.distance(position, this.lastPosition)
    vector2.copy(this.lastPosition, position)
    
    if (distance > 500) {
      this.clearTransform()
        .fadeTo(1, 250)
        .fadeTo(0.01, 10000)
    } else {
      this.alpha = Math.min(this.alpha + distance / 500, 1)
      this.clearTransform()
        .fadeTo(this.alpha, 0)
        .fadeTo(0.01, this.alpha * 10000)
    }
  }
}