import {Box} from "../../box/Box";
import {TextDrawable} from "../../drawable/TextDrawable";
import {Anchor} from "../../drawable/Anchor";
import {Size} from "../../drawable/Size";
import {Color} from "../../base/Color";
import {Toaster} from "../../../global/Toaster";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {easeOutBack, easeOutQuint} from "../../../util/Easing";

export class LegacyToast extends Box {

  private text: TextDrawable

  constructor() {
    super({
      size: Size.of(Size.FillParent, 48),
      anchor: Anchor.Center
    });
    this.add(
      new ImageDrawable(TextureStore.getTexture('Square'), {
        size: Size.FillParentSize,
        color: Color.fromHex(0, 0xc0)
      }),
      this.text = new TextDrawable({
        text: '',
        anchor: Anchor.Center,
        size: Size.of(10, 10),
        fontColor: Color.White,
        fontSize: 24,
        letterSpacing: 6,
        fitSize: true
      })
    )
    this.setScaleY(0)
    this.setAlpha(0)
    this.addDisposable(() => {
      return Toaster.onToast.add(message => {
        this.text.setText(message)
        this.transform()
          .fadeTo(1, 200, easeOutBack)
          .scaleYTo(1, 200, easeOutBack)
          .delay(3000).fadeTo(0, 350, easeOutQuint)
          .delay(3000).scaleYTo(0, 350, easeOutQuint)
      })
    })
  }

}