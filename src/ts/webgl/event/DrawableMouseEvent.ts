import type {Drawable} from "../drawable/Drawable";
import {IMouseEvent, MouseState} from "../../global/MouseState";
import {Vector2} from "../core/Vector2";
import type {Nullable} from "../../type";
import type {Disposable} from "../core/Disposable";
import {MouseEventRecorder} from "./MouseEventRecorder";

interface MouseEvent {
  x: number
  y: number
  viewPosition: Vector2
  which: number
}

export type MouseEventCall = (event: MouseEvent) => void

/**
 * todo: 默认情况下，Drawable 不具备鼠标事件，只有显式声明才可
 */
export class DrawableMouseEvent implements Disposable {

  constructor(public source: Drawable) {
    MouseEventRecorder.record(this)
  }

  public inBound(position: Vector2) {
    return this.source.drawQuad.inBound(position)
    // const source = this.source
    // const drawTopLeft = source.position;
    // const drawBottomRight = source.bottomRight;
    // const { x, y } = position
    // return (
    //   x > drawTopLeft.x && x <= drawBottomRight.x &&
    //     y > drawTopLeft.y && y <= drawBottomRight.y
    // )
  }

  protected get isAvailable() {
    return this.source.isVisible
  }

  public get isPresent() {
    return this.source.isPresent
  }

  protected hasEvent<E extends keyof IMouseEvent>(source: Drawable, eventName: E) {
    //@ts-ignore
    return eventName in source && typeof source[eventName] === 'function'
  }

  private downPosition = Vector2.newZero()
  private isClickDown = false
  public mouseDown(which: number, position: Vector2) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.downPosition.setFrom(position)
      this.isClickDown = true
      this.triggerMouseDown(which, position)
    }
  }

  public mouseUp(which: number, position: Vector2) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.triggerMouseUp(which, position)
      if (!this.downPosition.isZero() && this.isClickDown) {
        this.triggerClick(which, position)
        this.downPosition.set(0, 0)
        this.isClickDown = false
      }
    }
    this.dragLost(which, position);
  }

  public mouseMove(which: number, position: Vector2) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.triggerMouseMove(which, position)
      this.hover(which, position);
      if (MouseState.hasKeyDown()) {
        this.drag(MouseState.which, position);
      }
      return;
    }
    if (this.isDragged) {
      this.drag(MouseState.which, position);
    }
    this.hoverLost(which, position);
  }

  private isHovered = false;

  public hover(which: number, position: Vector2) {
    if (!this.isHovered) {
      this.isHovered = true;
      this.triggerHover(which, position)
    }
  }

  public hoverLost(which: number, position: Vector2) {
    if (this.isAvailable && this.isHovered && !this.inBound(position) && this.isPresent) {
      this.isHovered = false;
      this.triggerHoverLost(which, position)
    }
  }

  private isDragged = false;
  public drag(which: number, position: Vector2) {
    if (this.isAvailable && this.isPresent && this.inBound(position)) {
      this.isDragged = true;
      this.triggerDrag(which, position)
    }
  }

  public dragLost(which: number, position: Vector2) {
    if (this.isAvailable && this.isDragged) {
      this.isDragged = false;
      this.triggerDragLost(which, position)
    }
  }

  private event: MouseEvent = { x: 0, y: 9, viewPosition: Vector2.newZero(), which: 0}

  public triggerMouseDown(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onMouseDown')) {
      //@ts-ignore
      this.source.onMouseDown()
    }
    this.onMouseDown?.(event)
  }

  public triggerMouseMove(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onMouseMove')) {
      //@ts-ignore
      this.source.onMouseMove()
    }
    this.onMouseMove?.(event)
  }

  public triggerMouseUp(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onMouseUp')) {
      //@ts-ignore
      this.source.onMouseUp()
    }
    this.onMouseUp?.(event)
  }

  public triggerClick(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onClick')) {
      //@ts-ignore
      this.source.onClick()
    }
    this.onClick?.(event)
  }

  public triggerHover(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onHover')) {
      //@ts-ignore
      this.source.onHover()
    }
    this.onHover?.(event)
  }

  public triggerHoverLost(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onHoverLost')) {
      //@ts-ignore
      this.source.onHoverLost()
    }
    this.onHoverLost?.(event)
  }

  public triggerDrag(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onDrag')) {
      //@ts-ignore
      this.source.onDrag()
    }
    this.onDrag?.(event)
  }

  public triggerDragLost(which: number, position: Vector2) {
    const event = this.event
    event.viewPosition = position
    event.which = which
    if (this.hasEvent(this.source, 'onDragLost')) {
      //@ts-ignore
      this.source.onDragLost()
    }
    this.onDragLost?.(event)
  }

  public onMouseDown: Nullable<MouseEventCall> = null

  public onMouseMove: Nullable<MouseEventCall> = null

  public onMouseUp: Nullable<MouseEventCall> = null

  public onClick: Nullable<MouseEventCall> = null

  public onHover: Nullable<MouseEventCall> = null

  public onHoverLost: Nullable<MouseEventCall> = null

  public onDrag: Nullable<MouseEventCall> = null

  public onDragLost: Nullable<MouseEventCall> = null

  public dispose() {
    this.onMouseDown = null
    this.onMouseMove = null
    this.onMouseUp = null
    this.onClick = null
    this.onHover = null
    this.onHoverLost = null
    this.onDrag = null
    this.onDragLost = null
    MouseEventRecorder.remove(this)
  }
}

