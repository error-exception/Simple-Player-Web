import {Box} from "../../box/Box";
import {LegacyBeatLogoBox} from "./LegacyBeatLogoBox";
import {Flashlight} from "../main/Flashlight";
import {Color} from "../../base/Color";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {Axis} from "../../drawable/Axis";
import {MouseState} from "../../../global/MouseState";
import {Vector2} from "../../core/Vector2";

export class LegacyScreen extends Box {

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    this.add(
      new LegacyBeatLogoBox(gl, {
        size: [520, 520]
      }),
      new Flashlight(gl, {
        size: ['fill-parent', 'fill-parent'],
        color: Color.fromHex(0xffffff)
      }),
      new HomeOverlay(gl)
    )
  }
}

class HomeOverlay extends Box {

  private top: ColorDrawable
  private bottom: ColorDrawable

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent'],
    });
    this.top = new ColorDrawable(gl, {
      size: ['fill-parent', 100],
      anchor: Axis.Y_TOP | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.bottom = new ColorDrawable(gl, {
      size: ['fill-parent', 100],
      anchor: Axis.Y_BOTTOM | Axis.X_CENTER,
      color: Color.fromHex(0x0, 128)
    })
    this.add(this.top, this.bottom)
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