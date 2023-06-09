export class Interpolation {

    public static dump(start: number, final: number, base: number, exponent: number) {
        const amount = 1 - Math.pow(base, exponent)
        return start + (final - start) * amount
    }

    public static valueAt(factor: number, start: number, end: number) {
        return start + factor * (end - start)
    }

}