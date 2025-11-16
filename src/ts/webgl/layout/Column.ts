import { anchor } from "../drawable/Anchor";
import { vector2 } from "../graphic/matrix/vec2";
import { View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";


export class Column extends ViewGroup {

  private topChildren: View[] = []
  private middleChildren: View[] = []
  private bottomChildren: View[] = []

  public gap: number = 0

  constructor() {
    super();
  }

  protected onChildChanged(view: View, isRemove: boolean) {
    if (isRemove) {
      let index = this.topChildren.indexOf(view)
      if (index >= 0) {
        this.topChildren.splice(index, 1)
        return
      }
      index = this.middleChildren.indexOf(view)
      if (index >= 0) {
        this.middleChildren.splice(index, 1)
        return;
      }
      index = this.bottomChildren.indexOf(view)
      if (index >= 0) {
        this.bottomChildren.splice(index, 1)
      }
    } else {
      const a = view.anchor
      if (anchor.isTop(a)) {
        this.topChildren.push(view)
      } else if (anchor.isVerticalCenter(a)) {
        this.middleChildren.push(view)
      } else {
        this.bottomChildren.push(view)
      }
    }
  }

  protected onLayoutChildren() {
    let topHeight = 0, middleHeight = 0, bottomHeight = 0
    let topChildren = this.topChildren,
      middleChildren = this.middleChildren,
      bottomChildren = this.bottomChildren
    let i = 0,
      topLength = topChildren.length,
      middleLength = middleChildren.length,
      bottomLength = bottomChildren.length;

    for (i = 0; i < topLength; i++) {
      topHeight += topChildren[i].height
    }
    for (i = 0; i < middleLength; i++) {
      middleHeight += middleChildren[i].height
    }
    for (i = 0; i < bottomLength; i++) {
      bottomHeight += bottomChildren[i].height
    }

    const width = this.width, height = this.height
    const x = this.position[0], y = this.position[1]
    let offsetTop = 0, remainsLength = height

    const temp = vector2.create()
    for (i = 0; i < topLength; i++) {
      const child = topChildren[i]
      const anchorX = child.anchor[0]
      vector2.set(
        temp,
        x + width * anchorX + child.width * anchorX, 
        y + offsetTop
      )
      child.position = temp
      // TODO: apply gap
      offsetTop += child.height
      remainsLength -= child.height
    }

    offsetTop = height
    for (i = 0; i < bottomLength; i++) {
      const child = bottomChildren[i]
      const anchorX = child.anchor[0]
      vector2.set(
        temp,
        x + width * anchorX + child.width * anchorX,
        y + offsetTop
      )
      // TODO: apply gap
      offsetTop -= child.height
      remainsLength -= child.height
    }

    // TODO: layout middle children
  }

}