import { vector2 } from "../graphic/matrix/vec2";
import { quad } from "../graphic/shape/Quad";
import { ViewState, type View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";



/**
 * 鼠标事件数据
 */
export interface MouseEvent {
  /** 鼠标在屏幕上的绝对坐标 X */
  x: number;
  /** 鼠标在屏幕上的绝对坐标 Y */
  y: number;
  /** 鼠标在目标视图中的相对坐标 */
  viewPosition: vec2;
  
  which: number;
  /** 事件目标视图 */
  target: View;
  propagationStopped: boolean;
  fallthroughStopped: boolean;
  isMouseDown: boolean;
  isMouseDragging: boolean;
  isHovered: boolean;
  /** 事件阶段：捕获阶段或冒泡阶段 */
  eventPhase: EventPhase;
}

/**
 * 事件阶段枚举
 */
export enum EventPhase {
  /** 捕获阶段：从根节点到目标节点 */
  Capture = 0,
  /** 冒泡阶段：从目标节点到根节点 */
  Bubble = 1
}

/**
 * 视图鼠标事件系统
 * 
 * 支持以下8种事件：
 * 1. onClick：在 view 区域内点击鼠标左键，在任意区域内释放时触发
 * 2. onHover: 当鼠标移动到 view 区域内时触发
 * 3. onHoverLost: 当鼠标移出 view 区域时触发
 * 4. onDrag: 在 view 区域内按下左键并移动时触发
 * 5. onDragLost: 在 onDrag 触发的前提下，在任意区域内松开鼠标左键时触发
 * 6. onMouseDown: 在 view 区域内按下鼠标左键时触发
 * 7. onMouseUp: 在 onMouseDown 触发的前提下，在任意区域内释放鼠标左键时触发
 * 8. onMouseMove: 在 view 区域内移动鼠标时触发
 * 
 * 1. 首先收集所有鼠标所处的 view
 * 2. 事件从最顶层的 view （z 轴方向）开始向底层穿透，经过的所有 view 触发相应的事件
 * 3. 一个 view 可以阻止事件继续向底层穿透
 * 4. 处于叶子节点的 view 触发事件时，事件会一直向上传递，直到根节点
 * 5. 事件从叶子到根节点的传播可以在路径上任意节点阻断
 */
export class ViewMouseEventSystem {
  private static instance: ViewMouseEventSystem;
  
  /** 根视图引用 */
  private rootView: ViewGroup | null = null;

  private viewMouseInfoMap = new WeakMap<View, MouseEvent>();
  /** 跟踪所有有鼠标事件的视图（用于迭代） */
  private trackedViews: View[] = [];
  /** 跟踪当前悬停的视图（保持Z轴顺序） */
  private hoveredViews: View[] = [];
  
  public static getInstance(): ViewMouseEventSystem {
    if (!this.instance) {
      this.instance = new ViewMouseEventSystem();
    }
    return this.instance;
  }
  
  /**
   * 设置根视图
   */
  public setRootView(rootView: ViewGroup): void {
    this.rootView = rootView;
  }
  
  /**
   * 处理鼠标按下事件
   */
  public handleMouseDown(x: number, y: number, button: number): void {
    const targets: View[] = this.findTargetView(x, y);

    for (const target of targets) {
      let event = this.viewMouseInfoMap.get(target)
      if (!event) {
        event = this.createMouseEvent(x, y, button, target);
        this.viewMouseInfoMap.set(target, event);
        this.trackedViews.push(target);
      }
      event.isMouseDown = true;
      target.onMouseDown(event)
    }
  }

  /**
   * 处理鼠标移动事件
   */
  public handleMouseMove(x: number, y: number): void {
    const targets: View[] = this.findTargetView(x, y);

    // 更新悬停状态
    for (const target of targets) {
      let event = this.viewMouseInfoMap.get(target);
      if (!event) {
        event = this.createMouseEvent(x, y, 0, target);
        this.viewMouseInfoMap.set(target, event);
        this.trackedViews.push(target);
      }

      event.x = x;
      event.y = y;
      event.viewPosition = vector2.fromValues(
        x - target.computedQuad.topLeft[0],
        y - target.computedQuad.topLeft[1]
      );
      
      // 触发悬停事件
      if (!event.isHovered) {
        event.isHovered = true;
        this.hoveredViews.push(target);
        target.onHover(event);
      }
      
      // 触发鼠标移动事件
      target.onMouseMove(event);
      
      // 触发拖拽事件
      if (event.isMouseDown && !event.isMouseDragging) {
        event.isMouseDragging = true;
        target.onDrag(event);
      } else if (event.isMouseDragging) {
        target.onDrag(event);
      }
    }

    // 处理失去悬停的视图
    for (let i = this.hoveredViews.length - 1; i >= 0; i--) {
      const view = this.hoveredViews[i];
      const event = this.viewMouseInfoMap.get(view);
      if (event && !targets.includes(view) && event.isHovered) {
        event.isHovered = false;
        view.onHoverLost(event);
        this.hoveredViews.splice(i, 1);
      }
    }

    // 处理拖拽中的视图（即使不在当前目标中）
    for (let i = this.trackedViews.length - 1; i >= 0; i--) {
      const view = this.trackedViews[i];
      const event = this.viewMouseInfoMap.get(view);
      if (event && event.isMouseDragging && !targets.includes(view)) {
        // 更新事件坐标
        event.x = x;
        event.y = y;
        event.viewPosition = vector2.fromValues(
          x - view.computedQuad.topLeft[0],
          y - view.computedQuad.topLeft[1],
        );
        // 继续触发拖拽事件
        view.onDrag(event);
      }
    }
  }
  
  /**
   * 处理鼠标释放事件
   */
  public handleMouseUp(x: number, y: number, button: number): void {
    const targets: View[] = this.findTargetView(x, y);
    
    for (const target of targets) {
      const event = this.viewMouseInfoMap.get(target);
      if (event) {
        // 触发鼠标释放事件
        target.onMouseUp(event);
        
        // 触发点击事件（如果之前有按下）
        if (event.isMouseDown) {
          target.onClick(event);
        }
        
        // 触发拖拽结束事件
        if (event.isMouseDragging) {
          event.isMouseDragging = false;
          target.onDragLost(event);
        }
        
        // 重置按下状态
        event.isMouseDown = false;
      }
    }
    
    // 清理不在目标中的视图的按下状态
    for (let i = this.trackedViews.length - 1; i >= 0; i--) {
      const view = this.trackedViews[i];
      const event = this.viewMouseInfoMap.get(view);
      if (event && !targets.includes(view) && event.isMouseDown) {
        event.isMouseDown = false;
        view.onMouseUp(event);
        
        if (event.isMouseDragging) {
          event.isMouseDragging = false;
          view.onDragLost(event);
        }
      }
    }
  }
  
  /**
   * 获取当前悬停的视图列表
   */
  private getHoveredViews(): View[] {
    return [...this.hoveredViews];
  }
  
  
  
  /**
   * 查找鼠标位置下的目标视图
   */
  private findTargetView(x: number, y: number): View[] {
    if (!this.rootView) return [];
    const targets: View[] = []
    this.findTargetInViewGroup(this.rootView, x, y, targets);
    return targets
  }
  
  /**
   * 在视图组中递归查找目标视图
   */
  private findTargetInViewGroup(viewGroup: ViewGroup, x: number, y: number, targets: View[]) {
    // 从后往前遍历子视图 (Z轴顺序，后面的视图在上面)
    for (let i = viewGroup.children.length - 1; i >= 0; i--) {
      const child = viewGroup.children[i];

      const canNotAcceptEvent = child.isNotPresent 
        || child.state !== ViewState.Loaded
      
      // 跳过不可见或无效的视图
      if (canNotAcceptEvent) {
        continue;
      }
      
      // 检查子视图是否包含鼠标位置
      if (quad.isPointInQuad(child.computedQuad, vector2.fromValues(x, y))) {
        // 如果是视图组，递归查找
        if (child instanceof ViewGroup) {
          this.findTargetInViewGroup(child, x, y, targets);
        }
        if (child.isMouseEventEnabled) {
          targets.push(child)
        }
      }
    }
  }

  private createMouseEvent(x: number, y: number, which: number, target: View): MouseEvent {
    return {
      x,
      y,
      viewPosition: vector2.fromValues(
        x - target.computedQuad.topLeft[0],
        y - target.computedQuad.topLeft[1],
      ),
      which,
      target,
      propagationStopped: false,
      fallthroughStopped: false,
      isHovered: false,
      isMouseDown: false,
      isMouseDragging: false,
      eventPhase: EventPhase.Capture
    }
  }
}
