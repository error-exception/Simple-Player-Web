import {Box, type BoxConfig} from "./Box";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Axis} from "../drawable/Axis";
import type {Drawable} from "../drawable/Drawable";
import {Vector, Vector2} from "../graphic/core/Vector2";
import {Invalidation} from "../drawable/Invalidation";
import {Axes} from "../drawable/Axes";

export interface RowBoxConfig extends BoxConfig {
  space?: number
}

export class RowBox extends Box<RowBoxConfig> {

  private readonly leftChildren: Drawable[] = []
  private readonly centerChildren: Drawable[] = []
  private readonly rightChildren: Drawable[] = []
  private readonly space: number

  constructor(config: RowBoxConfig) {
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

  private categoryChildren(children: Drawable[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const anchorX = Axis.getXAxis(child.anchorValue)
      if (anchorX === Axis.X_LEFT) {
        this.leftChildren.push(child)
      } else if (anchorX === Axis.X_CENTER) {
        this.centerChildren.push(child)
      } else {
        this.rightChildren.push(child)
      }
    }
  }

  public updateLayout() {
    this.layoutLeftChildren()
    this.layoutCenterChildren()
    this.layoutRightChildren()
  }

  private layoutLeftChildren() {
    const position = Vector2.newZero()
    const leftChildren = this.leftChildren
    for (let i = 0; i < leftChildren.length; i++) {
      const child = leftChildren[i]
      const anchor = child.anchor
      const offset = child.anchorOffset
      const y = anchor.y * this.getHeight() - child.getHeight() * anchor.y + offset.y + position.y
      child.setPosition(position.x, y)
      position.x += (child.getWidth() + this.space)
    }
  }

  private layoutCenterChildren() {
    const position = Vector2.newZero()
    let width = 0
    const centerChildren = this.centerChildren
    for (let i = 0; i < centerChildren.length; i++) {
      const child = centerChildren[i]
      width += child.getWidth()
    }
    const space = this.space
    width += centerChildren.length * space
    position.x = this.getPosition().x + this.getWidth() / 2 - width / 2
    for (let i = 0; i < centerChildren.length; i++) {
      const child = centerChildren[i]
      const anchor = child.anchor
      const offset = child.anchorOffset
      const y = anchor.y * this.getHeight() - child.getHeight() * anchor.y + offset.y + position.y
      child.setPosition(position.x, y)
      position.x += (child.getWidth() + space)
    }
  }

  private layoutRightChildren() {
    const position = Vector(this.getWidth(), 0)
    const rightChildren = this.rightChildren
    for (let i = rightChildren.length - 1; i >= 0; i--) {
      const child = rightChildren[i]
      const anchor = child.anchor
      const offset = child.anchorOffset
      const width = child.getWidth()
      const y = anchor.y * this.getHeight() - child.getHeight() * anchor.y + offset.y + position.y
      position.x -= width
      child.setPosition(position.x, y)
      position.x -= this.space
    }
  }

  public updateAutoSize(toParent: boolean = false) {
    const autoSize = this.config.autoSize
    if (!autoSize) return
    const children = this.childrenList
    let width = 0, maxHeight = -1
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      width += child.getWidth()
      maxHeight = Math.max(child.getHeight(), maxHeight)
    }
    width += (children.length - 1) * this.space
    if (Axes.hasX(autoSize)) this.setWidth(width)
    if (Axes.hasY(autoSize)) this.setHeight(maxHeight)
    toParent && this.parent?.updateAutoSize()
  }

}