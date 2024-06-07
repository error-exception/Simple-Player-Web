import type {Drawable} from "./Drawable";

/**
 * 记录已创建的 Drawable，并在 Drawable 删除前移除对应的记录
 */
export class DrawableRecorder {

  public static drawables: Drawable[] = []

  public static record(drawable: Drawable) {
    this.drawables.push(drawable)
  }

  public static remove(drawable: Drawable) {
    const index = this.drawables.indexOf(drawable)
    this.drawables.splice(index, 1)
  }

  public static getIndex(drawable: Drawable) {
    return this.drawables.indexOf(drawable)
  }

}