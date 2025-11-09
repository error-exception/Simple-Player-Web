import { View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";
import { MouseEventIntegrator } from "./MouseEventIntegrator";
import { EventPhase, type MouseEvent } from "./ViewMouseEventSystem";

/**
 * 示例视图 - 演示鼠标事件处理
 */
export class ExampleButtonView extends View {
  private isHovered = false;
  private isPressed = false;
  
  constructor(private name: string = 'Button') {
    super();
    this.width = 200;
    this.height = 50;
  }
  
  public onClick(event: MouseEvent): void {
    console.log(`${this.name} clicked!`, {
      position: { x: event.x, y: event.y },
      viewPosition: event.viewPosition,
      button: event.which,
      eventPhase: EventPhase[event.eventPhase],
      target: event.target === this ? 'self' : 'other'
    });
    
    // 演示阻止事件传播
    if (this.name === 'StopPropagationButton') {
      event.stopPropagation();
      console.log(`${this.name}: Event propagation stopped`);
    }
  }
  
  public onHover(event: MouseEvent): void {
    this.isHovered = true;
    console.log(`${this.name} hovered (${EventPhase[event.eventPhase]})`);
  }
  
  public onHoverLost(event: MouseEvent): void {
    this.isHovered = false;
    console.log(`${this.name} hover lost (${EventPhase[event.eventPhase]})`);
  }
  
  public onMouseDown(event: MouseEvent): void {
    this.isPressed = true;
    console.log(`${this.name} mouse down (${EventPhase[event.eventPhase]})`);
  }
  
  public onMouseUp(event: MouseEvent): void {
    this.isPressed = false;
    console.log(`${this.name} mouse up (${EventPhase[event.eventPhase]})`);
  }
  
  public onMouseMove(event: MouseEvent): void {
    // console.log(`${this.name} mouse move`, event.viewPosition);
  }
  
  public onDrag(event: MouseEvent): void {
    console.log(`${this.name} dragging`, event.viewPosition);
  }
  
  public onDragLost(event: MouseEvent): void {
    console.log(`${this.name} drag ended`);
  }
}

/**
 * 容器视图 - 演示事件冒泡
 */
export class ContainerView extends ViewGroup {
  constructor(private name: string = 'Container') {
    super();
    this.width = 400;
    this.height = 300;
  }
  
  public onClick(event: MouseEvent): void {
    console.log(`${this.name} container clicked (${EventPhase[event.eventPhase]})`);
  }
  
  public onHover(event: MouseEvent): void {
    console.log(`${this.name} container hovered (${EventPhase[event.eventPhase]})`);
  }
  
  public onHoverLost(event: MouseEvent): void {
    console.log(`${this.name} container hover lost (${EventPhase[event.eventPhase]})`);
  }
  
  public onMouseDown(event: MouseEvent): void {
    console.log(`${this.name} container mouse down (${EventPhase[event.eventPhase]})`);
  }
  
  public onMouseUp(event: MouseEvent): void {
    console.log(`${this.name} container mouse up (${EventPhase[event.eventPhase]})`);
  }
}

/**
 * 拖拽示例视图
 */
export class DraggableView extends View {
  private dragStartPosition = { x: 0, y: 0 };
  
  constructor() {
    super();
    this.width = 100;
    this.height = 100;
  }
  
  public onMouseDown(event: MouseEvent): void {
    console.log('Draggable view mouse down');
    this.dragStartPosition = { x: event.x, y: event.y };
  }
  
  public onDrag(event: MouseEvent): void {
    const deltaX = event.x - this.dragStartPosition.x;
    const deltaY = event.y - this.dragStartPosition.y;
    
    // 更新视图位置
    this.position = [this.position[0] + deltaX, this.position[1] + deltaY];
    
    // 更新拖拽开始位置
    this.dragStartPosition = { x: event.x, y: event.y };
    
    console.log('Dragging view', { deltaX, deltaY });
  }
  
  public onDragLost(event: MouseEvent): void {
    console.log('Drag ended');
  }
}

/**
 * 鼠标事件系统使用示例
 */
export class MouseEventSystemExample {
  private integrator = MouseEventIntegrator.getInstance();
  private rootView = new ViewGroup();
  
  /**
   * 初始化示例
   */
  public initialize(): void {
    // 设置根视图
    this.integrator.setRootView(this.rootView);
    
    // 初始化集成器
    this.integrator.initialize();
    
    // 创建示例视图
    this.createExampleViews();
    
    console.log('Mouse event system example initialized');
  }
  
  /**
   * 创建示例视图
   */
  private createExampleViews(): void {
    // 创建按钮视图
    const button1 = new ExampleButtonView();
    button1.position = [100, 100];
    this.rootView.addView(button1);
    
    const button2 = new ExampleButtonView();
    button2.position = [100, 200];
    this.rootView.addView(button2);
    
    // 创建可拖拽视图
    const draggable = new DraggableView();
    draggable.position = [400, 100];
    this.rootView.addView(draggable);
    
    console.log('Created example views:', {
      button1: { position: button1.position, size: button1.size },
      button2: { position: button2.position, size: button2.size },
      draggable: { position: draggable.position, size: draggable.size }
    });
  }
  
  /**
   * 获取调试信息
   */
  public getDebugInfo(): any {
    return this.integrator.getDebugInfo();
  }
  
  /**
   * 重置系统
   */
  public reset(): void {
    this.integrator.reset();
  }
}

// 导出单例实例
export const mouseEventExample = new MouseEventSystemExample();
