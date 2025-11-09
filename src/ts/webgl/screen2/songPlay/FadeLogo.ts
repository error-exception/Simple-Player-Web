import { BeatDispatcher, type IBeat } from "../../../global/Beater";
import { easeOut, easeOutQuint } from "../../../util/Easing";
import { Blend } from "../../drawable/Blend";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ImageView } from "../../view/ImageView";

export class FadeLogo extends ImageView implements IBeat {

  constructor() {
    super();
    this.texture = TextureStore.getTexture("Logo");
    this.blend = Blend.Additive
    this.alpha = 0.3
    BeatDispatcher.register(this);
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
    this.transform()
      .fadeTo(0.3, 60, easeOut)
      .fadeTo(0.1, gap * 2, easeOutQuint)
  }

  public onDispose(): void {
    super.onDispose()
    BeatDispatcher.unregister(this);
  }

}