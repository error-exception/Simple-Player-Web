import {Vector2} from "../core/Vector2";

export class Quad {
  topLeft = Vector2.newZero()
  bottomLeft = Vector2.newZero()
  topRight = Vector2.newZero()
  bottomRight = Vector2.newZero()

  public copy() {
    const quad = new Quad()
    quad.topLeft.setFrom(this.topLeft)
    quad.bottomLeft.setFrom(this.bottomLeft)
    quad.topRight.setFrom(this.topRight)
    quad.bottomRight.setFrom(this.bottomRight)
    return quad
  }

  public setFrom(quad: Quad) {
    this.topLeft.setFrom(quad.topLeft)
    this.bottomLeft.setFrom(quad.bottomLeft)
    this.topRight.setFrom(quad.topRight)
    this.bottomRight.setFrom(quad.bottomRight)
  }

  public copyTo(out: Quad) {
    out.setFrom(this)
  }

  public equals(quad: Quad) {
    return this.topLeft.equals(quad.topLeft) && this.bottomLeft.equals(quad.bottomLeft) && this.topRight.equals(quad.topRight) && this.bottomRight.equals(quad.bottomRight)
  }

  public inBound(position: Vector2) {
    const A = this.bottomLeft,
      B = this.topLeft,
      C = this.topRight,
      D = this.bottomRight

    const a = (B.x - A.x) * (position.y - A.y) - (B.y - A.y) * (position.x - A.x)
    const b = (C.x - B.x) * (position.y - B.y) - (C.y - B.y) * (position.x - B.x)
    const c = (D.x - C.x) * (position.y - C.y) - (D.y - C.y) * (position.x - C.x)
    const d = (A.x - D.x) * (position.y - D.y) - (A.y - D.y) * (position.x - D.x)

    return (a >= 0 && b >= 0 && c >= 0 && d >= 0) ||
      (a <= 0 && b <= 0 && c <= 0 && d <= 0)

  }
}