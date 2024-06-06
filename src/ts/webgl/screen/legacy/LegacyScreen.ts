import {Box} from "../../box/Box";
import {LogoBounceBox} from "./LegacyBeatLogoBox";
import {Color} from "../../base/Color";
import {Axis} from "../../drawable/Axis";
import {MouseState} from "../../../global/MouseState";
import {Vector2} from "../../core/Vector2";
import {Anchor} from "../../drawable/Anchor";
import {SideFlashlight} from "../main/SideFlashlight";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";

export class LegacyScreen extends Box {

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent']
    });
    this.add(
      new LogoBounceBox({
        size: [500, 500],
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
      size: ['fill-parent', 'fill-parent'],
    });
    const texture = TextureStore.get('Square')
    this.top = new ImageDrawable(texture,{
      size: ['fill-parent', 100],
      anchor: Axis.Y_TOP | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.bottom = new ImageDrawable(texture, {
      size: ['fill-parent', 100],
      anchor: Axis.Y_BOTTOM | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.add(
      this.top, this.bottom,
      // new PlayControls({
      //   size: [Coordinate.width / 2, 20],
      //   anchor: Anchor.TopRight
      // })
    )
    this.alpha = 0
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
      this.alpha = Math.min(this.alpha + distance / 500, 1)
      this.transform()
        .fadeTo(this.alpha, 0)
        .fadeTo(0, this.alpha * 10000)
    }
    return true
  }
}