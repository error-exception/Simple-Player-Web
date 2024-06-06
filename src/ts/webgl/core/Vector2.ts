export class Vector2 {

    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    public isZero(): boolean {
        return this.x === 0 && this.y === 0
    }

    /**
     * 一个单位向量，注意，不能对这个向量进行修改
     */
    public static one = new Vector2(1, 1)
    public static zero = new Vector2(0, 0)

    public static newZero(): Vector2 {
        return new Vector2(0, 0)
    }

    public static newOne() {
        return new Vector2(1, 1)
    }

    public equals(v2: Vector2) {
        return this.x === v2.x && this.y === v2.y
    }

    public add(vec2: Vector2): Vector2 {
        return new Vector2(vec2.x + this.x, vec2.y + this.y)
    }

    public addValue(v: number) {
        return new Vector2(this.x + v, this.y + v)
    }

    public increment(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    public minus(vec2: Vector2): Vector2 {
        return new Vector2(this.x - vec2.x, this.y - vec2.y)
    }

    public minusValue(v: number) {
        return new Vector2(this.x - v, this.y - v)
    }

    public div(v: Vector2) {
        return new Vector2(this.x / v.x, this.y / v.y)
    }

    public divValue(v: number) {
        return new Vector2(this.x / v, this.y / v)
    }

    public mul(v: Vector2) {
        return new Vector2(this.x * v.x, this.y * v.y)
    }

    public mulValue(v: number) {
        return new Vector2(this.x * v, this.y * v)
    }

    public copy() {
        return new Vector2(this.x, this.y)
    }

    public negative() {
        return new Vector2(-this.x, -this.y)
    }
    // public static negative(src: Vector2): Vector2 {
    //     return new Vector2(-src.x, -src.y)
    // }

    // public static multi(src: Vector2, n: number): Vector2 {
    //     return new Vector2(src.x * n, src.y * n)
    // }

    // public static dotMulti(src: Vector2, vec2: Vector2): number {
    //     return src.x * vec2.x + src.y * vec2.y
    // }

    // public static crossMulti(src: Vector2, vec2: Vector2): Vector2 {
    //     return new Vector2(src.x * vec2.y, vec2.x * src.y)
    // }

    // public static norm(src: Vector2): number {
    //     return Math.sqrt(src.x ** 2 + src.y ** 2)
    // }

    public set(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public setFrom(from: Vector2) {
        this.x = from.x
        this.y = from.y
    }

    public distance(other: Vector2) {
        return Math.sqrt(
          (this.x - other.x) * (this.x - other.x)
          +
          (this.y - other.y) * (this.y - other.y)
        )
    }

}

export function Vector(x: number = 0, y?: number) {
    return new Vector2(x, y === undefined ? x : y)
}