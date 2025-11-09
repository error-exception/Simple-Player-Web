import { Canvas } from "../canvas/Canvas";
import { quad } from "../graphic/shape/Quad";
import { View } from "../view/View";
import { Drawable2 } from "./Drawable2";

/**
 * @internal
 */
export class ViewDrawable extends Drawable2 {

  constructor(private view: View) {
    super()
  }

  public onDraw(canvas: Canvas) {
    const view = this.view;
    if (view.isNotPresent) {
      return;
    }
    const origin = view.origin
    canvas.setColor(view._color)
    canvas.setGlobalAlpha(view._alpha)
    canvas.pivot(origin[0], origin[1])

    canvas.translate(view._translate[0], view._translate[1])
    canvas.scale(view._scale[0], view._scale[1])
    canvas.rotate(view._rotate)

    this.view.onDraw(canvas);
    const { computedQuad, rectangle } = this.view        
    quad.fromRectangle(computedQuad, rectangle)
    computedQuad.topLeft = canvas.transformVec2(computedQuad.topLeft)
    computedQuad.topRight = canvas.transformVec2(computedQuad.topRight)
    computedQuad.bottomLeft = canvas.transformVec2(computedQuad.bottomLeft)
    computedQuad.bottomRight = canvas.transformVec2(computedQuad.bottomRight)
  }

}