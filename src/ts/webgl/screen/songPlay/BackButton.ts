import {Anchor} from "../../drawable/Anchor";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";
import {Color} from "../../base/Color";
import {Vector} from "../../core/Vector2";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {BeatBox} from "../../box/BeatBox";
import {easeOut, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import {Size} from "../../drawable/Size";
import {Axes} from "../../drawable/Axes";

export class BackButton extends BeatBox {

  private background: ImageDrawable
  private icon: ImageDrawable

  constructor() {
    super({
      size: Size.of(120, 56),
      anchor: Anchor.BottomLeft,
      autoSize: Axes.X
    });
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    const settings = new ImageDrawable(atlas.getRegin('icon-settings'), {
      size: Size.of(28),
      anchor: Anchor.Center,
    })
    const bg = new ImageDrawable(TextureStore.get('Square'), {
      size: Size.of(120, 56),
      anchor: Anchor.BottomLeft,
      color: Color.fromHex(0x0090ff),
      origin: Anchor.CenterLeft
    })
    bg.transform()
      .skewXTo(-.4, 0)
    this.add(
      this.background = bg, this.icon = settings
    )
    this.setTranslateX(-20)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.enableMouseEvent()
  }

  private isBeatStrong = false
  onHover(): boolean {
    this.isBeatStrong = true
    this.background.transform()
      .scaleXTo(1.4, 500, easeOutElastic)
    return true
  }

  onHoverLost(): boolean {
    this.isBeatStrong = false
    this.background.transform()
      .scaleXTo(1, 500, easeOutElastic)
    return false
  }

  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (this.isBeatStrong) {
      this.icon.transform()
        .scaleTo(Vector(0.9), 60, easeOut)
        .scaleTo(Vector(1), gap * 2, easeOutQuint)
    } else {
      this.icon.transform()
        .scaleTo(Vector(0.94), 60, easeOut)
        .scaleTo(Vector(1), gap * 2, easeOutQuint)
    }
  }
}