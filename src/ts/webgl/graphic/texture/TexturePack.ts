import type {Vector2} from "../core/Vector2";
import { vector2 } from "../matrix/vec2";
import {rect, Rectangle, type Rectangle4} from "../shape/Rectangle";



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