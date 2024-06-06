import {Color} from "../base/Color";

export class Interpolation {

    public static damp(start: number, final: number, base: number, exponent: number) {
        const amount = 1 - Math.pow(base, exponent)
        return start + (final - start) * amount
    }

    public static valueAt(factor: number, start: number, end: number) {
        return start + factor * (end - start)
    }

    public static colorAt(randomValue: number, startColor: Color, endColor: Color) {
        const r = startColor.red + (endColor.red - startColor.red) * randomValue
        const g = startColor.green + (endColor.green - startColor.green) * randomValue
        const b = startColor.blue + (endColor.blue - startColor.blue) * randomValue
        return new Color(r, g, b, 1)
    }

}