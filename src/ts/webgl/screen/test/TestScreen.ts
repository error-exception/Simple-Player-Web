import {Box} from "../../box/Box";
import {TextureStore} from "../../texture/TextureStore";
import {Size} from "../../drawable/Size";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {Color} from "../../base/Color";
import {Vector} from "../../core/Vector2";

export class TestScreen extends Box {

  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new StdNote().apply(it => {
          it.setTranslate(Vector(100, 100))
        }),
        new StdNote().apply(it => {
          it.setTranslate(Vector(180, 100))
        }),
        new StdNote().apply(it => {
          it.setTranslate(Vector(260, 100))
        }),
        new StdNote().apply(it => {
          it.setTranslate(Vector(340, 100))
        })
      ]
    });
  }
}

class StdNote extends Box {
  constructor() {
    super({
      size: Size.of(64),
      children: [
        new ImageDrawable(TextureStore.get('WhiteRound'), {
          size: Size.FillParentSize,
          color: Color.fromHex(0x0090ff)
        }).apply((it) => {
          it.setScale(Vector(0.9))
        }),
        new ImageDrawable(TextureStore.get('StdNoteCircle'), {
          size: Size.FillParentSize
        })
      ]
    });
  }
}