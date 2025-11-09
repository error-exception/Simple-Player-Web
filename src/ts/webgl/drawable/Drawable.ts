import {IMouseEvent} from "../../global/MouseState";
import {Box} from "../box/Box";
import {Disposable} from "../graphic/core/Disposable";
import {almostEquals} from "../graphic/core/Utils";
import {Vector, Vector2} from "../graphic/core/Vector2";
import {Axis} from "./Axis";
import {provide, unprovide} from "../util/DependencyInject";
import {TransformTransition} from "../transition/TransformTransition";
import {Anchor} from "./Anchor";
import {DrawNode} from "./DrawNode";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Matrix3} from "../graphic/core/Matrix3";
import {DrawableRecorder} from "./DrawableRecorder";
import {DrawableMouseEvent, type MouseEventCall} from "../event/DrawableMouseEvent";
import type {Nullable} from "../../type";
import {Size} from "./Size";
import {Transformable} from "./Transformable";
import {Color} from "../base/Color";
import {Rectangle} from "../graphic/shape/Rectangle";
import {Quad} from "../graphic/shape/Quad";
import {RectangleUtils} from "../graphic/shape/RectangleUtils";
import {QuadUtils} from "../graphic/shape/QuadUtils";
import {Invalidation, InvalidationSource} from "./Invalidation";
import {LayoutMember, LayoutValue} from "../layout/LayoutValue";
import {Coordinate2} from "../base/Coordinate2";
import {Vector2Utils} from "../graphic/core/Vector2Utils";

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
   * 相对位置
   */
  public position = Vector2.newZero()
  public size = Vector2.newZero()

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

  protected layoutList: LayoutMember[] = []

  constructor(public config: C) {
    super()
    this.isAvailable = true;
    provide(this.constructor.name, this)
    DrawableRecorder.record(this)
    this.addLayout(this.sizeBacking)
    this.addLayout(this.originBacking)
    this.applyConfig()
  }

  protected addLayout(layout: LayoutMember) {
    this.layoutList.push(layout)
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
    this.invalidate(Invalidation.Layout)
  }

  public setAnchorOffset(offset: Vector2) {
    this.anchorOffset.setFrom(offset)
    this.invalidate(Invalidation.Layout)
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
    this.invalidate(Invalidation.Size)
  }

  private originBacking = new LayoutValue<Vector2>(Invalidation.Size | Invalidation.ParentAutoSize | Invalidation.Layout)

  public getOrigin(): Vector2 {
    if (!this.originBacking.isValid()) {
      this.originBacking.value = this.computeOrigin()
    }
    return this.originBacking.value
  }

  public getWidth() {
    if (!this.sizeBacking.isValid()) {
      this.sizeBacking.value = this.computeSize()
    }
    return this.sizeBacking.value.x
  }

  public getHeight() {
    if (!this.sizeBacking.isValid()) {
      this.sizeBacking.value = this.computeSize()
    }
    return this.sizeBacking.value.y
  }

  public setWidth(w: number) {
    if (almostEquals(this.size.x, w)) {
      return
    }
    this.sizeParam.x = w
    this.invalidate(Invalidation.Size | Invalidation.ParentAutoSize)
  }

  public setHeight(h: number) {
    if (almostEquals(this.size.y, h)) {
      return
    }
    this.sizeParam.y = h
    this.invalidate(Invalidation.Size | Invalidation.ParentAutoSize)
  }

  public setSize(width: number, height: number) {
    if (almostEquals(this.size.x, width) && almostEquals(this.size.y, height)) {
      return
    }
    this.sizeParam.set(width, height)
    this.invalidate(Invalidation.Size | Invalidation.ParentAutoSize)
  }

  public getSize() {
    if (!this.sizeBacking.isValid()) {
      this.sizeBacking.value = this.computeSize()
    }
    return this.sizeBacking.value
  }

  public getPosition() {
    return this.position
  }

  public setPosition(x: number, y: number) {
    this.position.set(x, y)
  }

  public applyConfig() {
    const config = this.config
    this.sizeParam.set(config.size.x, config.size.y)
    if (config.size.x !== Size.FillParent && config.size.y !== Size.FillParent) {
      this.size.setFrom(config.size)
    } else {
      this.invalidate(Invalidation.Size | Invalidation.Layout)
    }
    this.setAnchor(config.anchor ?? Anchor.TopLeft)
    this.setOrigin(config.origin ?? Anchor.Center)
    if (config.offset) {
      this.setAnchorOffset(Vector(config.offset.x, config.offset.y))
    }
  }

  public sizeBacking = new LayoutValue<Vector2>(Invalidation.Size)

  public computeSize() {
    const width = this.sizeParam.x
    const height = this.sizeParam.y
    const parentWidth =
      this.parent ? this.parent.getWidth() : Coordinate2.size.x
    const parentHeight =
      this.parent ? this.parent.getHeight() : Coordinate2.size.y
    this.size.set(width === Size.FillParent ? parentWidth : width, height === Size.FillParent ? parentHeight : height)
    return this.size
  }

  //////////////////////////////////////////////////////////////////////////

  protected transition = new TransformTransition(this)

  private computeOrigin() {
    return Vector(
      this.getWidth() * this.origin.x,
      this.getHeight() * this.origin.y
    )
  }

  protected appliedColor = Color.Transparent.copy()

  public updateTransform() {
    const node = this.drawNode
    const matrix = node.matrix
    matrix.setFrom(this.parent?.drawNode.matrix ?? Matrix3.identify)
    // const info = node.transformInfo
    // info.setFrom(this.parent?.drawNode.transformInfo ?? TransformInfo)
    const origin = this.getOrigin().copy()
    if (this.parent) {
      Vector2Utils.applySelf(origin, matrix)
    }
    node.applyTransform(
      this._translate.add(this.position),
      this._rotate,
      this._scale,
      this._skew,
      origin
    )
    this.rectangle.setWidth(this.getWidth())
    this.rectangle.setHeight(this.getHeight())
    this.rectangle.setTopLeft(0, 0)

    QuadUtils.fromRectangleTo(this.rectangle, this.drawQuad)

    RectangleUtils.applySelf(this.rectangle, matrix)
    QuadUtils.applySelf(this.drawQuad, matrix)

    this.computeColor()

    this.isPresent = !almostEquals(this.appliedColor.alpha, 0) ||
      !(almostEquals(this.rectangle.getWidth(), 0) ||
        almostEquals(this.rectangle.getHeight(), 0))
    this.onTransformUpdated()
  }

  onTransformUpdated() {}

  /**
   * 返回一个平滑过渡的变换
   * @param clear 默认为 true，如果为 true，初次调用变换方法时，将根据当前时间为基准进行平滑变换，如果想开始一个新的平滑
   * 过渡，则应该保持默认值
   */
  public transform(clear: boolean = true): TransformTransition {
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
    this.onLoad(renderer);
  }

  public onLoad(renderer: WebGLRenderer) {}

  //////////////////////////////////////////////////////////////////

  public onUpdate() {}

  protected isLoaded = false
  public update(renderer: WebGLRenderer) {
    if (!this.isLoaded) {
      this.isLoaded = true
      this.load(renderer)
    }
    if (this.isAvailable) {
      this.validate()
      this.updateTransition()
      this.onUpdate();
      this.updateTransform();
      this.updateChildren(renderer)
    }
  }

  protected updateChildren(renderer: WebGLRenderer) {}

  //////////////////////////////////////////////////////////////////

  public invalidate(value: number = Invalidation.All, source: number = InvalidationSource.Self) {
    if (source === InvalidationSource.Self) {
      this.parent?.invalidate(value & Invalidation.ParentAutoSize, InvalidationSource.Child)
    }
    if (source === InvalidationSource.Child) {
      value &= ~(Invalidation.Draw | Invalidation.Size | Invalidation.Layout)
    }

    const list = this.layoutList
    for (let i = 0; i < list.length; i++) {
      const layout = list[i]
      if ((value & layout.invalidation) > 0) {
        layout.invalidate()
      }
    }

    this.onInvalidate(value, source)
  }

  protected onInvalidate(value: number, source: number) {}

  public validate() {}

  ///////////////////////////////////////////////////////////

  public drawNode: DrawNode = new DrawNode(this)

  /**
   * This method will be called after onDraw. It is used to send uniform data to shader
   * @param node
   */
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

}
