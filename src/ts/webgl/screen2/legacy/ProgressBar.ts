import OSUPlayer from "../../../player/OSUPlayer";
import { color } from "../../base/Color";
import { anchor } from "../../drawable/Anchor";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ImageView } from "../../view/ImageView";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";

export class ProgressBar extends ViewGroup {

  private progress: ImageView

  constructor() {
    super();
    const background = new ImageView()
    {
      background.texture = TextureStore.getTexture('Square')
      background.size = SizeMode.fill()
      background.color = color.fromHex(0xffffff, 40)
      background.objectFit = 'fill'
    }
    const progress = new ImageView()
    {
      progress.texture = TextureStore.getTexture('Square')
      progress.size = SizeMode.fill()
      progress.color = color.fromHex(0xffffff, 80)
      progress.origin = anchor.CenterLeft
      progress.scaleX = 0
      progress.objectFit = 'fill'
      this.progress = progress
    }
    this.addViews([background, progress])
  }

  onUpdate() {
    super.onUpdate();
    this.progress.scaleX = OSUPlayer.currentTime.value / OSUPlayer.duration.value
  }
}