import { color, type Color4 } from "../base/Color";

export class Interpolation {

    public static damp(start: number, final: number, base: number, exponent: number) {
        const amount = 1 - Math.pow(base, exponent)
        return start + (final - start) * amount
    }

    public static valueAt(factor: number, start: number, end: number) {
        return start + factor * (end - start)
    }

    public static colorAt(randomValue: number, startColor: Color4, endColor: Color4) {
        const r = startColor[0] + (endColor[0] - startColor[0]) * randomValue
        const g = startColor[1] + (endColor[1] - startColor[1]) * randomValue
        const b = startColor[2] + (endColor[2] - startColor[2]) * randomValue
        return color.color(r, g, b, 1)
        // return new Color(r, g, b, 1)
    }

}