import { Canvas } from "../canvas/Canvas";
import { vector2 } from "../graphic/matrix/vec2";
import { quad } from "../graphic/shape/Quad";
import { rect } from "../graphic/shape/Rectangle";
import { View } from "../view/View";
import { Drawable2 } from "./Drawable2";

/**
 * @internal
 */
export class ViewDrawable extends Drawable2 {

  constructor(private view: View) {
    super()
  }

  private tempRectangle = rect.create()

  public onDraw(canvas: Canvas) {
    const view = this.view;
    if (view.isNotPresent) {
      return;
    }
    view.actualOrigin = vector2.multiply(vector2.create(), view.origin, view.size)
    view._translate = vector2.add(vector2.create(), view.rectangle.topLeft, view.viewTranslate)

    view.updateTransformFromRoot()
    canvas.setColor(view._color)
    canvas.setGlobalAlpha(view._alpha)
    canvas.setMatrix3(view.worldMatrix)

    this.view.onDraw(canvas);

    const { computedQuad } = this.view
    rect.setWidth(this.tempRectangle, this.view.width)
    rect.setHeight(this.tempRectangle, this.view.height)
    rect.setTopLeft(this.tempRectangle, 0, 0)
    quad.fromRectangle(computedQuad, this.tempRectangle)

    vector2.transformMat3(computedQuad.topLeft, computedQuad.topLeft, view.worldMatrix)
    vector2.transformMat3(computedQuad.topRight, computedQuad.topRight, view.worldMatrix)
    vector2.transformMat3(computedQuad.bottomLeft, computedQuad.bottomLeft, view.worldMatrix)
    vector2.transformMat3(computedQuad.bottomRight, computedQuad.bottomRight, view.worldMatrix)
  }

}