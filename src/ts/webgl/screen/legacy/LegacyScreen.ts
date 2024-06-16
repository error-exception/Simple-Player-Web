import {Box} from "../../box/Box";
import {LogoBounceBox} from "./LegacyBeatLogoBox";
import {Color} from "../../base/Color";
import {Axis} from "../../drawable/Axis";
import {MouseState} from "../../../global/MouseState";
import {Vector, Vector2} from "../../core/Vector2";
import {Anchor} from "../../drawable/Anchor";
import {SideFlashlight} from "../main/SideFlashlight";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";
import {Size} from "../../drawable/Size";
import {PlayControls} from "./PlayControls";
import {ProgressBar} from "./ProgressBar";

export class LegacyScreen extends Box {

  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.add(
      new LogoBounceBox({
        size: Size.of(500),
        anchor: Anchor.Center
      }),
      new SideFlashlight(Color.fromHex(0xffffff)),
      new HomeOverlay()
    )
  }
}

class HomeOverlay extends Box {

  private top: ImageDrawable
  private bottom: ImageDrawable

  constructor() {
    super({
      size: Size.FillParentSize,
    });
    const texture = TextureStore.get('Square')
    this.top = new ImageDrawable(texture,{
      size: Size.of(Size.FillParent, 100),
      anchor: Axis.Y_TOP | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.bottom = new ImageDrawable(texture, {
      size: Size.of(Size.FillParent, 100),
      anchor: Axis.Y_BOTTOM | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.add(
      this.top, this.bottom,
      new PlayControls({
        size: Size.of(Size.FillParent, 36),
        anchor: Anchor.TopRight,
        space: 8,
        offset: Vector(-8, 8)
      }),
      new ProgressBar({
        size: Size.of(168, 4),
        anchor: Anchor.TopRight,
        offset: Vector(-8, 36 + 16)
      })
    )
    this.setAlpha(0)
    this.enableMouseEvent()
  }

  private lastPosition = Vector2.newZero()
  onMouseMove(): boolean {
    const position = MouseState.position
    if (this.lastPosition.isZero()) {
      this.lastPosition.setFrom(position)
    }
    const distance = position.distance(this.lastPosition)
    this.lastPosition.setFrom(position)
    if (distance > 500) {
      this.transform()
        .fadeTo(1, 250)
        .fadeTo(0, 10000)
    } else {
      this.setAlpha(Math.min(this.getAlpha() + distance / 500, 1))
      this.transform()
        .fadeTo(this.getAlpha(), 0)
        .fadeTo(0, this.getAlpha() * 10000)
    }
    return true
  }
}