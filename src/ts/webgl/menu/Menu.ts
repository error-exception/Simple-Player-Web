import {Box, type BoxConfig} from "../box/Box";
import {Color} from "../base/Color";
import {easeInCubic, easeOut, easeOutBack, easeOutCubic, easeOutElastic, easeOutQuint} from "../../util/Easing";
import {Vector, Vector2} from "../core/Vector2";
import {type BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import {type DrawNode} from "../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../shader/DefaultShaderWrapper";
import Coordinate from "../base/Coordinate";
import {TextureStore} from "../texture/TextureStore";
import {Anchor} from "../drawable/Anchor";
import {type WebGLRenderer} from "../WebGLRenderer";
import {ImageDrawable} from "../drawable/ImageDrawable";
import {playSound, Sound} from "../../player/SoundEffect";
import {VueUI} from "../../global/GlobalState";
import {BeatBox} from "../box/BeatBox";
import {Size} from "../drawable/Size";
import {Axes} from "../drawable/Axes";
import {RowBox} from "../box/RowBox";
import ScreenManager from "../util/ScreenManager";
import type {IconAtlas} from "../texture/IconAtlas";

export class Menu extends Box {

  private leftButtonGroup: Box
  private rightButtonGroup: Box

  constructor() {
    super({
      size: Size.of(Size.FillParent, 96),
      anchor: Anchor.Center,
    });
    this.add(
      new ImageDrawable(TextureStore.get('Square') ,{
        size: Size.FillParentSize,
        color: Color.fromHex(0x323232)
      }),
      this.leftButtonGroup = new Box({
        size: Size.of(304, Size.FillParent),
        anchor: Anchor.CenterLeft,
        children: [
          new MenuButton({
            size: Size.of(120, 96),
            backgroundAnchor: Anchor.CenterRight,
            backgroundOrigin: Anchor.CenterRight,
            anchor: Anchor.CenterRight,
            color: Color.fromHex(0x555555),
            icon: 'Icon-Settings',
            sound: Sound.ButtonSelect,
            onClick() {
              VueUI.settings = true
            }
          })
        ]
      }),
      new Box({
        size: Size.of(784, Size.FillParent),
        anchor: Anchor.CenterRight,
        children: [
          this.rightButtonGroup = new RowBox({
            size: Size.FillParentSize,
            anchor: Anchor.CenterLeft,
            autoSize: Axes.X,
            children: [
              new MenuButton({
                size: Size.of(120, 96),
                backgroundAnchor: Anchor.CenterLeft,
                backgroundOrigin: Anchor.CenterLeft,
                color: Color.fromHex(0x6644cc),
                icon: 'Icon-PlayArrow',
                sound: Sound.DefaultSelect,
                onClick() {
                  ScreenManager.activeScreen('second')
                }
              }),
              new MenuButton({
                size: Size.of(120, 96),
                backgroundAnchor: Anchor.CenterLeft,
                backgroundOrigin: Anchor.CenterLeft,
                color: Color.fromHex(0x64ad69),
                icon: 'Icon-RadioButtonUnchecked',
                sound: Sound.DefaultSelect,
                onClick() {
                  ScreenManager.activeScreen('story')
                }
              }),
            ]
          }),
        ]
      })
    )
    this.setAlpha(0)
    this.setScale(new Vector2(1, 0))
    this.isVisible = false
  }

  public show() {
    this.isVisible = true
    this.transform()
      .delay(300).fadeTo(1, 220, easeInCubic)
      .delay(300).scaleYTo(1, 400, easeOutBack)
  }

  public hide() {
    this.transform().fadeTo(0, 220, easeOutCubic)
      .scaleYTo(0, 220, easeOutCubic)
    setTimeout(() => {
      this.isVisible = false
    }, 220)
  }

  onLogoHover() {
    if (this.isVisible) {
      this.leftButtonGroup.transform()
        .moveXTo(-12, 500, easeOutElastic)
      this.rightButtonGroup.transform()
        .moveXTo(12, 500, easeOutElastic)
    }
  }

  onLogoHoverLost() {
    if (this.isVisible) {
      this.leftButtonGroup.transform()
        .moveXTo(0, 500, easeOutElastic)
      this.rightButtonGroup.transform()
        .moveXTo(0, 500, easeOutElastic)
    }
  }

  onLogoPress() {
    if (this.isVisible) {
      this.leftButtonGroup.transform()
        .moveXTo(12, 1000, easeOut)
      this.rightButtonGroup.transform()
        .moveXTo(-12, 1000, easeOut)
    }
  }

  onLogoRelease() {
    if (this.isVisible) {
      this.leftButtonGroup.transform()
        .moveXTo(0, 500, easeOutElastic)
      this.rightButtonGroup.transform()
        .moveXTo(0, 500, easeOutElastic)
    }
  }

}

interface MenuButtonConfig extends BoxConfig {
  icon: IconAtlas
  color: Color
  sound: AudioBuffer
  backgroundOrigin: number
  backgroundAnchor: number
  onClick: () => void
}

class MenuButton extends BeatBox<MenuButtonConfig> {

  private icon: ImageDrawable

  constructor(config: MenuButtonConfig) {
    super({
      ...config,
      autoSize: Axes.X
    });
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      new MenuButtonBackground(config.color, config.sound, {
        size: config.size,
        origin: config.backgroundOrigin,
        anchor: config.backgroundAnchor,
      }),
      this.icon = new ImageDrawable(atlas.getRegin(config.icon), {
        size: Size.of(36),
        anchor: Anchor.Center
      })
    )
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.enableMouseEvent()
  }

  onClick(which: number): boolean {
    this.config.onClick()
    console.log(this)
    return true
  }

  private isBeat = false
  onHover(): boolean {
    this.isBeat = true
    return true
  }

  onHoverLost(): boolean {
    this.isBeat = false
    return true
  }

  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (this.isPresent && this.isBeat) {
      this.icon.transform()
        .scaleTo(Vector(0.9), 60, easeOutCubic)
        .scaleTo(Vector(1), gap * 2, easeOutQuint)
    }
  }

}

