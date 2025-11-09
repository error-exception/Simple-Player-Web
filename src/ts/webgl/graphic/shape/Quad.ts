import { Vector2 } from "../core/Vector2";
import { vector2 } from "../matrix/vec2";
import type { Rectangle4 } from "./Rectangle";

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

export type Quad4 = {
  topLeft: vec2
  topRight: vec2
  bottomLeft: vec2
  bottomRight: vec2
}

export namespace quad {

  export function create(): Quad4 {
    return {
      topLeft: vector2.create(),
      topRight: vector2.create(),
      bottomLeft: vector2.create(),
      bottomRight: vector2.create()
    }
  }

  export function clone(q: Quad4): Quad4 {
    return {
      topLeft: vector2.clone(q.topLeft),
      topRight: vector2.clone(q.topRight),
      bottomLeft: vector2.clone(q.bottomLeft),
      bottomRight: vector2.clone(q.bottomRight)
    }
  }

  export function copy(out: Quad4, src: Quad4) {
    vector2.copy(out.topLeft, src.topLeft)
    vector2.copy(out.topRight, src.topRight)
    vector2.copy(out.bottomLeft, src.bottomLeft)
    vector2.copy(out.bottomRight, src.bottomRight)
  }

  export function equals(q1: Quad4, q2: Quad4) {
    return vector2.equals(q1.topLeft, q2.topRight) &&
      vector2.equals(q1.topRight, q2.topRight) &&
      vector2.equals(q1.bottomLeft, q2.bottomLeft) &&
      vector2.equals(q1.bottomRight, q2.bottomRight)
  }

  export function inBound(quad: Quad4, position: vec2) {
    const A = quad.bottomLeft,
      B = quad.topLeft,
      C = quad.topRight,
      D = quad.bottomRight

    const a = (B[0] - A[0]) * (position[1] - A[1]) - (B[1] - A[1]) * (position[0] - A[0])
    const b = (C[0] - B[0]) * (position[1] - B[1]) - (C[1] - B[1]) * (position[0] - B[0])
    const c = (D[0] - C[0]) * (position[1] - C[1]) - (D[1] - C[1]) * (position[0] - C[0])
    const d = (A[0] - D[0]) * (position[1] - D[1]) - (A[1] - D[1]) * (position[0] - D[0])

    return (a >= 0 && b >= 0 && c >= 0 && d >= 0) ||
      (a <= 0 && b <= 0 && c <= 0 && d <= 0)
  }

  export function transformMat3(out: Quad4, q: Quad4, m: mat3): Quad4 {
    vector2.transformMat3(out.topLeft, q.topLeft, m)
    vector2.transformMat3(out.topRight, q.topRight, m)
    vector2.transformMat3(out.bottomLeft, q.bottomLeft, m)
    vector2.transformMat3(out.bottomRight, q.bottomRight, m)
    return out
  }

  export function fromRectangle(out: Quad4, rect: Rectangle4): Quad4 {
    vector2.set(out.topLeft, rect.topLeft[0], rect.topLeft[1])
    vector2.set(out.topRight, rect.bottomRight[0], rect.topLeft[1])
    vector2.set(out.bottomLeft, rect.topLeft[0], rect.bottomRight[1])
    vector2.set(out.bottomRight, rect.bottomRight[0], rect.bottomRight[1])
    return out
  }

  /**
 * 判断点是否在四边形内部
 * @param point 要判断的点
 * @param quad 四边形
 * @returns 点是否在四边形内部
 */
  export function isPointInQuad(quad: Quad4, point: vec2): boolean {
    // 将四边形的四个点按顺时针或逆时针顺序排列
    const points = [
      quad.topLeft,
      quad.topRight,
      quad.bottomRight,
      quad.bottomLeft
    ];

    let inside = false;

    // 射线法：从点向右发射水平射线，计算与多边形边的交点数量
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i++) {
      const xi = points[i][0], yi = points[i][1];
      const xj = points[j][0], yj = points[j][1];

      // 检查点是否在边的y值范围内
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

}
