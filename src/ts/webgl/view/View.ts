import { Nullable } from "../../type";
import { Coordinate2 } from "../base/Coordinate2";
import { Canvas } from "../canvas/Canvas";
import { anchor } from "../drawable/Anchor";
import { Invalidation, InvalidationSource } from "../drawable/Invalidation";
import { Transformable } from "../drawable/Transformable";
import { ViewDrawable } from "../drawable/ViewDrawable";
import type { MouseEvent } from "../event/ViewMouseEventSystem";
import { Disposable } from "../graphic/core/Disposable";
import { almostEquals } from "../graphic/core/Utils";
import { vector2 } from "../graphic/matrix/vec2";
import { quad } from "../graphic/shape/Quad";
import { rect } from "../graphic/shape/Rectangle";
import { LayoutMember, LayoutValue } from "../layout/LayoutValue";
import { TransformTransition } from "../transition/TransformTransition";
import { addInstance, removeInstance } from "../util/InstanceInject";
import { ViewGroup } from "./ViewGroup";


export class View extends Transformable implements Disposable {

  /**
   * rectangle of view, it stores view's position and size.
   * 
   * **Attention**: You cannot use this rectangle to set or get view's position or size. It will not be update correctly.
   * If you want to set or get view's position or size, you should use `position`, `size`, `width` or `height` property.
   */
  public rectangle = rect.create()

  /**
   * the quad after transform applied from initial rectangle.
   * It used for mouse detection
   */
  public computedQuad = quad.create()

  public state = ViewState.Ready

  public drawable = new ViewDrawable(this)

  public layoutList: LayoutMember[] = []

  public isVisible = true

  public isMouseEventEnabled = false

  constructor() {
    super();
    addInstance(this)
    this.layoutList.push(
      this.sizeBacking,
      this.originBacking
    )
  }

  /**
   * The method will be called when it added to view tree.
   * For example, it added to ViewGroup.
   *
   * You can do some initialization in this method.
   */
  public onLoad() {
    this.invalidate(Invalidation.All, InvalidationSource.Self)
  }

  /**
   * set view top left position, if position is `(0, 0)`, the view will be
   * located to the top-left of screen
   * @param position
   */
  public set position(position: vec2) {
    rect.setTopLeft(this.rectangle, position[0], position[1])
    this.invalidate(Invalidation.Position)
  }

  /**
   * Get view top left position
   */
  public get position(): vec2 {
    return vector2.clone(this.rectangle.topLeft);
  }

  private _anchor = anchor.TopLeft;

  public set anchor(a: vec2) {
    this._anchor = a
    this.invalidate(Invalidation.Position)
  }

  public get anchor(): vec2 {
    return this._anchor
  }

  private sizeMode = SizeMode.custom(vector2.create())

  private sizeBacking = new LayoutValue<vec2>(Invalidation.Size, () => {
    const parentSize = this.parent ? this.parent.size : Coordinate2.size
    const size = vector2.clone(this.sizeMode)
    const abs = Math.abs
    if (SizeMode.isAutoSize(size[0])) {
      size[0] = parentSize[0] * abs(size[0])
    }
    if (SizeMode.isAutoSize(size[1])) {
      size[1] = parentSize[1] * abs(size[1])
    }
    rect.setWidth(this.rectangle, size[0])
    rect.setHeight(this.rectangle, size[1])

    return size
  })

  public get width(): number {
    return this.sizeBacking.value[0]
  }

  public set width(w: number) {
    if (almostEquals(rect.getWidth(this.rectangle), w)) {
      return
    }
    this.sizeMode[0] = w
    this.invalidate(Invalidation.Size)
  }
  public get height(): number {
    return this.sizeBacking.value[1]
  }

  public set height(h: number) {
    if (almostEquals(rect.getHeight(this.rectangle), h)) {
      return
    }
    this.sizeMode[1] = h
    this.invalidate(Invalidation.Size)
  }

  public get size(): vec2 {
    return vector2.clone(this.sizeBacking.value)
  }

  public set size(size: vec2) {
    const width = size[0], height = size[1]
    const rectangle = this.rectangle
    if (almostEquals(rect.getWidth(rectangle), width) && almostEquals(rect.getHeight(rectangle), height)) {
      return
    }
    vector2.copy(this.sizeMode, size)
    this.invalidate(Invalidation.Size)
  }

  public onWindowResize() {
    this.invalidate(Invalidation.All)
  }

  /**
   * This method will be called when view complete first layout.
   */
  protected onLayoutReady() {
    
  }

  /**
   * This method will be called when view complete layout.
   */
  protected onLayoutComplete() {

  }

