export class Color {

    public static White = Color.fromHex(0xffffff)
    public static Black = Color.fromHex(0x0)
    public static Transparent = Color.fromHex(0, 0)

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

    public copy() {
        return new Color(this.red, this.green, this.blue, this.alpha)
    }

}