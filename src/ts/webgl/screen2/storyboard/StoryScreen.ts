import { effectScope, watch } from "vue";
import { isAnimation } from "../../../osu/OSUFile";
import type { OSZ } from "../../../osu/OSZ";
import { OSUApplication } from "../../../OSUApplication";
import OSUPlayer from "../../../player/OSUPlayer";
import type { Nullable } from "../../../type";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import { TransformUtils } from "../../graphic/core/TransformUtils";
import { RenderScheduler } from "../../RenderScheduler";
import { Screen } from "../../util/Screen";
import { SizeMode, View } from "../../view/View";
import { StoryAnimation } from "./Animation2";
import { StorySprite } from "./Sprite2";
import { StoryboardLayer } from "./StoryboardLayer";
import { StoryTextureStore } from "./StoryTextureManager";
import { inject } from "../../util/InstanceInject";
import { BackgroundScreen } from "../background/BackgroundScreen";

export class StoryboardView extends View {

  private orth: Float32Array = new Float32Array(16)
  private storyboardLayer: Nullable<StoryboardLayer> = null
  private storyTextureStore: Nullable<StoryTextureStore> = null

  public onLoad(): void {
    super.onLoad()
    this.updateOrth()
  }

  public loadStoryboard(osz: OSZ) {
    const sprites = [...osz.osbFile.sprites]
    sprites.push(
      ...(OSUPlayer.currentOSUFile.value.Events?.storyboard?.sprites ?? [])
    )
    if (sprites.length === 0) {
      console.warn("No sprites found in storyboard")
      return
    }
    // dispose old textures
    if (this.storyTextureStore !== null) {
      RenderScheduler.scheduleDispose(this.storyTextureStore)
    }
    this.storyTextureStore = new StoryTextureStore()

    const layers = new StoryboardLayer()
    if (this.storyboardLayer !== null) {
      RenderScheduler.scheduleDispose(this.storyboardLayer)
    }

    for (let i = 0; i < sprites.length; i++) {
      try {
        const osbSprite = sprites[i]
        let sprite: StorySprite
        if (isAnimation(osbSprite)) {
          sprite = new StoryAnimation(osbSprite, osz, this.storyTextureStore)
        } else {
          sprite = new StorySprite(osbSprite, osz, this.storyTextureStore)
        }
        layers.addSprite(sprite, sprite.layer)
      } catch (e: any) {
        console.log(e)
      }
    }
    this.storyboardLayer = layers
  }

  private updateOrth() {
    const scale = (480 / this.height)
    const scaledWidth = this.width * scale
    const s = scaledWidth - 640
    this.orth = TransformUtils.orth(
      -s / 2, 640 + s / 2, 480, 0, 0, 1
    )
  }

  public onWindowResize(): void {
    super.onWindowResize()
    this.updateOrth()
    this.storyboardLayer?.onResize()
  }

  public onUpdate(): void {
    super.onUpdate()
    this.storyboardLayer?.update()
  }

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    const renderer = OSUApplication.renderer
    if (!renderer) {
      return
    }
    
    renderer.pushOrth(this.orth)
    this.storyboardLayer?.draw(canvas)
    renderer.popOrth()
  }

  protected onDispose(): void {
    super.onDispose()
    this.storyboardLayer?.dispose()
    this.storyTextureStore?.dispose()
  }

}

export class StoryScreen extends Screen {

  private storyboardView: StoryboardView
  private effectScope = effectScope()

  constructor() {
    super()

    const storyboardView = new StoryboardView()
    {
      storyboardView.size = SizeMode.fill()
      storyboardView.anchor = anchor.Center
      this.storyboardView = storyboardView
    }
    this.addView(storyboardView)
    this.shouldCache = false

    window.addEventListener("keydown", this.closeSelf)

    this.effectScope.run(() => {
      watch(OSUPlayer.currentOSZFile, osz => {
        console.log("osz changed", osz)
        this.storyboardView.loadStoryboard(osz)
      }, { immediate: true })
    })
  }

  private closeSelf = (ev: KeyboardEvent) => {
    if (ev.code === "Escape") {
      this.close()
    }

  }

  public onEntering(): void {
    super.onEntering()
    inject(BackgroundScreen).hide()
  }

  public onExiting(): void {
    super.onExiting()
    window.removeEventListener("keydown", this.closeSelf)
    inject(BackgroundScreen).show()
  }

  public dispose(): void {
    super.dispose()
    this.effectScope.stop()
  }
}