  public _origin = anchor.TopLeft;

  public set origin(origin: vec2) {
    this._origin = origin
    this.invalidate(Invalidation.Size)
  }

  public get origin(): vec2 {
    return this.originBacking.value
  }

  private originBacking = new LayoutValue<vec2>(Invalidation.Size | Invalidation.Position, () => {
    const origin = this._origin
    const size = this.size

    return vector2.fromValues(
      size[0] * origin[0],
      size[1] * origin[1]
    )
  })

  public invalidate(invalidate: number = Invalidation.None, source: number = InvalidationSource.Self) {
    // notify parent view to invalidate
    if (source === InvalidationSource.Self) {
      this.parent?.invalidate(invalidate, InvalidationSource.Child)
    }
    // This invalidation is from parent view, we should not draw it again
    if (source === InvalidationSource.Child) {
      // In fact, draw invalidation is useless
      invalidate &= ~(Invalidation.Draw)
    }

    const list = this.layoutList
    for (let i = 0; i < list.length; i++) {
      const layout = list[i]
      if ((invalidate & layout.invalidation) > 0) {
        layout.invalidate()
      }
    }

    this.onInvalidate(invalidate, source)    
  }

  protected onInvalidate(invalidate: number, source: number) {}

  public parent: Nullable<ViewGroup> = null

  public remove() {
    this.parent?.removeView(this)
  }

  public transition = new TransformTransition(this)

  public transform(clear: boolean = true) {
    if (clear) {
      return this.transition.clear
    }
    return this.transition
  }

  public get isNotPresent() {
    const width = this.width, height = this.height
    const scaleX = this.scaleX, scaleY = this.scaleY
    return almostEquals(width, 0) || almostEquals(height, 0) ||
      almostEquals(scaleX, 0) || almostEquals(scaleY, 0) || 
      !this.isVisible || almostEquals(this.alpha, 0)
  }

  public update() {
    let state = this.state
    if (state === ViewState.Ready) {
      state = ViewState.Loaded
      this.state = state
      this.onLoad()
    }
    if (state >= ViewState.Loaded && state < ViewState.Disposed) {
      this.onUpdate()
      this.transition.updateTransform()
    }
  }

  public onUpdate() {}

  public draw(canvas: Canvas) {
    const state = this.state
    if (state < ViewState.Loaded || state >= ViewState.Disposed || this.isNotPresent) {
      return
    }
    const drawable = this.drawable
    drawable.setBound(this.rectangle)
    drawable.draw(canvas)
  }

  public onDraw(canvas: Canvas) {

  }

  //-----------------------------------------

  public onClick(event: MouseEvent) {}
  public onMouseDown(event: MouseEvent) {}
  public onMouseUp(event: MouseEvent) {}
  public onMouseMove(event: MouseEvent) {}
  public onHover(event: MouseEvent) {}
  public onHoverLost(event: MouseEvent) {}
  public onDrag(event: MouseEvent) {}
  public onDragLost(event: MouseEvent) {}

  //-----------------------------------------

  public dispose() {
    if (this.state >= ViewState.Disposed) {
      return
    }
    removeInstance(this)
    this.layoutList.length = 0
    this.parent = null
    this.state = ViewState.Disposed
    this.onDispose()
  }

  protected onDispose() {}

}

/**
 * @internal
 * This state is used to mark view's state.
 *
 * The state cannot be back
 */
export enum ViewState {
  /**
   * When a view does not load yet
   */
  Ready = 1,

  /**
   * When a view is loaded
   */
  Loaded = 2,

  /**
   * When a view is disposed
   */
  Disposed = 3

}

/**
 * `SizeMode` is used to define the size of a view that contain auto size, such as fill parent and percent size of parent.
 * The method of `SizeMode` returns a negative value to indicate that it is auto size.
 */
export class SizeMode {

  public static readonly FILL_WIDTH = -1
  public static readonly FILL_HEIGHT = -1

  public static fill() {
    return vector2.fromValues(-1, -1)
  }

  public static custom(size: vec2 | number) {
    if (typeof size === "number") {
      return vector2.fromValues(size, size)
    }
    return size
  }

  /**
   * 
   * @param percent percent value, range from 0 to 1
   * @returns negative value of percent, which means auto size
   */
  public static percentValue(percent: number) {
    return -percent
  }

  public static percentSize(size: vec2) {
    return vector2.negate(vector2.create(), size)
  }

  public static isAutoSize(size: vec2 | number) {
    return typeof size === "number" ? size < 0 : (size[0] < 0 || size[1] < 0)
  }

}
