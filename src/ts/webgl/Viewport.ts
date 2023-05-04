
interface ViewportParam {
    x: number
    y: number
    width: number
    height: number
}

export type Percent = string /* 0%, 50%, 100% */
export type WidthUnit = string /* 0w, 50w, 100w */
export type HeightUnit = string /* 0h, 50h, 100h */
/**
 * 屏幕中心为坐标原点
 */
export class Viewport {

    public x: number
    public y: number
    public width: number
    public height: number

    /**
     * 参数取值为屏幕坐标系
     * @param p
     */
    public constructor(p: ViewportParam) {
        this.x = p.x
        this.y = p.y
        this.width = p.width
        this.height = p.height
    }

    public convertUnitX(x: number | Percent | WidthUnit) {
        if (typeof x === "number") {
            return x
        } else {
            const ch = x.charAt(x.length - 1)
            let v = 0
            if (ch === '%') {
                v = this.percentX(x)
            } else if (ch === 'w') {
                v = this.unitWidth(x)
            } else if (ch === 'h') {
                v = this.unitHeight(x)
            }
            if (!isNaN(v)) {
                return v
            }
        }
        throw new Error('invalid param: ' + x)
    }

    public convertUnitY(y: number | Percent | HeightUnit) {
        if (typeof y === "number") {
            return y
        } else {
            const ch = y.charAt(y.length - 1)
            let v = 0
            if (ch === '%') {
                v = this.percentY(y)
            } else if (ch === 'w') {
                v = this.unitWidth(y)
            } else if (ch === 'h') {
                v = this.unitHeight(y)
            }
            if (!isNaN(v)) {
                return v
            }
        }
        throw new Error('invalid param: ' + y)
    }

    private percentX(percent: string): number {
        const index = percent.lastIndexOf('%')
        if (index === -1) {
            return NaN
        }
        const n = parseInt(percent.substring(0, index))
        return this.width * (n / 100)
    }

    private percentY(percent: string): number {
        const index = percent.lastIndexOf('%')
        if (index === -1) {
            return NaN
        }
        const n = parseInt(percent.substring(0, index))
        return this.height * (n / 100)
    }

    private unitWidth(u: string) {
        const index = u.lastIndexOf('w')
        if (index === -1) {
            return NaN
        }
        const n = parseInt(u.substring(0, index))
        return (n / 100) * this.width
    }

    private unitHeight(u: string) {
        const index = u.lastIndexOf('h')
        if (index === -1) {
            return NaN
        }
        const n = parseInt(u.substring(0, index))
        return (n / 100) * this.height
    }

    public alignmentX(horizontal: 'center' | 'left' | 'right', width: number = 0): number {
        if (horizontal === "center") {
            return -(width / 2)
        } else if (horizontal === 'left') {
            return -this.width / 2
        } else {
            return this.width / 2 - width
        }
    }

    public alignmentY(vertical: 'center' | 'top' | 'bottom', height: number = 0) {
        if (vertical === "center") {
            return height / 2
        } else if (vertical === "top") {
            return this.height / 2
        } else {
            return -this.height / 2 + height
        }
    }

    public convertX(x: number): number {
        const half = this.width / 2
        return x * (1 / half)
    }

    public convertY(y: number) {
        const half = this.height / 2
        return y * (1 /  half)
    }

    public scaledXLength(length: number) {
        return 2 / this.width * length
    }

    public scaledYLength(length: number) {
        return 2 / this.height * length
    }

}

export interface Alignment {

    horizontal?: 'center' | 'left' | 'right'

    vertical?: 'center' | 'top' | 'bottom'

}

export interface Bound {
    x?: number | Percent | WidthUnit
    y?: number | Percent | HeightUnit
    width: number | Percent | WidthUnit
    height: number | Percent | HeightUnit
}

export const defaultViewport: Viewport = new Viewport({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
})
