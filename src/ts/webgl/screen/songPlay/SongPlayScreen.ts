import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {Vector} from "../../core/Vector2";
import {FadeLogo} from "./FadeLogo";
import {Anchor} from "../../drawable/Anchor";

export class SongPlayScreen extends Box {

  private targetScale = Vector(0.4)

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent']
    });
    const fadeLogo = new FadeLogo({
      size: [180, 180],
      anchor: Anchor.Center,
    })
    const logo = new LogoBounceBox({
      size: [520, 520],
      anchor: Anchor.BottomRight,
    })
    logo.scale = this.targetScale
    logo.translate = Vector(460, 540)
    this.add(fadeLogo, logo)
  }
}