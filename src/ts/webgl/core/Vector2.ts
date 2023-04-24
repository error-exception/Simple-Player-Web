export class Vector2 {

    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    public add(vec2: Vector2): Vector2 {
        return new Vector2(vec2.x + this.x, vec2.y + this.y)
    }

    public minus(vec2: Vector2): Vector2 {
        return new Vector2(this.x - vec2.x, this.y - vec2.y)
    }

    public negative(): Vector2 {
        return new Vector2(-this.x, -this.y)
    }

    public multi(n: number): Vector2 {
        return new Vector2(this.x * n, this.y * n)
    }

    public dotMulti(vec2: Vector2): number {
        return this.x * vec2.x + this.y * vec2.y
    }

    public crossMulti(vec2: Vector2): Vector2 {
        return new Vector2(this.x * vec2.y, vec2.x * this.y)
    }

    public norm(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

}

