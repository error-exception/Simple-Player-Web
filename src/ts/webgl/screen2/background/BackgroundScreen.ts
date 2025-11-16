import { effectScope } from "@vue/runtime-dom";
import { watch } from 'vue';
import type { OSUBackground } from "../../../player/OSUPlayer";
import OSUPlayer from "../../../player/OSUPlayer";
import { anchor } from "../../drawable/Anchor";
// import ScreenManager from "../../util/ScreenManager";
import { VideoView } from "../../view/VideoView";
import { ViewGroup } from "../../view/ViewGroup";
import { MovableBackground } from "./MovableBackground";
import { SizeMode } from "../../view/View";
import { OSZConfig } from "../../../global/GlobalState";
import { OSUApplication } from "../../../OSUApplication";
import { easeOut } from "../../../util/Easing";
import BackgroundManager from "../../../global/BackgroundManager";
import { StoryboardView } from "../storyboard/StoryScreen";

export class BackgroundScreen extends ViewGroup {
  private readonly movableBackground: MovableBackground
  private readonly videoBackground: VideoView
  private readonly storyboardView: StoryboardView

  private setupVideoBackground(bg: OSUBackground) {
    if (bg.video && OSZConfig.loadVideo) {
      this.videoBackground.video = bg.video
      this.videoBackground.clearTransform().fadeTo(1, 220, easeOut)
      this.movableBackground.clearTransform().fadeTo(0, 220, easeOut)
    } else {
      this.videoBackground.clearTransform().fadeTo(0, 220, easeOut)
      this.movableBackground.clearTransform().fadeTo(1, 220, easeOut)
    }
  }

  private setupImageBackground(bg: OSUBackground) {
    if (bg.image && BackgroundManager.currentLoader.value === BackgroundManager.Beatmap) {
      this.movableBackground.backgroundImage = bg.image
    } else {
      this.movableBackground.backgroundImage = BackgroundManager.getBackground()
    }
  }

  private updateStoryboard() {

  }

  constructor() {
    super()
    const movableBackground = new MovableBackground()
    {
      movableBackground.anchor = anchor.Center
      movableBackground.origin = anchor.Center
      movableBackground.size = SizeMode.fill()
    }
    const videoBackground = new VideoView()
    {
      videoBackground.anchor = anchor.Center
      videoBackground.origin = anchor.Center
      videoBackground.size = SizeMode.fill()
      videoBackground.objectFit = 'contains'
    }
    const storyboardView = new StoryboardView()
    {
      storyboardView.anchor = anchor.Center
      storyboardView.origin = anchor.Center
      storyboardView.size = SizeMode.fill()
    }

    this.movableBackground = movableBackground
    this.videoBackground = videoBackground
    this.storyboardView = storyboardView

    this.addViews([movableBackground, videoBackground, storyboardView])

    this.movableBackground.isVisible = true
    this.videoBackground.isVisible = true

    const scope = effectScope()
    scope.run(() => {
      watch(OSUPlayer.background, background => {
        console.log('background changed', background)
        this.setupImageBackground(background)
        this.setupVideoBackground(background)
      })
      watch(OSUPlayer.currentOSZFile, osz => {
        if (osz.osbFile.sprites.length > 0) {
          this.storyboardView.loadStoryboard(osz)
          this.storyboardView.clearTransform().fadeTo(1, 220, easeOut)
          this.movableBackground.clearTransform().fadeTo(0, 220, easeOut)
          this.videoBackground.clearTransform().fadeTo(0, 220, easeOut)
        } else {
          this.storyboardView.clearTransform().fadeTo(0, 220, easeOut)
          this.movableBackground.clearTransform().fadeTo(1, 220, easeOut)
          this.videoBackground.clearTransform().fadeTo(1, 220, easeOut)
        }
      })
    })
  }

  public setVideoVisible(visible: boolean) {
    this.videoBackground.isVisible = visible
  }

  public hide() {
    this.movableBackground.isVisible = false
    this.videoBackground.isVisible = false
  }

  public show() {
    this.movableBackground.isVisible = true
    this.videoBackground.isVisible = true
  }

}