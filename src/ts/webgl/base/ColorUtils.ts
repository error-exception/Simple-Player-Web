import {Color} from "./Color";
import {clamp} from "../../Utils";

export class ColorUtils {

  public static lum(color: Color, value: number, alpha: boolean = false) {
    const out = Color.Transparent.copy()
    this.lumTo(color, value, alpha, out)
    return out
  }

  public static lumTo(color: Color, value: number, alpha: boolean = false, out: Color) {
    const red = clamp(color.red + value, 0, 1)
    const green = clamp(color.green + value, 0, 1)
    const blue = clamp(color.blue + value, 0, 1)
    if (alpha) {
      const a = clamp(color.alpha + value, 0, 1)
      out.set(red, green, blue, a)
    } else {
      out.set(red, green, blue, color.alpha)
    }
  }

}
