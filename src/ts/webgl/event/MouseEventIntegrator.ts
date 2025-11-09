import { MouseState } from "../../global/MouseState";
import { ViewMouseEventSystem } from "./ViewMouseEventSystem";

/**
 * 鼠标事件集成器
 * 
 * 负责将全局鼠标状态与新的视图鼠标事件系统连接起来
 */
export class MouseEventIntegrator {
  private static instance: MouseEventIntegrator;
  private eventSystem = ViewMouseEventSystem.getInstance();
  
  public static getInstance(): MouseEventIntegrator {
    if (!this.instance) {
      this.instance = new MouseEventIntegrator();
    }
    return this.instance;
  }
  
  /**
   * 初始化鼠标事件集成
   */
  public initialize(): void {
    // 连接到全局鼠标状态
    this.setupMouseStateHandlers();
  }
  
  /**
   * 设置根视图
   */
  public setRootView(rootView: any): void {
    this.eventSystem.setRootView(rootView);
  }
  
  /**
   * 设置全局鼠标状态处理器
   */
  private setupMouseStateHandlers(): void {
    // 保存原有的处理器
    const originalOnMouseDown = MouseState.onMouseDown;
    const originalOnMouseUp = MouseState.onMouseUp;
    const originalOnMouseMove = MouseState.onMouseMove;
    
    // 设置新的处理器
    MouseState.onMouseDown = (which: number) => {
      // 调用原有的处理器
      originalOnMouseDown?.(which);
      
      // 调用新的事件系统
      const position = MouseState.position;
      this.eventSystem.handleMouseDown(position[0], position[1], which);
    };
    
    MouseState.onMouseUp = (which: number) => {
      // 调用原有的处理器
      originalOnMouseUp?.(which);
      
      // 调用新的事件系统
      const position = MouseState.position;
      this.eventSystem.handleMouseUp(position[0], position[1], which);
    };
    
    MouseState.onMouseMove = () => {
      // 调用原有的处理器
      originalOnMouseMove?.();
      
      // 调用新的事件系统
      const position = MouseState.position;
      this.eventSystem.handleMouseMove(position[0], position[1]);
    };
  }
  
}
