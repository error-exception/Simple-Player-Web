import {type BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import {ArrayUtils} from "../../util/ArrayUtils";
import {type WebGLRenderer} from "../WebGLRenderer";
import {DrawNode} from "../drawable/DrawNode";
import {Invalidation, InvalidationSource} from "../drawable/Invalidation";
import {Axes} from "../drawable/Axes";
import {LayoutMember} from "../layout/LayoutValue";

export interface BoxConfig extends BaseDrawableConfig {
  autoSize?: number,
  children?: Drawable[]
}

export class Box<T extends BoxConfig = BoxConfig> extends Drawable<T> {

  protected childrenList: Drawable[] = []
  public drawNode: BoxDrawNode = new BoxDrawNode(this)

  //////////////////////////////////////////////////////////

  constructor(config: T) {
    super(config);
    // this.addLayout(this.autoSize)
    this.addLayout(this.layout)
    this.layout.tag = 'Layout'
  }

  public addTransformable(...children: Drawable[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.setParent(this)
      this.childrenList.push(child)
    }
    this.invalidateLayout()
  }

  public removeChild(child: Drawable) {
    const index = this.childrenList.indexOf(child)
    if (index >= 0) {
      this.childrenList.splice(index, 1)
      child.dispose()
    }
    this.invalidateLayout()
  }

  public removeAll() {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose()
    }
    this.childrenList.length = 0
    this.invalidateLayout()
  }

  public getFirstChild() {
    return this.childrenList[0]
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

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const config = this.config
    if (config.children) {
      this.addTransformable(...config.children)
    }
  }

  public onWindowResize(): void {
    super.onWindowResize()
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onWindowResize()
    }
  }

  public layout = new LayoutMember(Invalidation.Size | Invalidation.ParentAutoSize | Invalidation.Layout)

  protected invalidateLayout() {
    this.layout.invalidate()
  }

  updateTransform() {
    if (!this.layout.isValid()) {
      this.updateLayout()
      this.layout.validate()
    }
    super.updateTransform();
  }

  public updateLayout() {
    const children = this.childrenList
    let child: Drawable, anchor, childWidth, childHeight
    const width = this.getWidth()
    const height = this.getHeight()
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      anchor = child.anchor
      childWidth = child.getWidth()
      childHeight = child.getHeight()
      child.setPosition(
        width * anchor.x - childWidth * anchor.x + child.anchorOffset.x,
        height * anchor.y - childHeight * anchor.y + child.anchorOffset.y
      )
    }
  }

  public autoSize = new LayoutMember(Invalidation.ParentAutoSize | Invalidation.Size)

  public updateAutoSize(toParent: boolean = false) {
    const autoSize = this.config.autoSize
    if (!autoSize) {
      return
    }
    const children = this.childrenList
    let maxWidth = -1, maxHeight = -1
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      maxWidth = Math.max(child.getWidth(), maxWidth)
      maxHeight = Math.max(child.getHeight(), maxHeight)
    }
    if (Axes.hasX(autoSize))
      this.setWidth(maxWidth)
    if (Axes.hasY(autoSize))
      this.setHeight(maxHeight)
    toParent && this.parent?.updateAutoSize()
  }

  protected onInvalidate(value: number, source: number) {
    super.onInvalidate(value, source);

    value &= ~(Invalidation.Draw)
    const children = this.childrenList
    if (!children) {
      return
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.invalidate(value, InvalidationSource.Parent)
    }
  }

  protected updateChildren(renderer: WebGLRenderer) {
    super.updateChildren(renderer);
    const children = this.childrenList
    for (let i = 0; i < children.length; i++) {
      children[i].update(renderer)
    }
    this.updateAutoSize(true)
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

  public onDraw(node:DrawNode, renderer:WebGLRenderer) {
    throw new Error('box cannot be draw')
  }

}

class BoxDrawNode extends DrawNode {
  draw(renderer: WebGLRenderer) {}
}