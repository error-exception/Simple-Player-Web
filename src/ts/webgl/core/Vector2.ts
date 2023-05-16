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

}

