import BackgroundManager from "../../../global/BackgroundManager";
import { MouseState } from "../../../global/MouseState";
import { easeOut, easeOutQuint } from "../../../util/Easing";
import { Coordinate2 } from "../../base/Coordinate2";
import { anchor } from "../../drawable/Anchor";
import { Blend } from "../../drawable/Blend";
import { vector2 } from "../../graphic/matrix/vec2";
import { ImageView } from "../../view/ImageView";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";

export class MovableBackground extends ViewGroup {

  private get front(): ImageView {
    return this.children[1] as ImageView;
  }

  private get back(): ImageView {
    return this.children[0] as ImageView;
  }

  constructor() {
    super();
    const background1 = new ImageView()
    {
      background1.size = SizeMode.fill()
      background1.origin = anchor.Center
      background1.anchor = anchor.TopLeft
      background1.objectFit = "cover"
      background1.image = BackgroundManager.getBackground()
      background1.blend = Blend.Normal
    }
    const background2 = new ImageView()
    {
      background2.size = SizeMode.fill()
      background2.origin = anchor.Center
      background2.anchor = anchor.TopLeft
      background2.objectFit = "cover"
      background2.image = BackgroundManager.getBackground()
      background2.blend = Blend.Normal
    }
    this.addViews([background1, background2])
  }

  private currentShowing = 0

  public set backgroundImage(image: ImageBitmap) {
    if (this.currentShowing === 0) {
      this.back.image = image
      this.back.clearTransform().fadeTo(1, 220)
      this.front.clearTransform().fadeTo(0, 220)
      this.currentShowing = 1
    } else if (this.currentShowing === 1) {
      this.front.image = image
      this.front.clearTransform().fadeTo(1, 220)
      this.back.clearTransform().fadeTo(0, 220)
      this.currentShowing = 0
    }
  }

  public in() {
    this.clearTransform()
      .delay(300).scaleTo(vector2.fromValues(0.996, 0.996), 500, easeOutQuint)
      .delay(300).moveTo(vector2.fromValues(0, 35), 500, easeOutQuint)
      .delay(300).fadeTo(0.7, 500, easeOutQuint)
  }

  public out() {
    this.clearTransform()
      .scaleTo(vector2.fromValues(1, 1), 500, easeOutQuint)
      .moveTo(vector2.create(), 500, easeOutQuint)
      .fadeTo(1, 500, easeOutQuint)
  }

  public onUpdate(): void {
    super.onUpdate();
    // Move backgrounds based on mouse position
    this.updateBackgroundPosition()
  }

  private updateBackgroundPosition() {
    const imageWidth = this.width
    const imageHeight = this.height
    const scale = 1.02
    const translate = MouseState.position

    const viewport = Coordinate2
    const min = Math.min


    const scaledWidth = imageWidth * scale
    const scaledHeight = imageHeight * scale

    const shortOnImage = min(scaledHeight, scaledWidth)
    const shortOnViewport = min(viewport.width, viewport.height)
    const factor = shortOnViewport / shortOnImage

    const widthDiffer = scaledWidth - imageWidth
    const heightDiffer = scaledHeight - imageHeight
    const x = (factor * widthDiffer / viewport.width) * (translate[0] - Coordinate2.centerX)
    const y = (factor * heightDiffer / viewport.height) * (translate[1] - Coordinate2.centerY)
    this.scale = vector2.fromValues(scale, scale)
    this.translate = vector2.fromValues(x, y)
  }

}