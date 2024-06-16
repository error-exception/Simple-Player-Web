import {type BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import {ArrayUtils} from "../../util/ArrayUtils";
import {type WebGLRenderer} from "../WebGLRenderer";
import {DrawNode} from "../drawable/DrawNode";
import {Invalidation, InvalidationSource} from "../drawable/Invalidation";
import {Axes} from "../drawable/Axes";

export interface BoxConfig extends BaseDrawableConfig {
  autoSize?: number,
  children?: Drawable[]
}

export class Box<T extends BoxConfig = BoxConfig> extends Drawable<T> {

  protected childrenList: Drawable[] = []
  public drawNode: BoxDrawNode = new BoxDrawNode(this)

  //////////////////////////////////////////////////////////

  public add(...children: Drawable[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.setParent(this)
      this.childrenList.push(child)
    }
  }

  public removeChild(child: Drawable) {
    const index = this.childrenList.indexOf(child)
    if (index >= 0) {
      console.log("child found, and can be removed, index", index)
      this.childrenList.splice(index, 1)
      child.dispose()
      console.log("has", this.childrenList.length, "child now")
    }
  }

  public removeAllChildren() {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose()
    }
    this.childrenList.length = 0
  }

  public get firstChild() {
    return this.childrenList[0]
  }

  public getFirstChild() {
    return this.childrenList[0]
  }

  public get lastChild() {
    return this.childrenList[this.childrenList.length - 1]
  }

  public getLastChild() {
    return this.childrenList[this.childrenList.length - 1]
  }

  public get childrenCount() {
    return this.childrenList.length
  }

  public childAt(index: number): Drawable | null {
    if (ArrayUtils.inBound(this.childrenList, index)) {
      return this.childrenList[index]
    }
    return null
  }

  ////////////////////////////////////////////

  public load(renderer: WebGLRenderer): void {
    super.load(renderer)
    const config = this.config
    if (config.children) {
      this.add(...config.children)
    }
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].load(renderer)
    }
  }

  public onWindowResize(): void {
    super.onWindowResize()
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onWindowResize()
    }
  }

  public invalidateSelf() {
    super.invalidateSelf();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].invalidateSelf()
    }
  }

  public updateTransition() {
    super.updateTransition();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].updateTransition()
    }
  }

  public doPreTask() {
    super.doPreTask();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doPreTask()
    }
  }

  public doPostTask() {
    super.doPostTask();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doPostTask()
    }
  }

  updateTransform3() {
    super.updateTransform3();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].updateTransform3()
    }
  }

  invalidate(value: number = Invalidation.All, source: number = InvalidationSource.Self) {
    super.invalidate(value, source);
    if (this.childrenList) {
      for (let i = 0; i < this.childrenList.length; i++) {
        this.childrenList[i].invalidate(value, source)
      }
    }
  }

  public invalidateLayout() {
    if ((this.invalidationValue & Invalidation.ParentAutoSize) > 0) {
      this.updateSizeByChildren(true)
    }
    super.invalidateLayout();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].invalidateLayout()
    }
  }

  public doOnInvalidate() {
    super.doOnInvalidate();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doOnInvalidate()
    }
  }

  public onUpdate() {
    super.onUpdate();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onUpdate()
    }
  }

  onTransformApplied() {
    super.onTransformApplied();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onTransformApplied()
    }
  }

  public updateLayout() {
    const children = this.childrenList
    let child, anchor, childWidth, childHeight
    const width = this.getWidth()
    const height = this.getHeight()
    const topLeft = this.getPosition()
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      anchor = child.anchor
      childWidth = child.getWidth()
      childHeight = child.getHeight()
      child.initRectangle.setTopLeft(
        width * anchor.x - childWidth * anchor.x + topLeft.x + child.anchorOffset.x,
        height * anchor.y - childHeight * anchor.y + topLeft.y + child.anchorOffset.y
      )
      child.invalidate(Invalidation.Layout, InvalidationSource.Parent)
    }
  }

  public updateSizeByChildren(toParent: boolean = false): boolean {
    const autoSize = this.config.autoSize
    if (!autoSize) {
      return false
    }
    const children = this.childrenList
    let maxWidth = -1, maxHeight = -1
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      maxWidth = Math.max(child.rectangle.getWidth(), maxWidth)
      maxHeight = Math.max(child.rectangle.getHeight(), maxHeight)
    }
    if (Axes.hasX(autoSize))
      this.setWidth(maxWidth)
    if (Axes.hasY(autoSize))
      this.setHeight(maxHeight)
    toParent && this.parent?.updateSizeByChildren()
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
    this.invalidate(Invalidation.Layout)
    // this.updatePosition()
    // for (let i = 0; i < children.length; i++) {
    //   children[i].invalidate(Invalidation.Layout, InvalidationSource.Parent)
    // }
    return true
  }

  public dispose(): void {
    super.dispose()
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose()
    }
  }

  public draw(renderer: WebGLRenderer): void {
    if (!this.isVisible) {
      return
    }
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].draw(renderer)
    }
  }

  public onDraw() {}

}

class BoxDrawNode extends DrawNode {
  draw(renderer: WebGLRenderer) {}
}