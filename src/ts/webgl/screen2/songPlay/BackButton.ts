import { BeatDispatcher, type IBeat } from "../../../global/Beater";
import { playSound, Sound } from "../../../player/SoundEffect";
import { easeOut, easeOutElastic, easeOutQuint } from "../../../util/Easing";
import { color, type Color4 } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { quad } from '../../graphic/shape/Quad';
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ImageView } from "../../view/ImageView";
import { SizeMode, View } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";

export class BackButton extends ViewGroup implements IBeat {

  private background: SlashBackground
  private darkBackground: SlashBackground
  private icon: ImageView
  private readonly colour: Color4
  private readonly darkColor: Color4

  constructor() {
    super();
    this.size = vector2.fromValues(120, 48)
    this.anchor = anchor.BottomLeft

    const back = TextureStore.getTexture('BackIcon')
    this.colour = color.color(236 / 255, 72 / 255, 153 / 255)
    this.darkColor = color.lum(this.colour, -.15)
    const background = new SlashBackground()
    {
      background.size = SizeMode.fill()
      background.anchor = anchor.CenterLeft
      background.color = this.colour
    }
    const box = new ViewGroup()
    {
      box.size = vector2.fromValues(60, SizeMode.FILL_HEIGHT)
      box.anchor = anchor.CenterLeft
      const darkBackground = new SlashBackground()
      {
        darkBackground.size = SizeMode.fill()
        darkBackground.anchor = anchor.CenterLeft
        darkBackground.color = this.colour
        this.darkBackground = darkBackground
      }
      const icon = new ImageView()
      {
        icon.texture = back
        icon.size = vector2.fromValues(28, 28)
        icon.anchor = anchor.Center
        icon.origin = anchor.Center
        this.icon = icon
      }
      box.addViews([darkBackground, icon])
    }
    this.isMouseEventEnabled = true
    this.addViews([background, box])
    this.background = background
    BeatDispatcher.register(this)
  }

  private isHover = false
  public onHover(event: MouseEvent): boolean {
    this.isHover = true
    const width = 60
    this.background.clearTransform()
      .widthTo(120 * 1.2, 500, easeOutElastic)
    this.darkBackground.clearTransform()
      .widthTo(width * 1.2, 500, easeOutElastic)
    this.darkBackground.clearTransform()
      .colorTo(this.darkColor, 300, easeOutQuint)
    playSound(Sound.DefaultHover)
    return true
  }

  public onHoverLost(event: MouseEvent): boolean {
    this.isHover = false
    const width = 60
    this.background.clearTransform()
      .widthTo(120, 300, easeOutQuint)
    this.darkBackground.clearTransform()
      .widthTo(width, 300, easeOutQuint)
    this.darkBackground.clearTransform()
      .colorTo(this.colour, 300, easeOutQuint)
    return true
  }

  public onMouseUp(event: MouseEvent): boolean {
    playSound(Sound.DefaultSelect)
    return true
  }

  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (this.isHover) {
      this.icon.clearTransform()
        .scaleTo(vector2.fromValues(0.9, 0.9), 60, easeOut)
        .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)
    } else {
      this.icon.clearTransform()
        .scaleTo(vector2.fromValues(0.94, 0.94), 60, easeOut)
        .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)
    }
  }

  protected onDispose(): void {
    super.onDispose()
    BeatDispatcher.unregister(this)
  }

}

export class SlashBackground extends View {

  private slashX = 5

  private quad = quad.create()

  public onUpdate(): void {
    super.onUpdate()

    vector2.set(this.quad.topLeft, 0, 0)
    vector2.set(this.quad.topRight, this.width, 0)
    vector2.set(this.quad.bottomLeft, 0, this.height)
    vector2.set(this.quad.bottomRight, this.width, this.height)
    this.quad.topRight[0] += this.slashX
  }

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    canvas.drawQuad(this.quad)

  }

}