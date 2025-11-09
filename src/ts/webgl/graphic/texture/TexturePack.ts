import type {Vector2} from "../core/Vector2";
import { vector2 } from "../matrix/vec2";
import {rect, Rectangle, type Rectangle4} from "../shape/Rectangle";

export interface ImageInfo {
  imageBitmap: ImageBitmap,
  name: string
}

interface ImageRectangle {
  imageBitmap: ImageBitmap,
  rectangle: Rectangle4
}

/**
 * 一个简单的 Texture 打包类，旨在提高故事板的渲染效率
 * todo: 打包故事板 图片
 */
export class TexturePacker {

  private rects: ImageRectangle[] = []

  public add(imageBitmap: ImageBitmap) {
    const rectangle = rect.create()
    rect.setWidth(rectangle, imageBitmap.width)
    // rectangle.setWidth(imageBitmap.width)
    // rectangle.setHeight(imageBitmap.height)
    rect.setHeight(rectangle, imageBitmap.height)
    this.rects.push({ imageBitmap, rectangle })
  }

  public pack(maxSize: Vector2) {
    this.rects.sort((a, b) => {
      return rect.getHeight(b.rectangle) - rect.getHeight(a.rectangle)
      // return b.rectangle.getHeight() - a.rectangle.getHeight()
    })
    const pending = this.rects
    let maxHeight = -1, currentX = 0, currentY = 0
    for (let i = 0; i < pending.length; i++) {
      const r = pending[i].rectangle
      if (currentX + rect.getWidth(r) > maxSize.x) {
        currentY += maxHeight
        currentX = 0
        maxHeight = 0
      }
      vector2.set(r.topLeft, currentX, currentY)
      // rect.setTopLeft(currentX, currentY)
      currentX += rect.getWidth(r)
      maxHeight = Math.max(maxHeight, rect.getHeight(r))
    }
  }

  public testDraw(context: CanvasRenderingContext2D) {
    const rects = this.rects
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i]
      context.drawImage(
        r.imageBitmap,
        r.rectangle.topLeft[0],
        r.rectangle.topLeft[1],
        rect.getWidth(r.rectangle),
        rect.getHeight(r.rectangle)
      )
    }
  }

}