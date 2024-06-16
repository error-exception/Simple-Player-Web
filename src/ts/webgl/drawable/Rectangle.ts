import {Vector2} from "../core/Vector2";

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