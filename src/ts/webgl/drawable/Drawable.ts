import {IMouseEvent, MouseState} from "../../global/MouseState";
import {Box} from "../box/Box";
import Coordinate from "../base/Coordinate";
import {Transform} from "../base/Transform";
import {Bindable} from "../core/Bindable";
import {Disposable} from "../core/Disposable";
import {isUndef} from "../core/Utils";
import {Vector2} from "../core/Vector2";
import {Axis} from "./Axis";
import {provide, unprovide} from "../util/DependencyInject";
import {Texture} from "../core/Texture";
import {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {DrawableTransition} from "../transition/DrawableTransition";

export interface BaseDrawableConfig {
  size: [number | "fill-parent", number | "fill-parent"];
  anchor?: number;
  offset?: [number, number];
  // 设置变换中心
  origin?: number | number[]
  texture?: Texture | symbol
  shader?: Shader | symbol
  layout?: VertexBufferLayout
}

export abstract class Drawable<C extends BaseDrawableConfig = BaseDrawableConfig> implements Bindable, Disposable, IMouseEvent {
  /**
   * 通过 Anchor 调整后的变换
   */
  private layoutTransform: Transform = new Transform();
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

  // protected scaleTransition: Vector2Transition = new Vector2Transition(this, 'scale');
  // protected fadeTransition: FadeTransition = new FadeTransition(this);
  // protected translateTransition: TranslateTransition =
  //   new TranslateTransition(this);
  // protected rotateTransition: ObjectTransition = new ObjectTransition(this, 'rotate')

  public isVisible = true;

  protected disposeList: ((() => void) | undefined)[] = []

  constructor(
    protected gl: WebGL2RenderingContext,
    protected config: C
  ) {
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
    this.parent = parent;
  }

  public load() {
    this.updateBounding();
    // this.transition = new DrawableTransition(this.selfTransform)
    this.onLoad();
  }

  /**
   * this method will be executed while constructor after execute
   */
  public onLoad() {}

  public updateBounding() {
    let [width, height] = this.config.size;

    if (width === "fill-parent") {
      width = Coordinate.width;
    }
    if (height === "fill-parent") {
      height = Coordinate.height;
    }

    let tx = 0, ty = 0,
      left = -width / 2,
      top = height / 2;

    // origin
    const origin = isUndef(this.config.origin)
      ? Axis.X_CENTER | Axis.Y_CENTER
      : this.config.origin
    const isAxis = !Array.isArray(origin)

    let originX, originY
    if (isAxis) {
      const ax = Axis.getXAxis(origin),
        ay = Axis.getYAxis(origin)
      if (ax === Axis.X_LEFT) {
        originX = -width / 2
      } else if (ax === Axis.X_RIGHT) {
        originX = width / 2
      } else {
        originX = 0
      }
      if (ay === Axis.Y_TOP) {
        originY = height / 2
      } else if (ay === Axis.Y_BOTTOM) {
        originY = -height / 2
      } else {
        originY = 0
      }
    } else {
      [originX, originY] = origin
    }

    left += -originX
    top += -originY

    // anchor
    this.anchor = isUndef(this.config.anchor)
      ? Axis.X_CENTER | Axis.Y_CENTER
      : this.config.anchor;

    const xAxis = Axis.getXAxis(this.anchor);
    const yAxis = Axis.getYAxis(this.anchor);

    if (xAxis === Axis.X_LEFT) {
      tx = -Coordinate.width / 2;
    } else if (xAxis === Axis.X_CENTER) {
      tx = -width / 2;
    } else if (xAxis === Axis.X_RIGHT) {
      tx = Coordinate.width / 2 - width;
    }
    if (yAxis === Axis.Y_TOP) {
      ty = Coordinate.height / 2;
    } else if (yAxis === Axis.Y_CENTER) {
      ty = height / 2;
    } else if (yAxis === Axis.Y_BOTTOM) {
      ty = -Coordinate.height / 2 + height;
    }

    // offset
    if (this.config.offset) {
      const [ offsetX, offsetY ] = this.config.offset
      tx += offsetX
      ty += offsetY
    }

    tx += width / 2
    ty -= height / 2

    tx += originX
    ty += originY

    const layoutTranslate = new Vector2(tx, ty);
    this.position.set(left, top);

    this.size.set(width, height);
    this.layoutTransform.translateTo(layoutTranslate);
  }

  /**
   * remove self from parent
   */
  public remove() {
    this.parent?.removeChild(this);
  }

  // public scaleBegin(atTime: number = Time.currentTime): Vector2Transition {
  //   this.scaleTransition.setStartTime(atTime);
  //   return this.scaleTransition;
  // }
  //
  // public fadeBegin(atTime: number = Time.currentTime): FadeTransition {
  //   this.fadeTransition.setStartTime(atTime);
  //   return this.fadeTransition;
  // }

  // public translateBegin(
  //   atTime: number = Time.currentTime
  // ): TranslateTransition {
  //   this.translateTransition.setStartTime(atTime);
  //   return this.translateTransition;
  // }
  //
  // public rotateBegin(atTime: number = Time.currentTime): ObjectTransition {
  //   this.rotateTransition.setStartTime(atTime)
  //   return this.rotateTransition
  // }

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

  protected updateTransform() {
    const layoutTransform = this.layoutTransform;
    const selfTransform = this.selfTransform;
    const appliedTransform = this.appliedTransform;
    const parentTransform = this.parent
      ? this.parent.appliedTransform
      : new Transform();

    appliedTransform.translateTo(parentTransform.translate);
    appliedTransform.translateBy(layoutTransform.translate);
    appliedTransform.translateBy(selfTransform.translate);

    appliedTransform.scaleTo(parentTransform.scale);
    appliedTransform.scaleBy(layoutTransform.scale);
    appliedTransform.scaleBy(selfTransform.scale);

    appliedTransform.alphaTo(parentTransform.alpha);
    appliedTransform.alphaBy(layoutTransform.alpha);
    appliedTransform.alphaBy(selfTransform.alpha);

    appliedTransform.rotateTo(parentTransform.rotate)
    appliedTransform.rotateBy(layoutTransform.rotate)
    appliedTransform.rotateBy(selfTransform.rotate)

    appliedTransform.extractToMatrix4(this.matrixArray);

    this.onTransformApplied();
  }

  protected onTransformApplied() {}

  protected onUpdate() {}

  public update() {
    if (!this.isVisible) {
      return;
    }
    if (this.isAvailable) {
      // this.scaleTransition.update(Time.currentTime);
      // this.fadeTransition.update(Time.currentTime);
      // this.translateTransition.update(Time.currentTime);
      // this.rotateTransition.update(Time.currentTime);
      this.transition.updateTransform()
      this.transition.update(this.selfTransform)
    }
    if (this.isAvailable) {
      this.onUpdate();
    }
    if (this.isAvailable) {
      this.updateTransform();
    }
  }

  public draw(): void {
    if (this.isAvailable && this.isVisible) {
      this.bind();
      this.onDraw();
      this.unbind();
    }
  }

  abstract onDraw(): void;

  public onWindowResize() {
    this.updateBounding();
  }

  abstract bind(): void;

  public dispose(): void {
    this.isAvailable = false;
    unprovide(this.constructor.name)
    for (let i = 0; i < this.disposeList.length; i++) {
      const disposable = this.disposeList[i]
      disposable && disposable()
    }
  }

  abstract unbind(): void;

  public placeholder() {}

  /**
   * 检查 position 是否在 Drawable 区域内
   * @param position
   */
  public isInBound(position: Vector2) {

    let { x, y } = this.position;
    const { translate, scale } = this.appliedTransform;

    x *= scale.x;
    y *= scale.y;
    x += translate.x;
    y += translate.y;

    return (
      position.x > x &&
      position.x <= x + this.width * scale.x &&
      position.y < y &&
      position.y >= y - this.height * scale.y
    );
  }

  // TODO: when mousedown and mouseup in a same bound, click still effect
  public click(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onClick" in this && typeof this.onClick === "function")
        this.onClick(which);
    }
  }

  public mouseDown(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position)) {
      if (
        "onMouseDown" in this &&
        typeof this.onMouseDown === "function"
      ) {
        this.onMouseDown(which);
      }
    }
  }

  public mouseUp(which: number, position: Vector2) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseUp" in this && typeof this.onMouseUp === "function") {
        this.onMouseUp(which);
      }
    }
    this.dragLost(which, position);
  }

  public mouseMove(position: Vector2) {
    if (this.isAvailable && this.isInBound(position)) {
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
      !this.isHovered
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
    // if (this.isAvailable && this.isInBound(position)) {
    if ("onDrag" in this && typeof this.onDrag === "function") {
      this.isDragged = true;
      this.onDrag(which);
    }
    // }
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
