import {Box} from "../../box/Box";
import {LegacyBeatLogoBox} from "./LegacyBeatLogoBox";
import {Flashlight} from "../main/Flashlight";
import {Color} from "../../base/Color";

export class LegacyScreen extends Box {

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    this.add(
      new LegacyBeatLogoBox(gl, {
        size: [520, 520]
      }),
      new Flashlight(gl, {
        size: ['fill-parent', 'fill-parent'],
        color: Color.fromHex(0xffffff)
      })
    )
  }

}