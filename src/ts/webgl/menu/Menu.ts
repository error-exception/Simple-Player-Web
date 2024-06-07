import {Box} from "../box/Box";
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
import {inject} from "../util/DependencyInject";
import ScreenManager from "../util/ScreenManager";
import type {MainScreen} from "../screen/main/MainScreen";

export class Menu extends Box {

  private readonly menuBackground: MenuBackground

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent']
    });
    this.menuBackground = new MenuBackground({
      size: ['fill-parent', 96],
      anchor: Anchor.CenterLeft
    })
    const settings = new MenuButton({
      size: [120, 96],
      anchor: Anchor.CenterLeft,
      origin: Anchor.CenterRight,
      color: Color.fromHex(0x555555),
      icon: 'icon-settings',
      sound: Sound.ButtonSelect,
      onClick() {
        VueUI.settings = true
      }
    })
    settings.translate = Vector(190, 0)
    const background = new MenuButton({
      size: [120, 96],
      anchor: Anchor.Center,
      origin: Anchor.CenterLeft,
      color: Color.fromHex(0x6644cc),
      icon: 'icon-play',
      sound: Sound.DefaultSelect,
      onClick() {
        const mainScreen = inject<MainScreen>('MainScreen')
        mainScreen.transform()
          .moveXTo(-800, 500, easeOut)
          .scaleTo(Vector(0.8), 500, easeOut)
          .fadeTo(0, 500, easeOut)
        setTimeout(() => {
          ScreenManager.activeScreen('second')
        }, 500)
      }
    })
    background.translate = Vector(-80, 0)
    this.add(
      this.menuBackground,
      settings,
      // background
    )
    this.alpha = 0
    this.scale = new Vector2(1, 0)
    this.isVisible = false
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    console.log("menu", this.alpha)
  }

  public show() {
    this.isVisible = true
    this.transform().delay(300).fadeTo(1, 220, easeInCubic)
      .delay(300).scaleTo(new Vector2(1, 1), 400, easeOutBack)
  }

  public hide() {
    this.transform().fadeTo(0, 220, easeOutCubic)
      .scaleTo(new Vector2(1, 0), 220, easeOutCubic)
    setTimeout(() => {
      this.isVisible = false
    }, 220)
  }

}

class MenuBackground extends Drawable {

  private color = Color.fromHex(0x323232)
  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    this.color.alpha = this.appliedTransform.alpha
    shader.color = this.color
    shader.sampler2D = 0
  }

  public onDraw(node: DrawNode) {
    node.drawRect(this.position, this.position.add(this.size))
    node.drawTexture(TextureStore.get('Square'))
  }

}

interface MenuButtonConfig extends BaseDrawableConfig {
  icon: string,
  color: Color,
  sound: AudioBuffer
  onClick: () => void
}

class MenuButton extends Box<MenuButtonConfig> {
  constructor(config: MenuButtonConfig) {
    super(config);
    const bg = new MenuButtonBackground(config.color, config.sound, {
      size: config.size,
      origin: config.origin
    })
    bg.transform()
      .skewXTo(-.2, 0)
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      bg,
      new ImageDrawable(atlas.getRegin(config.icon), {
        size: [36, 36],
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
}

class MenuButtonBackground extends Drawable {
  constructor(private color: Color, private sound: AudioBuffer, config: BaseDrawableConfig) {
    super(config);
    this.transform()
      .colorTo(color, 0)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.enableMouseEvent()
  }

  private pressColor = new Color(
    Math.min(this.color.red * (1.2), 1),
    Math.min(this.color.green * (1.2), 1),
    Math.min(this.color.blue * (1.2), 1),
    1
  )

  private activeColor = new Color(
    Math.min(this.color.red * (2), 1),
    Math.min(this.color.green * (2), 1),
    Math.min(this.color.blue * (2), 1),
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
      .colorTo(this.color, 400, easeOutQuint)
    playSound(this.sound)
    return true
  }

  onHover(): boolean {
    this.transform()
      .scaleXTo(1.2, 500, easeOutElastic)
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
    shader.color = this.selfTransform.color
    shader.sampler2D = 0
  }

  onDraw(node: DrawNode, renderer: WebGLRenderer) {
    node.drawRect(this.position, this.position.add(this.size))
    node.drawTexture(TextureStore.get('Square'))
  }
}