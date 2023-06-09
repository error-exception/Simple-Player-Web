export class Color {

    public red: number = 0.0
    public green: number = 0
    public blue: number = 0
    public alpha: number = 0

    constructor(r: number, g: number, b: number, a: number) {
        this.red = r
        this.blue = b
        this.green = g
        this.alpha = a
    }

    public static fromHex(hex: number, alphaInt: number = 255) {
        const red = (hex >> 16) & 0xff
        const green = (hex >> 8) & 0xff
        const blue = (hex) & 0xff
        return new Color(red / 255, green / 255, blue / 255, alphaInt / 255)
    }

}