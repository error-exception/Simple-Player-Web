import { Canvas } from "../canvas/Canvas";
import { rect, type Rectangle4 } from "../graphic/shape/Rectangle";

export class Drawable2 {

  public bound: Rectangle4 = rect.create();

  public setBound(bound: Rectangle4) {
    rect.copy(this.bound, bound)
  }

  public draw(canvas: Canvas) {
    canvas.save()
    canvas.base(this.bound.topLeft[0], this.bound.topLeft[1])
    this.onDraw(canvas);
    canvas.restore()
  }

  public onDraw(canvas: Canvas) {}

}