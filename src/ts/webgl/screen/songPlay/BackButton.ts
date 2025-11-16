import {Anchor} from "../../drawable/Anchor";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {Color} from "../../base/Color";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {BeatBox} from "../../box/BeatBox";
import {easeOut, easeOutQuint} from "../../../util/Easing";
import {Size} from "../../drawable/Size";
import {Axes} from "../../drawable/Axes";
import type {IconAtlas} from "../../graphic/texture/IconAtlas";
import {Box} from "../../box/Box";
import {ColorUtils} from "../../base/ColorUtils";
// import ScreenManager from "../../util/ScreenManager";
import {Vector, Vector2} from "../../graphic/core/Vector2";
import {playSound, Sound} from "../../../player/SoundEffect";

export class BackButton extends BeatBox {

  private background: ImageDrawable
  private darkBackground: ImageDrawable
  private icon: ImageDrawable
  private readonly color: Color
  private readonly darkColor: Color

  constructor() {
    super({
      size: Size.of(120, 48),
      anchor: Anchor.BottomLeft,
      autoSize: Axes.X
    });
    const square = TextureStore.getTexture('Square')
    const back = TextureStore.getAtlas('Icons-Atlas').getRegin<IconAtlas>('Icon-Notifications')
    const color = Color.fromRGB(236, 72, 153)
    this.color = color
    this.darkColor = ColorUtils.lum(color, -.35)
    this.addTransformable(
      this.background = new ImageDrawable(square, {
        size: Size.FillParentSize,
        anchor: Anchor.CenterLeft,
        color
      }),
      new Box({
        size: Size.of(60, Size.FillParent),
        anchor: Anchor.CenterLeft,
        autoSize: Axes.X,
        children: [
          this.darkBackground = new ImageDrawable(square, {
            size: Size.FillParentSize,
            color,
            anchor: Anchor.CenterLeft
          }),
          this.icon = new ImageDrawable(back, {
            size: Size.of(24),
            anchor: Anchor.Center
          })
        ]
      })
    )
    this.background.setSkewX(-.2)
    this.darkBackground.setSkewX(-.2)
    this.setTranslateX(-8)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.enableMouseEvent()
  }

  private isHover = false
  onHover(): boolean {
    this.isHover = true
    const width = 60
    this.background.transform()
      .widthTo(120 * 1.4, 300, easeOutQuint)
    this.darkBackground.transform()
      .widthTo(width * 1.4, 300, easeOutQuint)
    this.darkBackground.transform()
      .colorTo(this.darkColor, 300, easeOutQuint)
    playSound(Sound.DefaultHover)
    return true
  }

  onHoverLost(): boolean {
    this.isHover = false
    const width = 60
    this.background.transform()
      .widthTo(120, 300, easeOutQuint)
    this.darkBackground.transform()
      .widthTo(width, 300, easeOutQuint)
    this.darkBackground.transform()
      .colorTo(this.color, 300, easeOutQuint)
    return true
  }

  onMouseUp(which: number): boolean {
    setTimeout(() => {
      ScreenManager.active('main')
    }, 100)
    playSound(Sound.DefaultSelect)
    return true
  }

  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (this.isHover) {
      this.icon.transform()
        .scaleTo(Vector(0.9), 60, easeOut)
        .scaleTo(Vector2.one, gap * 2, easeOutQuint)
    } else {
      this.icon.transform()
        .scaleTo(Vector(0.94), 60, easeOut)
        .scaleTo(Vector2.one, gap * 2, easeOutQuint)
    }
  }
}