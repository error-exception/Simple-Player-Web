import {Box, type BoxConfig} from "./Box";
import type {Drawable} from "../drawable/Drawable";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Invalidation} from "../drawable/Invalidation";
import {TODO} from "../../Utils";
import {Axis} from "../drawable/Axis";
import {Vector} from "../graphic/core/Vector2";
import {Axes} from "../drawable/Axes";

interface ColumnBoxConfig extends BoxConfig {
  space?: number
}

export class ColumnBox extends Box<ColumnBoxConfig> {

  private readonly topChildren: Drawable[] = []
  private readonly centerChildren: Drawable[] = []
  private readonly bottomChildren: Drawable[] = []
  private readonly space: number

  constructor(config: ColumnBoxConfig) {
    super(config);
    this.space = config.space ?? 0
  }

  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.invalidate(Invalidation.Layout)
  }

  public add(...children: Drawable[]) {
    super.add(...children);
    this.categoryChildren(children)
    this.invalidate(Invalidation.Layout)
  }

  public addFirst(...children: Drawable[]) {
    TODO("method addFirst() not implemented")
  }

  private categoryChildren(children: Drawable[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const anchorY = Axis.getYAxis(child.anchorValue)
      if (anchorY === Axis.Y_TOP) {
        this.topChildren.push(child)
      } else if (anchorY === Axis.Y_CENTER) {
        this.centerChildren.push(child)
      } else {
        this.bottomChildren.push(child)
      }
    }
  }

  public updateLayout() {
    this.sizeBacking.validate()
    this.layoutTopChildren()
    this.layoutCenterChildren()
    this.layoutBottomChildren()
  }

  private layoutTopChildren() {
    const position = this.initRectangle.topLeft.copy()
    const topChildren = this.topChildren
    for (let i = 0; i < topChildren.length; i++) {
      const child = topChildren[i]
      child.sizeBacking.validate()
      const anchorX = child.anchor.x
      const x = this.getWidth() * anchorX - child.getWidth() * anchorX + child.anchorOffset.x + position.x
      child.setPosition(x, position.y)
      position.y += (child.getHeight() + this.space)
    }
  }

  private layoutCenterChildren() {
    const position = Vector(this.initRectangle.topLeft.x, 0)
    let height = 0
    const centerChildren = this.centerChildren
    for (let i = 0; i < centerChildren.length; i++) {
      height += centerChildren[i].getHeight()
    }
    const space = this.space
    height += centerChildren.length * space
    position.y = this.getPosition().y + this.getHeight() / 2 - height / 2
    for (let i = 0; i < centerChildren.length; i++) {
      const child = centerChildren[i]
      const anchorX = child.anchor.x
      const x = this.getWidth() * anchorX - child.getWidth() * anchorX + child.anchorOffset.x + position.x
      child.setPosition(x, position.y)
      position.y += (child.getHeight() + space)
    }
  }

  private layoutBottomChildren() {
    const position = Vector(this.getPosition().x, this.initRectangle.topLeft.y + this.getHeight())
    const bottomChildren = this.bottomChildren
    for (let i = bottomChildren.length - 1; i >= 0; i--) {
      const child = bottomChildren[i]
      const height = child.getHeight()
      const anchorX = child.anchor.x
      const x = this.getWidth() * anchorX - child.getWidth() * anchorX + child.anchorOffset.x + position.x
      position.y -= height
      child.setPosition(x, position.y)
      position.y -= this.space
    }
  }

  public updateAutoSize(toParent: boolean = false): boolean {
    const autoSize = this.config.autoSize
    if (!autoSize) return false
    const children = this.childrenList
    let height = 0, maxWidth = -1
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      height += child.getHeight()
      maxWidth = Math.max(child.getWidth(), maxWidth)
    }
    height += (children.length - 1) * this.space
    if (Axes.hasX(autoSize))
      this.setWidth(height)
    if (Axes.hasY(autoSize))
      this.setHeight(maxWidth)
    toParent && this.parent?.updateAutoSize()
    // this.parent?.invalidate(Invalidation.Layout | Invalidation.AutoSize, InvalidationSource.Child)
    // this.invalidate(Invalidation.Layout)
    return true
  }


}