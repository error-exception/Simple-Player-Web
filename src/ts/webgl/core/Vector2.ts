export class Vector2 {

    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    public isZero(): boolean {
        return this.x === 0 && this.y === 0
    }

    public static newZero(): Vector2 {
        return new Vector2(0, 0)
    }

    public equals(v2: Vector2) {
        return this.x === v2.x && this.y === v2.y
    }

    public add(vec2: Vector2): Vector2 {
        return new Vector2(vec2.x + this.x, vec2.y + this.y)
    }

    public increment(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    public minus(vec2: Vector2): Vector2 {
        return new Vector2(this.x - vec2.x, this.y - vec2.y)
    }

    public copy() {
        return new Vector2(this.x, this.y)
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

}

export function createV2(x: number, y: number) {
    return new Vector2(x, y)
}