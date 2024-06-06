import {IMouseEvent, MouseState} from "../../global/MouseState";
import {Box} from "../box/Box";
import Coordinate from "../base/Coordinate";
import {Transform} from "../base/Transform";
import {Bindable} from "../core/Bindable";
import {Disposable} from "../core/Disposable";
import {almostEquals, isUndef} from "../core/Utils";
import {Vector, Vector2} from "../core/Vector2";
import {Axis} from "./Axis";
import {provide, unprovide} from "../util/DependencyInject";
import {DrawableTransition} from "../transition/DrawableTransition";
import {Anchor} from "./Anchor";
import {DrawNode} from "./DrawNode";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Matrix3} from "../core/Matrix3";
import {TransformUtils} from "../core/TransformUtils";

export interface BaseDrawableConfig {
  size: [number | "fill-parent", number | "fill-parent"];
  anchor?: number;
  offset?: [number, number];
  // 设置变换中心
  origin?: number | number[]
  position?: Vector2
}

export abstract class Drawable<C extends BaseDrawableConfig = BaseDrawableConfig>
  implements Bindable, Disposable, IMouseEvent
{
  /**
   * 记录自身的变换
   */
  protected selfTransform: Transform = new Transform();
  /**
   * 最终计算出来的变换
   */
  public appliedTransform: Transform = new Transform();

  public size = new Vector2();
  public position = new Vector2();
  public anchor = Axis.X_CENTER | Axis.Y_CENTER;

  protected parent: Box | null = null;
  protected isAvailable = false;

  protected matrixArray = new Float32Array([
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ]);

  public isVisible = true;

  protected disposeList: ((() => void) | undefined)[] = []
  public origin: Vector2 = Vector()

  constructor(public config: C) {
    this.isAvailable = true;
    this.updateBounding();
    provide(this.constructor.name, this)
  }

  protected addDisposable(init: () => ((() => void) | void)) {
    this.disposeList.push(init() || undefined)
  }

  public get width() {
    return this.size.x;
  }

  public get height() {
    return this.size.y;
  }

  public setParent(parent: Box) {
    parent.drawNode.addDrawNodes(this.drawNode)
    this.parent = parent;
    this.updateBounding()
  }

  public load(renderer: WebGLRenderer) {
    this.updateBounding();
    this.onLoad(renderer);
  }

  public onLoad(renderer: WebGLRenderer) {}

  public updateBounding() {
    const [width, height] = this.config.size

    const parentSize = this.parent ? this.parent.size : Coordinate.size
    this.size.x = width === 'fill-parent' ? parentSize.x : width
    this.size.y = height === 'fill-parent' ? parentSize.y : height

    this.adjustAnchor()
    this.adjustOrigin()
  }

  /**
   * todo: 考虑父容器变换中心的影响
   * @private
   */
  private adjustOrigin() {
    const origin = isUndef(this.config.origin) ?
      Anchor.Center : this.config.origin
    if (Array.isArray(origin)) {
      this.origin.set(origin[0], origin[1])
    } else {
      const x = Axis.getXAxis(origin),
        y = Axis.getYAxis(origin)
      if (x === Axis.X_LEFT) {
        this.origin.x = this.position.x
      } else if (x === Axis.X_CENTER) {
        this.origin.x = this.position.x + this.width / 2
      } else {
        this.origin.x = this.position.x + this.width
      }
      if (y === Axis.Y_TOP) {
        this.origin.y = this.position.y
      } else if (y === Axis.Y_CENTER) {
        this.origin.y = this.position.y + this.height / 2
      } else {
        this.origin.y = this.position.y + this.height
      }
    }
  }

  private adjustAnchor() {
    let positionX = 0, positionY = 0
    const anchor = isUndef(this.config.anchor) ?
      Anchor.TopLeft : this.config.anchor
    this.anchor = anchor
    const anchorX = Axis.getXAxis(anchor),
      anchorY = Axis.getYAxis(anchor)

    const parentSize = this.parent ? this.parent.size : Coordinate.size
    const parentPosition = this.parent ? this.parent.position : Vector2.zero

    if (anchorX === Axis.X_LEFT) {
      positionX = 0
    } else if (anchorX === Axis.X_CENTER) {
      positionX = parentSize.x / 2 - this.size.x / 2
    } else {
      positionX = parentSize.x - this.size.x
    }
    if (anchorY === Axis.Y_TOP) {
      positionY = 0
    } else if (anchorY === Axis.Y_CENTER) {
      positionY = parentSize.y / 2 - this.size.y / 2
    } else {
      positionY = parentSize.y - this.size.y
    }
    if (this.config.offset) {
      positionX += this.config.offset[0]
      positionY += this.config.offset[1]
    }
    if (this.config.position) {
      positionX = this.config.position.x
      positionY = this.config.position.y
    }
    this.position.set(positionX + parentPosition.x, positionY + parentPosition.y)
  }

  /**
   * remove self from parent
   */
  public remove() {
    this.parent?.removeChild(this);
    this.adjustAnchor()
    this.adjustOrigin()
  }

  public set scale(v: Vector2) {
    this.selfTransform.scaleTo(v);
  }

  public get scale(): Vector2 {
    return this.selfTransform.scale.copy();
  }

  public set translate(v: Vector2) {
    this.selfTransform.translateTo(v);
  }

  public get translate(): Vector2 {
    return this.selfTransform.translate.copy();
  }

  public set alpha(v: number) {
    this.selfTransform.alphaTo(v);
  }

  public get alpha() {
    return this.selfTransform.alpha;
  }

  public set rotate(r: number) {
    this.selfTransform.rotateTo(r)
  }

  public get rotate() {
    return this.selfTransform.rotate
  }

  public drawNode: DrawNode = new DrawNode(this)

  protected transition = new DrawableTransition(this.selfTransform)

  /**
   * 返回一个平滑过渡的变换
   * @param clear 默认为 true，如果为 true，初次调用变换方法时，将根据当前时间为基准进行平滑变换，如果想开始一个新的平滑
   * 过渡，则应该保持默认值
   */
  public transform(clear: boolean = true): DrawableTransition {
    if (clear) {
      return this.transition.clear
    }
    return this.transition
  }

  protected get shouldDraw() {
    return this.drawNode.shouldDraw
  }

  public beforeCommit(node: DrawNode) {}

  protected updateTransform() {

    const transform = this.selfTransform
    const node = this.drawNode
    node.matrix.setFrom(this.parent ? this.parent.drawNode.matrix : Matrix3.identify)
    const origin = this.parent ? TransformUtils.apply(this.origin, node.matrix) : this.origin
    node.applyTransform(
      transform.translate,
      transform.rotate,
      transform.scale,
      transform.skew,
      origin
    )
    const parentTransform = this.parent ? this.parent.appliedTransform : Transform.emptyTransform
    const applied = this.appliedTransform
    applied.alphaTo(parentTransform.alpha)
    applied.alphaBy(transform.alpha)
    node.shouldDraw = !almostEquals(applied.alpha, 0) ||
      !(almostEquals(transform.scale.x, 0) ||
        almostEquals(transform.scale.y, 0))
    this.onTransformApplied();
  }

  protected onTransformApplied() {}

  protected onUpdate() {}

  public update() {
    if (this.isAvailable) {
      this.transition.updateTransform()
      this.onUpdate();
      this.updateTransform();
    }
  }

  public draw(renderer: WebGLRenderer): void {
    if (this.isAvailable && this.isVisible) {
      this.drawNode.draw(renderer)
    }
  }

  abstract onDraw(node: DrawNode, renderer: WebGLRenderer): void;

  public onWindowResize() {
    this.updateBounding();
  }

  bind(): void {}

  public dispose(): void {
    this.isAvailable = false;
    unprovide(this.constructor.name)
    for (let i = 0; i < this.disposeList.length; i++) {
      const disposable = this.disposeList[i]
      disposable && disposable()
    }
  }

  unbind(): void {};

  public placeholder() {}

  /**
   * 检查 position 是否在 Drawable 区域内
   * @param position
   */
  public isInBound(position: Vector2) {

    const matrix = this.drawNode.matrix
    const topLeft = TransformUtils.apply(this.position, matrix)
    const bottomRight = TransformUtils.apply(this.position.add(this.size), matrix)

    return (
      position.x > topLeft.x &&
      position.x <= bottomRight.x &&
      position.y > topLeft.y &&
      position.y <= bottomRight.y
    );
  }

  // TODO: when mousedown and mouseup in a same bound, click still effect
  public click(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
      if ("onClick" in this && typeof this.onClick === "function")
        this.onClick(which);
    }
  }

  public mouseDown(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
      if (
        "onMouseDown" in this &&
        typeof this.onMouseDown === "function"
      ) {
        this.onMouseDown(which);
      }
    }
  }

  public mouseUp(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
      if ("onMouseUp" in this && typeof this.onMouseUp === "function") {
        this.onMouseUp(which);
      }
    }
    this.dragLost(which, position);
  }

  public mouseMove(position: Vector2) {
    if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
      if (
        "onMouseMove" in this &&
        typeof this.onMouseMove === "function"
      ) {
        this.onMouseMove();
      }
      this.hover(position);
      if (MouseState.hasKeyDown()) {
        this.drag(MouseState.which, position);
      }
      return;
    }
    if (this.isDragged) {
      this.drag(MouseState.which, position);
    }
    this.hoverLost(position);
  }

  private isHovered = false;

  public hover(position: Vector2) {
    // if (this.isAvailable && this.isInBound(position)) {
    if (
      "onHover" in this &&
      typeof this.onHover === "function" &&
      !this.isHovered &&
      this.shouldDraw
    ) {
      this.isHovered = true;
      this.onHover();
    }
    // }
  }

  public hoverLost(position: Vector2) {
    if (this.isAvailable && this.isHovered && !this.isInBound(position)) {
      if (
        "onHoverLost" in this &&
        typeof this.onHoverLost === "function"
      ) {
        this.isHovered = false;
        this.onHoverLost();
      }
    }
  }

  private isDragged = false;
  public drag(which: number, position: Vector2) {
    if (this.isAvailable && this.shouldDraw) {
      if ("onDrag" in this && typeof this.onDrag === "function") {
        this.isDragged = true;
        this.onDrag(which);
      }
    }
  }

  public dragLost(which: number, position: Vector2) {
    if (this.isAvailable && this.isDragged) {
      if ("onDragLost" in this && typeof this.onDragLost === "function") {
        this.isDragged = false;
        this.onDragLost();
      }
    }
  }
}
