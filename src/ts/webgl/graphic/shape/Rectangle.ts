import {Vector2} from "../core/Vector2";
import { vector2 } from "../matrix/vec2";

export class Rectangle {
  topLeft = Vector2.newZero()
  bottomRight = Vector2.newZero()

  public getWidth() {
    return this.bottomRight.x - this.topLeft.x
  }

  public getHeight() {
    return this.bottomRight.y - this.topLeft.y
  }

  public setWidth(width: number) {
    this.bottomRight.x = this.topLeft.x + width
  }

  public setHeight(height: number) {
    this.bottomRight.y = this.topLeft.y + height
  }

  public copy(): Rectangle {
    const rectangle = new Rectangle()
    rectangle.topLeft.setFrom(this.topLeft)
    rectangle.bottomRight.setFrom(this.bottomRight)
    return rectangle
  }

  public setFrom(rectangle: Rectangle) {
    this.topLeft.setFrom(rectangle.topLeft)
    this.bottomRight.setFrom(rectangle.bottomRight)
  }

  public set(x: number, y: number, width: number, height: number) {
    this.topLeft.set(x, y)
    this.bottomRight.set(x + width, y + height)
  }

  /**
   * 设置矩形的 TopLeft 坐标，并自动调整 BottomRight 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  public setTopLeft(x: number, y: number) {
    const width = this.getWidth(), height = this.getHeight()
    this.topLeft.set(x, y)
    this.bottomRight.set(x + width, y + height)
  }

  /**
   * 设置矩形的 BottomRight 坐标，并自动调整 TopLeft 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  public setBottomRight(x: number, y: number) {
    const width = this.getWidth(), height = this.getHeight()
    this.bottomRight.set(x, y)
    this.topLeft.set(x - width, y - height)
  }

  /**
   * 检查 position 是否在矩形内
   * @param position
   */
  public inBound(position: Vector2) {
    return position.x >= this.topLeft.x &&
      position.x <= this.bottomRight.x &&
      position.y >= this.topLeft.y &&
      position.y <= this.bottomRight.y
  }

}

export type Rectangle4 = {
  topLeft: vec2,
  bottomRight: vec2
}

export namespace rect {

  export function create(): Rectangle4 {
    return { 
      topLeft: vector2.create(),
      bottomRight: vector2.create()
    }
  }

  export function copy(out: Rectangle4, src: Rectangle4): Rectangle4 {
    return {
      topLeft: vector2.copy(out.topLeft, src.topLeft),
      bottomRight: vector2.copy(out.bottomRight, src.bottomRight)
    }
  }

  export function clone(rect: Rectangle4): Rectangle4 {
    const result = create()
    copy(result, rect)
    return result
  }

  export function equals(rect1: Rectangle4, rect2: Rectangle4) {
    return vector2.equals(rect1.topLeft, rect2.topLeft) && 
      vector2.equals(rect1.bottomRight, rect2.bottomRight)
  }

   export function inBound(rect: Rectangle4, position: vec2) {
    return position[0] >= rect.topLeft[0] &&
      position[0] <= rect.bottomRight[0] &&
      position[1] >= rect.topLeft[1] &&
      position[1] <= rect.bottomRight[1]
  }

  export function getWidth(rect: Rectangle4) {
    return rect.bottomRight[0] - rect.topLeft[0]
  }

  export function getHeight(rect: Rectangle4) {
    return rect.bottomRight[1] - rect.topLeft[1]
  }

  export function setWidth(rect: Rectangle4, width: number) {
    rect.bottomRight[0] = rect.topLeft[0] + width
  }

  export function setHeight(rect: Rectangle4, height: number) {
    rect.bottomRight[1] = rect.topLeft[1] + height
  }

    /**
   * 设置矩形的 TopLeft 坐标，并自动调整 BottomRight 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  export function setTopLeft(rect: Rectangle4, x: number, y: number) {
    const width = getWidth(rect), height = getHeight(rect)
    vector2.set(rect.topLeft, x, y)
    vector2.set(rect.bottomRight, x + width, y + height)
  }

  /**
   * 设置矩形的 BottomRight 坐标，并自动调整 TopLeft 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  export function setBottomRight(rect: Rectangle4, x: number, y: number) {
    const width = getWidth(rect), height = getHeight(rect)
    vector2.set(rect.bottomRight, x, y)
    vector2.set(rect.topLeft, x - width, y - height)
  }

  export function transformMat3(out: Rectangle4, rect: Rectangle4, mat3: ReadonlyMat3) {
    vector2.transformMat3(out.topLeft, rect.topLeft, mat3)
    vector2.transformMat3(out.bottomRight, rect.bottomRight, mat3)
    return out
  }

}