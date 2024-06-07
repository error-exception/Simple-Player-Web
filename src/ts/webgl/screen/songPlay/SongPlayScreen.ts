import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {FadeLogo} from "./FadeLogo";
import {Anchor} from "../../drawable/Anchor";

export class SongPlayScreen extends Box {

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent']
    });
    const fadeLogo = new FadeLogo({
      size: [180, 180],
      anchor: Anchor.Center,
    })
    const logo = new LogoBounceBox({
      size: [225, 225],
      anchor: Anchor.BottomRight,
      offset: [16, 34]
    })
    // logo.scale = this.targetScale
    // logo.translate = Vector(460, 540)
    this.add(fadeLogo, logo)
  }
}