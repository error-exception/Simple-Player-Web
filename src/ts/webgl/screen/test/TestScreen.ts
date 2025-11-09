import {Box} from "../../box/Box";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {Size} from "../../drawable/Size";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {Color} from "../../base/Color";
import {Vector} from "../../graphic/core/Vector2";
import {Anchor} from "../../drawable/Anchor";

export class TestScreen extends Box {

  constructor() {
    super({
      size: Size.FillParentSize,
      origin: Anchor.BottomRight,
      children: [
        new StdNote().apply(it => {
          it.transform()
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
            .scaleTo(Vector(0.5), 1000)
            .scaleTo(Vector(1), 1000)
        }),
      ]
    });
  }
}

class StdNote extends Box {
  constructor() {
    super({
      size: Size.of(128),
      anchor: Anchor.Center,
      children: [
        new ImageDrawable(TextureStore.getTexture('WhiteRound'), {
          size: Size.FillParentSize,
          color: Color.fromHex(0x0090ff),
          anchor: Anchor.Center
        }),
        new ImageDrawable(TextureStore.getTexture('StdNoteCircle'), {
          size: Size.FillParentSize,
          anchor: Anchor.Center
        })
      ]
    });
  }
}