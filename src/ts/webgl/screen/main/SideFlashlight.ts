import {BeatBox} from "../../box/BeatBox";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";
import Coordinate from "../../base/Coordinate";
import {Anchor} from "../../drawable/Anchor";
import {BeatState} from "../../../global/Beater";
import AudioChannel from "../../../player/AudioChannel";
import {easeInQuad} from "../../../util/Easing";
import {Blend} from "../../drawable/Blend";
import type {Color} from "../../base/Color";
import {Size} from "../../drawable/Size";

export class SideFlashlight extends BeatBox {

  private readonly left: ImageDrawable
  private readonly right: ImageDrawable

  constructor(color: Color, width?: number) {
    super({
      size: Size.FillParentSize,
    });
    const w = width ?? Coordinate.width * 0.2
    const texture = TextureStore.get('Gradiant')
    const left = new ImageDrawable(texture, {
      size: Size.of(w, Size.FillParent),
      anchor: Anchor.TopLeft,
      blend: Blend.Additive,
      color
    })
    const right = new ImageDrawable(texture, {
      size: Size.of(w, Size.FillParent),
      anchor: Anchor.TopRight,
      blend: Blend.Additive,
      color
    })
    right.setScaleX(-1)
    left.setAlpha(0)
    right.setAlpha(0)
    this.add(left, right)
    this.left = left
    this.right = right
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (!this.isAvailable)
      return
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

}