import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {FadeLogo} from "./FadeLogo";
import {Anchor} from "../../drawable/Anchor";
import {Size} from "../../drawable/Size";
import {Vector} from "../../graphic/core/Vector2";
import {BackButton} from "./BackButton";

export class SongPlayScreen extends Box {

  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new FadeLogo({
          size: Size.of(180, 180),
          anchor: Anchor.Center,
        }),
        new BackButton(),
        new LogoBounceBox({
          size: Size.of(200, 200),
          anchor: Anchor.BottomRight,
          offset: Vector(16, 34)
        })
      ]
    });
    // const fadeLogo = new FadeLogo({
    //   size: Size.of(180, 180),
    //   anchor: Anchor.Center,
    // })
    // const logo = new LogoBounceBox({
    //   size: Size.of(225, 225),
    //   anchor: Anchor.BottomRight,
    //   offset: Vector(16, 34)
    // })
    // const bottomBar = new ImageDrawable(TextureStore.get('Square'), {
    //   size: Size.of(Size.FillParent, 56),
    //   anchor: Anchor.BottomLeft,
    //   color: Color.fromHex(0x0, 128)
    // })
    // const backButton = new BackButton()
    // this.add(fadeLogo, bottomBar, backButton, logo)
  }
}