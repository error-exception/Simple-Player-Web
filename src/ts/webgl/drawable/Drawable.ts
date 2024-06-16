import {IMouseEvent} from "../../global/MouseState";
import {Box} from "../box/Box";
import Coordinate from "../base/Coordinate";
import {Disposable} from "../core/Disposable";
import {almostEquals} from "../core/Utils";
import {Vector, Vector2} from "../core/Vector2";
import {Axis} from "./Axis";
import {provide, unprovide} from "../util/DependencyInject";
import {DrawableTransition} from "../transition/DrawableTransition";
import {Anchor} from "./Anchor";
import {DrawNode} from "./DrawNode";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Matrix3} from "../core/Matrix3";
import {DrawableRecorder} from "./DrawableRecorder";
import {DrawableMouseEvent, type MouseEventCall} from "../event/DrawableMouseEvent";
import type {Nullable} from "../../type";
import {Size} from "./Size";
import {Transformable} from "./Transformable";
import {Color} from "../base/Color";
import {Rectangle} from "./Rectangle";
import {Quad} from "./Quad";
import {RectangleUtils} from "./RectangleUtils";
import {QuadUtils} from "./QuadUtils";
import {TransformUtils} from "../core/TransformUtils";
import {Invalidation, InvalidationSource} from "./Invalidation";
import {DrawableTask} from "./DrawableTask";

export interface BaseDrawableConfig {
  size: Vector2
  anchor?: number
  offset?: Vector2
  origin?: number
}

type DisposableFunc = () => void