class MenuButtonBackground extends Drawable {
  constructor(private originColor: Color, private sound: AudioBuffer, config: BaseDrawableConfig) {
    super(config);
    this.transform()
      .colorTo(originColor, 0)
      .skewXTo(-.2, 0)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.enableMouseEvent()
  }

  private pressColor = new Color(
    Math.min(this.originColor.red * (1.2), 1),
    Math.min(this.originColor.green * (1.2), 1),
    Math.min(this.originColor.blue * (1.2), 1),
    1
  )

  private activeColor = new Color(
    Math.min(this.originColor.red * (2), 1),
    Math.min(this.originColor.green * (2), 1),
    Math.min(this.originColor.blue * (2), 1),
    1
  )

  onMouseDown(which: number): boolean {
    this.transform()
      .colorTo(this.pressColor, 300)
    return true
  }

  onMouseUp(which: number): boolean {
    this.transform()
      .colorTo(this.activeColor, 30)
      .colorTo(this.originColor, 400, easeOutQuint)
    playSound(this.sound)
    return true
  }

  onHover(): boolean {
    this.transform()
      .scaleXTo(1.4, 500, easeOutElastic)
    playSound(Sound.ButtonHover)
    return true
  }

  onHoverLost(): boolean {
    this.transform()
      .scaleXTo(1, 500, easeOutElastic)
    return true
  }

  beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.color = this.appliedColor
    shader.sampler2D = 0
  }

  onDraw(node: DrawNode, renderer: WebGLRenderer) {
    node.drawRect(this.initRectangle.topLeft, this.initRectangle.bottomRight)
    node.drawTexture(TextureStore.get('Square'))
  }
}