import {Box, type BoxConfig} from "./Box";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Axis} from "../drawable/Axis";
import type {Drawable} from "../drawable/Drawable";
import {TODO} from "../../Utils";
import {Vector} from "../core/Vector2";
import {Invalidation, InvalidationSource} from "../drawable/Invalidation";
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

  public addFirst(...children: Drawable[]) {
    TODO("method addFirst() not implemented")
  }

  setWidth(w: number) {
    super.setWidth(w);
    this.invalidate(Invalidation.Layout)
  }

  setHeight(h: number) {
    super.setHeight(h);
    this.invalidate(Invalidation.Layout)
  }

  public setSize(width: number, height: number) {
    super.setSize(width, height);
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
    const position = this.initRectangle.topLeft.copy()
    const leftChildren = this.leftChildren
    for (let i = 0; i < leftChildren.length; i++) {
      const child = leftChildren[i]
      child.initRectangle.setTopLeft(position.x, position.y)
      position.x += (child.rectangle.getWidth() + this.space)
    }
  }

  private layoutCenterChildren() {
    const position = Vector(0, this.initRectangle.topLeft.y)
    let width = 0
    const centerChildren = this.centerChildren
    for (let i = 0; i < centerChildren.length; i++) {
      width += centerChildren[i].rectangle.getWidth()
    }
    const space = this.space
    width += centerChildren.length * space
    position.x = this.getPosition().x + this.getWidth() / 2 - width / 2
    for (let i = 0; i < centerChildren.length; i++) {
      const child = centerChildren[i]
      child.initRectangle.setTopLeft(position.x, position.y)
      position.x += (child.rectangle.getWidth() + space)
    }
  }

  private layoutRightChildren() {
    const position = Vector(this.getPosition().x + this.getWidth(), this.initRectangle.topLeft.y)
    const rightChildren = this.rightChildren
    for (let i = rightChildren.length - 1; i >= 0; i--) {
      const child = rightChildren[i]
      const width = child.rectangle.getWidth()
      position.x -= width
      child.initRectangle.setTopLeft(position.x, position.y)
      position.x -= this.space
    }
  }

  public updateSizeByChildren(toParent: boolean = false): boolean {
    const autoSize = this.config.autoSize
    if (!autoSize) return false
    const children = this.childrenList
    let width = 0, maxHeight = -1
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      width += child.rectangle.getWidth()
      maxHeight = Math.max(child.rectangle.getHeight(), maxHeight)
    }
    width += (children.length - 1) * this.space
    if (Axes.hasX(autoSize))
      this.setWidth(width)
    if (Axes.hasY(autoSize))
      this.setHeight(maxHeight)
    toParent && this.parent?.updateSizeByChildren()
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
    this.invalidate(Invalidation.Layout)
    return true
  }

}