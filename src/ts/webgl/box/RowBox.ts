import {Box} from "./Box";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Anchor} from "../drawable/Anchor";
import {Axis} from "../drawable/Axis";

export class RowBox extends Box {

  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.layoutChildren()
  }

  private layoutChildren() {
    let leftOffset = 0, rightOffset = 0,
      leftOffsetOfCenter = 0, centerWidth = 0
    const children = this.childrenList
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const anchorX = Axis.getXAxis(child.config.anchor ?? Anchor.TopLeft)
      const childWidth = this.getSizeValue(child.config.size[0], 'x')
      if (anchorX === Axis.X_LEFT) {
        if (!child.config.offset) {
          child.config.offset = [leftOffset, 0]
        } else {
          child.config.offset[0] = leftOffset
        }
        leftOffset += childWidth
      } else if (anchorX === Axis.X_CENTER) {
        centerWidth += childWidth
      }
    }

    leftOffsetOfCenter = (this.width - centerWidth) / 2
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const anchorX = Axis.getXAxis(child.config.anchor ?? Anchor.TopLeft)
      const childWidth = this.getSizeValue(child.config.size[0], 'x')

      if (anchorX === Axis.X_CENTER) {
        if (!child.config.offset) {
          child.config.offset = [leftOffsetOfCenter, 0]
        } else {
          child.config.offset[0] = leftOffsetOfCenter
        }
        leftOffsetOfCenter += childWidth
      }
    }

    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i]
      const anchorX = Axis.getXAxis(child.config.anchor ?? Anchor.TopLeft)
      const childWidth = this.getSizeValue(child.config.size[0], 'x')
      if (anchorX === Axis.X_RIGHT) {
        if (!child.config.offset) {
          child.config.offset = [-rightOffset, 0]
        } else {
          child.config.offset[0] = -rightOffset
        }
        rightOffset += childWidth
      }
    }
  }

  private getSizeValue(v: number | 'fill-parent', direction: string = 'x') {
    if (direction === 'x') {
      return v === 'fill-parent' ? this.size.x : v
    } else {
      return v === 'fill-parent' ? this.size.y : v
    }
  }
}