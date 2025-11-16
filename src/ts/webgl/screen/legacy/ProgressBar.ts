import {Box, BoxConfig} from "../../box/Box";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {Size} from "../../drawable/Size";
import {Color} from "../../base/Color";
import {Anchor} from "../../drawable/Anchor";
import OSUPlayer from "../../../player/OSUPlayer";

export class ProgressBar extends Box {

  private progress: ImageDrawable

  constructor(config: BoxConfig) {
    super(config);
    this.addTransformable(
      new ImageDrawable(TextureStore.getTexture('Square'), {
        size: Size.FillParentSize,
        color: Color.fromHex(0xffffff, 40)
      }),
      this.progress = new ImageDrawable(TextureStore.getTexture('Square'), {
        size: Size.FillParentSize,
        color: Color.fromHex(0xffffff, 80),
        origin: Anchor.CenterLeft
      })
    )
  }

  onUpdate() {
    super.onUpdate();
    this.progress.setScaleX(OSUPlayer.currentTime.value / OSUPlayer.duration.value)
  }
}