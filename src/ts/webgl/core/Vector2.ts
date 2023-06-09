export class Vector2 {

    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    public static isZero(v: Vector2): boolean {
        return v.x === 0 && v.y === 0
    }

    public static newZero(): Vector2 {
        return new Vector2(0, 0)
    }

    public static equals(v1: Vector2, v2: Vector2) {
        return v1.x === v2.x && v1.y === v2.y
    }

    public static add(src: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(vec2.x + src.x, vec2.y + src.y)
    }

    public static minus(src: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(src.x - vec2.x, src.y - vec2.y)
    }

    public static negative(src: Vector2): Vector2 {
        return new Vector2(-src.x, -src.y)
    }

    public static multi(src: Vector2, n: number): Vector2 {
        return new Vector2(src.x * n, src.y * n)
    }

    public static dotMulti(src: Vector2, vec2: Vector2): number {
        return src.x * vec2.x + src.y * vec2.y
    }

    public static crossMulti(src: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(src.x * vec2.y, vec2.x * src.y)
    }

    public static norm(src: Vector2): number {
        return Math.sqrt(src.x ** 2 + src.y ** 2)
    }

    public static set(src: Vector2, x: number, y: number) {
        src.x = x
        src.y = y
    }

}

