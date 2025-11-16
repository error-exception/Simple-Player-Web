import { Canvas } from "../canvas/Canvas";
import { Invalidation, InvalidationSource } from "../drawable/Invalidation";
import { vector2 } from "../graphic/matrix/vec2";
import { LayoutMember } from "../layout/LayoutValue";
import { RenderScheduler } from "../RenderScheduler";
import { View } from "./View";


export class ViewGroup extends View {

  public children: View[] = []

  constructor() {
    super();
    this.layoutList.push(this.childLayoutMember)
  }

  public onLoad(): void {}

  public addView(view: View) {
    this.children.push(view)
    this.addTransformable(view)
    this.onChildChanged(view, false)
    this.forceLayoutChildren()
  }

  public addViews(views: View[]) {
    for (const view of views) {
      this.children.push(view)
      this.addTransformable(view)
      this.onChildChanged(view, false)
    }
    this.forceLayoutChildren()
  }

  public addViewAt(view: View, index: number) {
    this.children.splice(index, 0, view)
    this.transformableChildren.splice(index, 0, view)
    this.onChildChanged(view, false)
    this.forceLayoutChildren()
  }

  public removeView(view: View) {
    const index = this.children.indexOf(view)
    if (index < 0) {
      return
    }
    this.children.splice(index, 1)
    this.removeTransformable(view)
    this.onChildChanged(view, true);
    this.forceLayoutChildren()
    RenderScheduler.scheduleDispose(view)
  }

  public onWindowResize() {
    super.onWindowResize();
    const children = this.children, len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].onWindowResize()
    }
  }

  protected onChildChanged(view: View, isRemove: boolean) {
    view.parent = isRemove ? null : this
  }

  private childLayoutMember = new LayoutMember(Invalidation.Position | Invalidation.Size)

  protected onInvalidate(invalidate: number, source: number): void {
    super.onInvalidate(invalidate, source)
    // When parent position and size changed, we need to update child position and size
    // It is include position and size change of child to make parent relayout, and notify other child to update position and size based on constraint
    // this.invalidate(invalidate, InvalidationSource.Parent)

    // Check if child need to relayout, this invalidation come from child
    // if (source === InvalidationSource.Child && (invalidate & Invalidation.ChildLayout) > 0) {
    //   invalidate |= ()
    // }

    invalidate &= ~(Invalidation.Draw)
    const children = this.children, len = children.length;

    for (let i = 0; i < len; i++) {
      children[i].invalidate(invalidate, InvalidationSource.Parent)
    }
  }

  public update() {
    this.doLayout()
    super.update();
  }

  public onUpdate() {
    super.onUpdate();
    this.updateChildren()
  }

  private updateChildren() {
    const children = this.children, len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].update()
    }
  }

  private doLayout() {
    if (!this.childLayoutMember.isValid()) {  
      this.onLayoutChildren()
      this.childLayoutMember.validate()
    }
  }

  private forceLayoutChildren() {
    this.onLayoutChildren()
  }

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    const children = this.children, len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].draw(canvas)
    }
  }

  protected onLayoutChildren() {
    const children = this.children, len = children.length;
    // const [ x, y ] = this.position
    const [ parentWidth, parentHeight ] = this.size
    
    for (let i = 0; i < len; i++) {
      const child = children[i]
      const anchor = child.anchor
      const [ width, height ] = child.size
      const childX = (parentWidth * anchor[0] - width * anchor[0])
      const childY = (parentHeight * anchor[1] - height * anchor[1])
      
      child.position = vector2.fromValues(childX, childY)
    }
  }

  protected onDispose() {
    super.onDispose();
    const children = this.children, len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].dispose()
    }
    this.children.length = 0
  }

}
