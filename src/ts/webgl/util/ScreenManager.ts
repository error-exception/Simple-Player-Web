import type { Nullable } from "../../type";
import { createMutableStateFlow, MutableStateFlow } from "../../util/flow";
import { anchor } from "../drawable/Anchor";
import { Disposable } from "../graphic/core/Disposable";
import { ScreenStack } from "../layout/ScreenStack";
import type { RootView } from "../view/RootView";
import { SizeMode } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";
import { Screen } from "./Screen";

export enum ScreenLayer {
  Background = 0,
  Content = 1,
  Foreground = 2,
  Overlay = 3,
}

export type ScreenConstructor = new (...args: any[]) => Screen

const screenCache = new Map<ScreenConstructor, Screen>();

export class ScreenStackInfo implements Disposable {

  public readonly stack: Screen[] = []
  public readonly screen = new ScreenStack()

  constructor() {
    this.screen.size = SizeMode.fill()
    this.screen.anchor = anchor.Center
  }

  public get current(): Nullable<Screen> {
    return this.stack[this.stack.length - 1] || null
  }

  public push(screenConstructor: ScreenConstructor) {
    
    if (this.stack.length > 0 && this.current?.constructor === screenConstructor) {
      console.debug("ScreenManager: push same screen, ignore")
      return;
    }

    let screen: Screen
    if (screenCache.has(screenConstructor)) {
      screen = screenCache.get(screenConstructor)!;
    } else {
      screen = new screenConstructor();
      if (screen.shouldCache) screenCache.set(screenConstructor, screen);
    }

    if (this.stack.length > 0) {
      this.current?.onSuspending()
    }
    this.screen.addIfAbsent(screen.view)
    this.stack.push(screen);
    screen.onEntering();
  }

  public pop() {
    const screen = this.stack.pop();
    if (screen) {
      screen.onExiting();
      // this.viewStack.removeView(screen.view)
      // RenderScheduler.scheduleDispose(screen)
    }
    if (this.stack.length > 0) {
      this.current?.onResuming()
    }
  }

  public dispose() {
    this.stack.forEach(item => {
      item.dispose()
    })
    this.stack.length = 0
  }
}

export class ScreenManager implements Disposable {

  private screenLayers: ScreenStackInfo[] = []

  constructor(rootView: RootView) {

    this.screenLayers[ScreenLayer.Background] = new ScreenStackInfo();
    this.screenLayers[ScreenLayer.Content] = new ScreenStackInfo();
    this.screenLayers[ScreenLayer.Foreground] = new ScreenStackInfo();
    this.screenLayers[ScreenLayer.Overlay] = new ScreenStackInfo();

    const screenGroup = new ViewGroup();
    {
      screenGroup.size = SizeMode.fill()
      screenGroup.anchor = anchor.TopLeft
      screenGroup.addViews(this.screenLayers.map(info => info.screen))
    }
    rootView.contentView = screenGroup;
  }

  public push(screenConstructor: ScreenConstructor, layer: number = ScreenLayer.Content) {
    this.screenLayers[layer].push(screenConstructor);
  }

  public pop(layer: number = ScreenLayer.Content) {
    this.screenLayers[layer].pop();
  }

  public dispose(): void {
    for (const layer of this.screenLayers) {
      layer.dispose();
    }
    this.screenLayers.length = 0;
  }
}