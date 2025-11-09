import { BeatDispatcher, BeatState, type IBeat } from "../../../global/Beater";
import AudioChannel from "../../../player/AudioChannel";
import { easeInQuad } from "../../../util/Easing";
import type { Color4 } from "../../base/Color";
import { anchor } from "../../drawable/Anchor";
import { Blend } from "../../drawable/Blend";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ImageView } from "../../view/ImageView";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";


export class SideFlashlight extends ViewGroup implements IBeat {
  private readonly left: ImageView
  private readonly right: ImageView

  constructor(color: Color4, width?: number) {
    super()
    const w = width ?? SizeMode.percentValue(0.2)
    const texture = TextureStore.getTexture('Gradient')

    const left = new ImageView()
    {
      left.texture = texture
      left.size = vector2.fromValues(w, SizeMode.FILL_HEIGHT)
      left.anchor = anchor.TopLeft
      left.blend = Blend.Additive
      left.objectFit = 'fill'
      left.color = color
    }
    const right = new ImageView()
    {
      right.texture = texture
      right.size = vector2.fromValues(w, SizeMode.FILL_HEIGHT)
      right.anchor = anchor.TopRight
      right.blend = Blend.Additive
      right.objectFit = 'fill'
      right.origin = anchor.Center
      right.color = color
    }
    right.scaleX = -1
    left.alpha = 0
    right.alpha = 0
    this.left = left
    this.right = right

    this.addViews([left, right])

    BeatDispatcher.register(this)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
    if (!BeatState.isAvailable)
      return;
    // const adjust = Math.min(BeatState.nextBeatRMS + 0.4, 1)
    let leftAdjust = AudioChannel.leftVolume(),//Math.min(AudioChannel.leftVolume() + 0.4, 1),
      rightAdjust = AudioChannel.rightVolume()//Math.min(AudioChannel.rightVolume() + 0.4, 1)
    let left = 0, right = 0
    const lightTimeFunc = easeInQuad
    const beatLength = gap
    if (BeatState.isKiai) {
      if ((BeatState.beatIndex & 1) === 0) {
        left = 0.54 * leftAdjust
        this.left.transform()
          .fadeTo(left, 60)
          .fadeTo(0, beatLength, lightTimeFunc)
      } else {
        right = 0.54 * rightAdjust
        this.right.transform()
          .fadeTo(right, 60)
          .fadeTo(0, beatLength, lightTimeFunc)
      }
    } else {
      if ((BeatState.beatIndex & 0b11) === 0 && BeatState.beatIndex != 0) {
        left = 0.3 * leftAdjust
        right = 0.3 * rightAdjust
        this.left.transform()
          .fadeTo(left, 60)
          .fadeTo(0, beatLength, lightTimeFunc)
        this.right.transform()
          .fadeTo(right, 60)
          .fadeTo(0, beatLength, lightTimeFunc)
      }
    }
  }

  protected onDispose(): void {
    BeatDispatcher.unregister(this)
  }

}