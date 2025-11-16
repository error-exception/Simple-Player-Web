import { Time } from "../../global/Time";
import { anchor } from "../drawable/Anchor";
import { Invalidation } from "../drawable/Invalidation";
import { vector2 } from "../graphic/matrix/vec2";
import { ObjectTransition } from "../transition/Transition";
import { View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";


export class Row extends ViewGroup {

  private leftChildren: View[] = []

  private centerChildren: View[] = []

  private rightChildren: View[] = []

  private _gap: number = 0

  public set gap(gap: number) {
    this._gap = gap
    this.invalidate(Invalidation.Position)
  }

  public get gap(): number {
    return this._gap
  }

  private gapTransition = new ObjectTransition(this, "gap")

  public gapBegin(delay: number = 0) {
    this.gapTransition.setStartTime(Time.currentTime + delay)
    return this.gapTransition
  }

  protected onChildChanged(view: View, isRemove: boolean) {
    super.onChildChanged(view, isRemove);
    if (isRemove) {
      let index = this.leftChildren.indexOf(view)
      if (index >= 0) {
        this.leftChildren.splice(index, 1)
        return
      }
      index = this.centerChildren.indexOf(view)
      if (index >= 0) {
        this.centerChildren.splice(index, 1)
        return;
      }
      index = this.rightChildren.indexOf(view)
      if (index >= 0) {
        this.rightChildren.splice(index, 1)
      }
    } else {
      const a = view.anchor
      if (anchor.isLeft(a)) {
        this.leftChildren.push(view)
      } else if (anchor.isHorizontalCenter(a)) {
        this.centerChildren.push(view)
      } else {
        this.rightChildren.push(view)
      }
    }
  }

  protected onLayoutChildren() {
    const leftChildrenLen = this.leftChildren.length,
      centerChildrenLen = this.centerChildren.length,
      rightChildrenLen = this.rightChildren.length,
      leftChildren = this.leftChildren,
      centerChildren = this.centerChildren,
      rightChildren = this.rightChildren
    let i = 0

    // 计算各部分的宽度（包括间距）
    let leftWidth = 0, centerWidth = 0, rightWidth = 0
    
    for (i = 0; i < leftChildrenLen; i++) {
      leftWidth += leftChildren[i].width
      if (i < leftChildrenLen - 1) leftWidth += this.gap
    }

    for (i = 0; i < centerChildrenLen; i++) {
      centerWidth += centerChildren[i].width
      if (i < centerChildrenLen - 1) centerWidth += this.gap
    }

    for (i = 0; i < rightChildrenLen; i++) {
      rightWidth += rightChildren[i].width
      if (i < rightChildrenLen - 1) rightWidth += this.gap
    }

    const width = this.width, height = this.height,
      // [ x, y ] = this.position,
      gap = this.gap

    let leftX = 0, centerX = 0, rightX = width

    // 布局左侧子元素
    for (i = 0; i < leftChildrenLen; i++) {
      const child = leftChildren[i]
      child.position = vector2.fromValues(
        leftX,
        height * child.anchor[1] - child.height * child.anchor[1]
      )
      leftX += child.width + gap
    }

    // 布局右侧子元素（从右向左）
    for (i = rightChildrenLen - 1; i >= 0; i--) {
      const child = rightChildren[i]
      rightX -= child.width
      child.position = vector2.fromValues(
        rightX,
        height * child.anchor[1] - child.height * child.anchor[1]
      )
      rightX -= gap
    }

    // 布局中间子元素
    centerX = (width - centerWidth) / 2
    for (i = 0; i < centerChildrenLen; i++) {
      const child = centerChildren[i]
      child.position = vector2.fromValues(
        centerX,
        height * child.anchor[1] - child.height * child.anchor[1]
      )
      centerX += child.width + gap
    }
  }

  public onUpdate(): void {
    super.onUpdate()
    this.gapTransition.update(Time.currentTime)
  }

}
