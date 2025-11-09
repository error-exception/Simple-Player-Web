import { clamp } from "../../Utils";
import type {Equatable} from "../graphic/core/Equatable";

export class Color implements Equatable<Color> {

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

    public setFrom(c: Color) {
        this.red = c.red
        this.green = c.green
        this.blue = c.blue
        this.alpha = c.alpha
    }

    public set(red: number, green: number, blue: number, alpha: number) {
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }

    public equals(other: Color): boolean {
        return this.red === other.red && this.green === other.green && this.blue === other.blue && this.alpha === other.alpha
    }

    public static fromRGB(red: number, green: number, blue: number) {
        return new Color(red / 255, green / 255, blue / 255, 1)
    }
}

export type Color4 = [number, number, number, number]

export namespace color {

    export const White = fromHex(0xffffff)

    export const Black = fromHex(0x0)

    export const Transparent = fromHex(0, 0)

    export function clone(color: Color4): Color4 {
        return [...color]
    }

    export function copy(out: Color4, color: Color4) {
        out[0] = color[0]
        out[1] = color[1]
        out[2] = color[2]
        out[3] = color[3]
    }

    export function color(red: number, green: number, blue: number, alpha: number = 1): Color4 {
        return [ red, green, blue, alpha ]
    }

    export function red(color: Color4): number {
        return color[0]
    }

    export function green(color: Color4): number {
        return color[1]
    } 
    export function blue(color: Color4): number {
        return color[2]
    } 
    export function alphe(color: Color4): number {
        return color[3]
    }

    export function fromHex(hex: number, alphaInt: number = 255): Color4 {
        const red = (hex >> 16) & 0xff
        const green = (hex >> 8) & 0xff
        const blue = (hex) & 0xff
        return [red / 255, green / 255, blue / 255, alphaInt / 255]
    }

    export function lum(color: Color4, value: number, alpha: boolean = false) {
        const out = clone(color)
        lumTo(color, value, alpha, out)
        return out
    }

    export function set(color: Color4, red: number, green: number, blue: number, alpha: number) {
        color[0] = red
        color[1] = green
        color[2] = blue
        color[3] = alpha
    }

    export function lumTo(color: Color4, value: number, alpha: boolean = false, out: Color4) {
        const r = clamp(red(color) + value, 0, 1)
        const g = clamp(green(color) + value, 0, 1)
        const b = clamp(blue(color) + value, 0, 1)
        if (alpha) {
            const a = clamp(color[3] + value, 0, 1)
            set(out, r, g, b, a)
        } else {
            set(out, r, g, b, color[3])
        }
    }
}