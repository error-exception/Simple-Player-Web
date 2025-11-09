import {Vector2} from "../core/Vector2";
import { vector2 } from "../matrix/vec2";

export class Triangle {

  public angle1 = Vector2.newZero()
  public angle2 = Vector2.newZero()
  public angle3 = Vector2.newZero()

  public setFrom(triangle: Triangle) {
    this.angle1.setFrom(triangle.angle1)
    this.angle2.setFrom(triangle.angle2)
    this.angle3.setFrom(triangle.angle3)
  }

  public setVector(angle1: Vector2, angle2: Vector2, angle3: Vector2) {
    this.angle1.setFrom(angle1)
    this.angle2.setFrom(angle2)
    this.angle3.setFrom(angle3)
  }

  public copy() {
    const triangle = new Triangle()
    triangle.setFrom(this)
    return triangle
  }

  public equals(other: Triangle): boolean {
    return this.angle1.equals(other.angle1) && this.angle2.equals(other.angle2) && this.angle3.equals(other.angle3)
  }

}

export type Triangle3 = {
  angle1: vec2,
  angle2: vec2,
  angle3: vec2
}

export namespace triangle {

  export function create(): Triangle3 {
    return {
      angle1: vector2.create(),
      angle2: vector2.create(),
      angle3: vector2.create()
    }
  }

  export function clone(triangle: Triangle3): Triangle3 {
    return {
      angle1: vector2.clone(triangle.angle1),
      angle2: vector2.clone(triangle.angle2),
      angle3: vector2.clone(triangle.angle3)
    }
  }

  export function set(triangle: Triangle3, angle1: vec2, angle2: vec2, angle3: vec2): Triangle3 {
    vector2.copy(triangle.angle1, angle1)
    vector2.copy(triangle.angle2, angle2)
    vector2.copy(triangle.angle3, angle3)
    return triangle
  }

  export function copy(out: Triangle3, triangle: Triangle3): Triangle3 {
    vector2.copy(out.angle1, triangle.angle1)
    vector2.copy(out.angle2, triangle.angle2)
    vector2.copy(out.angle3, triangle.angle3)
    return out
  }

  export function equals(triangle: Triangle3, other: Triangle3): boolean {
    return vector2.equals(triangle.angle1, other.angle1) && vector2.equals(triangle.angle2, other.angle2) && vector2.equals(triangle.angle3, other.angle3)
  }

  export function transformSelfMat3(triangle: Triangle3, mat3: mat3): Triangle3 {
    vector2.transformMat3(triangle.angle1, triangle.angle1, mat3)
    vector2.transformMat3(triangle.angle2, triangle.angle2, mat3)
    vector2.transformMat3(triangle.angle3, triangle.angle3, mat3)
    return triangle
  }

  export function transformMat3(out: Triangle3, triangle: Triangle3, mat3: mat3): Triangle3 {
    vector2.transformMat3(out.angle1, triangle.angle1, mat3)
    vector2.transformMat3(out.angle2, triangle.angle2, mat3)
    vector2.transformMat3(out.angle3, triangle.angle3, mat3)
    return out
  }

}