export abstract class Drawable<C extends BaseDrawableConfig = BaseDrawableConfig>
  extends Transformable
  implements Disposable, IMouseEvent
{
  public sizeParam = Vector2.newZero()
  public anchor = Vector2.newZero();
  public anchorValue = Anchor.TopLeft
  public anchorOffset = Vector2.newZero()
  public origin = Vector2.newZero()

  /**
   * 该矩形为 Drawable 的初始矩形，该矩形则是为了保留变换之前的数据
   */
  public initRectangle = new Rectangle()
  /**
   * 此为矩阵变换之后的矩形，用于布局计算
   */
  public rectangle = new Rectangle()
  /**
   * 经过矩阵变换之后的四边形，用于鼠标事件检测
   */
  public drawQuad = new Quad()

  protected parent: Nullable<Box> = null;
  protected isAvailable = false;
  /**
   * 用于控制 Drawable 是否可被渲染
   */
  public isVisible = true;

  protected disposeList: DisposableFunc[] = []

  protected invalidationValue = Invalidation.None
  protected invalidationSource = InvalidationSource.Self

  constructor(public config: C) {
    super()
    this.isAvailable = true;
    this.applyConfig()
    provide(this.constructor.name, this)
    DrawableRecorder.record(this)
  }

  public setAnchor(anchor: number) {
    this.anchorValue = anchor
    const anchorX = Axis.getXAxis(anchor),
      anchorY = Axis.getYAxis(anchor)
    if (anchorX === Axis.X_LEFT) {
      this.anchor.x = 0
    } else if (anchorX === Axis.X_CENTER) {
      this.anchor.x = .5
    } else {
      this.anchor.x = 1
    }
    if (anchorY === Axis.Y_TOP) {
      this.anchor.y = 0
    } else if (anchorY === Axis.Y_CENTER) {
      this.anchor.y = .5
    } else {
      this.anchor.y = 1
    }
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
  }

  public setAnchorOffset(offset: Vector2) {
    this.anchorOffset.setFrom(offset)
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
  }

  public setOrigin(origin: number) {
    const originX = Axis.getXAxis(origin), originY = Axis.getYAxis(origin)
    if (originX === Axis.X_LEFT) {
      this.origin.x = 0
    } else if (originX === Axis.X_CENTER) {
      this.origin.x = .5
    } else {
      this.origin.x = 1
    }
    if (originY === Axis.Y_TOP) {
      this.origin.y = 0
    } else if (originY === Axis.Y_CENTER) {
      this.origin.y = .5
    } else {
      this.origin.y = 1
    }
  }

  public getWidth() {
    return this.initRectangle.getWidth()
  }

  public getHeight() {
    return this.initRectangle.getHeight()
  }

  public setWidth(w: number) {
    this.sizeParam.x = w
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
    this.invalidate(Invalidation.Size)
  }

  public setHeight(h: number) {
    this.sizeParam.y = h
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
    this.invalidate(Invalidation.Size)
  }

  public setSize(width: number, height: number) {
    this.sizeParam.set(width, height)
    this.parent?.invalidate(Invalidation.Layout, InvalidationSource.Child)
    this.invalidate(Invalidation.Size)
  }

  public getSize() {
    return Vector(this.initRectangle.getWidth(), this.initRectangle.getHeight())
  }

  public getPosition() {
    return this.initRectangle.topLeft
  }

  public applyConfig() {
    const config = this.config
    this.sizeParam.set(config.size.x, config.size.y)
    if (config.size.x !== Size.FillParent && config.size.y !== Size.FillParent) {
      this.initRectangle.setWidth(config.size.x)
      this.initRectangle.setHeight(config.size.y)
    } else {
      this.invalidate(Invalidation.Size | Invalidation.Layout)
    }
    this.setAnchor(config.anchor ?? Anchor.TopLeft)
    this.setOrigin(config.origin ?? Anchor.Center)
    if (config.offset) {
      this.setAnchorOffset(Vector(config.offset.x, config.offset.y))
    }
  }

  /**
   * 当父容器的尺寸发生变化时调用，如果没有父容器，则在窗口尺寸变化时调用
   * @protected
   */
  public onSizeChanged() {
    this.invalidate(Invalidation.Layout)
  }

  public updateSize() {
    const width = this.sizeParam.x
    const height = this.sizeParam.y
    const parentWidth =
      this.parent ? this.parent.initRectangle.getWidth() : Coordinate.size.x
    const parentHeight =
      this.parent ? this.parent.initRectangle.getHeight() : Coordinate.size.y
    this.initRectangle.setWidth(width === Size.FillParent ? parentWidth : width)
    this.initRectangle.setHeight(height === Size.FillParent ? parentHeight : height)
    if (this.rectangle.getHeight() === 0 || this.rectangle.getWidth() === 0) {
      this.rectangle.setFrom(this.initRectangle)
    }
  }

  //////////////////////////////////////////////////////////////////////////

  setScaleY(y: number) {
    super.setScaleY(y);
    this.parent?.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child)
    // this.parent?.updateSizeByChildren(true)
  }

  setScaleX(x: number) {
    super.setScaleX(x);
    this.parent?.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child)
    // this.parent?.updateSizeByChildren(true)
  }

  setScale(s: Vector2) {
    super.setScale(s);
    this.parent?.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child)
    // this.parent?.updateSizeByChildren(true)
  }

  protected transition = new DrawableTransition(this)

  private computeOrigin() {
    const origin = this.origin.copy()
    const width = this.initRectangle.getWidth()
    const height = this.initRectangle.getHeight()
    origin.setFrom(this.initRectangle.topLeft)
    origin.x += width * this.origin.x
    origin.y += height * this.origin.y
    return origin
  }

  protected appliedColor = Color.Transparent.copy()

  public updateTransform3() {
    const node = this.drawNode
    const matrix = node.matrix
    matrix.setFrom(this.parent?.drawNode.matrix ?? Matrix3.identify)
    const origin = this.computeOrigin()
    if (this.parent) {
      TransformUtils.applySelf(origin, node.matrix)
    }
    node.applyTransform(
      this._translate,
      this._rotate,
      this._scale,
      this._skew,
      origin
    )
    RectangleUtils.applyTo(this.initRectangle, matrix, this.rectangle)
    QuadUtils.fromRectangleTo(this.initRectangle, this.drawQuad)
    QuadUtils.applySelf(this.drawQuad, matrix)


    this.isPresent = !almostEquals(this.appliedColor.alpha, 0) ||
      !(almostEquals(this.rectangle.getWidth(), 0) ||
        almostEquals(this.rectangle.getHeight(), 0))

    this.computeColor()
  }

  onTransformApplied() {}

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

  /**
   * 该属性表示当前 Drawable 是否可见，不同于 isVisible，该属性不能外部设置，只能内部更新
   */
  public isPresent = true

  public updateTransition() {
    this.transition.updateTransform()
  }

  /////////////////////////////////////////////////////////////////////////////////////

  public setParent(parent: Box) {
    this.parent = parent;
  }
  /**
   * remove self from parent
   */
  public remove() {
    this.parent?.removeChild(this);
  }

  public load(renderer: WebGLRenderer) {
    this.invalidateSelf()
    this.onLoad(renderer);
  }

  public onLoad(renderer: WebGLRenderer) {}

  //////////////////////////////////////////////////////////////////

  public onUpdate() {}

  public update() {
    if (this.isAvailable) {
      this.invalidateSelf()
      this.doPreTask()
      this.updateTransition()
      this.onUpdate();
      this.updateTransform3();
      this.onTransformApplied()
      this.invalidateLayout()
      this.doOnInvalidate()
      this.doPostTask()
    }
  }

  //////////////////////////////////////////////////////////////////

  private hasInvalidate = false
  public invalidate(value: number = Invalidation.All, source: number = InvalidationSource.Self) {
    this.invalidationValue |= value
    this.invalidationSource |= source
  }

  public invalidateSelf() {
    this.hasInvalidate = this.invalidationValue !== Invalidation.None
    const value = this.invalidationValue
    if ((value & Invalidation.Size) > 0) {
      this.updateSize()
      this.invalidationValue &= ~Invalidation.Size
    }
  }

  public invalidateLayout() {
    if ((this.invalidationValue & Invalidation.Layout) > 0) {
      this.updateLayout()
      this.invalidationValue &= ~Invalidation.Layout
    }
  }

  public updateLayout() {}

  public doOnInvalidate() {
    if (this.hasInvalidate) {
      this.onInvalidate()
      this.hasInvalidate = false
    }
  }

  public onInvalidate() {}

  ///////////////////////////////////////////////////////////

  public drawNode: DrawNode = new DrawNode(this)

  public beforeCommit(node: DrawNode) {}

  public draw(renderer: WebGLRenderer): void {
    if (this.isAvailable && this.isVisible && this.isPresent) {
      this.drawNode.draw(renderer)
    }
  }

  abstract onDraw(node: DrawNode, renderer: WebGLRenderer): void;

  public onWindowResize() {
    this.invalidate(Invalidation.All)
  }

  public computeColor(alpha: number = 1) {
    const parentAlpha = this.parent?.appliedColor.alpha ?? 1
    this.appliedColor.setFrom(this._color)
    this.appliedColor.alpha = parentAlpha * this.getAlpha() * alpha
    this.isPresent = this.isPresent || !almostEquals(this.appliedColor.alpha, 0)
    return this.appliedColor
  }

  /////////////////////////////////////////////////////////

  public dispose(): void {
    this.isAvailable = false;
    unprovide(this.constructor.name)
    DrawableRecorder.remove(this)
    this.disableMouseEvent()
    for (let i = 0; i < this.disposeList.length; i++) {
      const disposable = this.disposeList[i]
      disposable && disposable()
    }
  }

  public addDisposable(init: () => DisposableFunc) {
    this.disposeList.push(init())
  }

  /////////////////////////////////////////////////////////////

  public placeholder() {}

  public mouseEvent: Nullable<DrawableMouseEvent> = null

  public enableMouseEvent() {
    this.mouseEvent = new DrawableMouseEvent(this)
  }

  public disableMouseEvent() {
    this.mouseEvent?.dispose()
    this.mouseEvent = null
  }

  public setOnClick(click: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onClick = click
    }
    return this
  }

  public setOnMouseDown(mouseDown: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseDown = mouseDown
    }
    return this
  }

  public setOnMouseMove(mouseMove: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseMove = mouseMove
    }
    return this
  }

  public setOnMouseUp(mouseUp: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseUp = mouseUp
    }
    return this
  }

  public setOnHover(hover: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onHover = hover
    }
    return this
  }

  public setOnHoverLost(hoverLost: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onHoverLost = hoverLost
    }
    return this
  }

  public setOnDrag(drag: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onDrag = drag
    }
    return this
  }

  public setOnDragLost(dragLost: MouseEventCall) {
    if (this.mouseEvent) {
      this.mouseEvent.onDragLost = dragLost
    }
    return this
  }

  ///////////////////////////////////////////////////////////

  protected task = new DrawableTask()

  public post(task: () => void) {
    this.task.post(task)
  }

  public pre(task: () => void) {
    this.task.pre(task)
  }

  public doPreTask() {
    this.task.consumePreTask()
  }

  public doPostTask() {
    this.task.consumePostTask()
  }
}
