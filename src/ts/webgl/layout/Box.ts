import {ViewGroup} from "../view/ViewGroup";
import {Anchor} from "../drawable/Anchor";
import { vector2 } from "../graphic/matrix/vec2";

export class Box extends ViewGroup {

  protected onLayoutChildren() {
    const topLeft = this.position
    const width = this.getWidth()
    const height = this.getHeight()

    const children = this.children
    const temp = vector2.create()
    for (const child of children) {
      const [ x, y ] = child.anchor
      vector2.set(
        temp,
        topLeft[0] + x * width - x * child.getWidth(),
        topLeft[1] + y * height - y * child.getHeight()
      )
    }
  }

}