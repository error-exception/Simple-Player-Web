import {Box} from "../../box/Box";
import {BackgroundBounce} from "../main/MovableBackground";
import {VideoBackground} from "../songPlay/VideoBackground";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import BackgroundLoader from "../../../global/BackgroundLoader";
import ScreenManager from "../../util/ScreenManager";
import {Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {UIState} from "../../../global/UISettings";
import {effectScope, watch} from "vue";
import {collectLatest} from "../../../util/eventRef";
import BackgroundManager from "../../../global/BackgroundManager";
import {Size} from "../../drawable/Size";

export class BackgroundScreen extends Box {

  private readonly background: BackgroundBounce
  private readonly videoBackground: VideoBackground
  private leftSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  private rightSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  private collector = (bg: OSUBackground) => {
    this.setupVideoBackground(bg)
    this.setupImageBackground(bg)
  }

  private setupVideoBackground(bg: OSUBackground) {
    if (bg.video) {
      !['main', 'legacy'].includes(ScreenManager.currentId.value) && (this.videoBackground.isVisible = true)
      this.videoBackground.setVideo(bg.video)
    } else {
      this.videoBackground.isVisible = false
    }
  }

  private setupImageBackground(bg: OSUBackground) {
    if (bg.image && BackgroundManager.currentLoader.value === BackgroundManager.Beatmap) {
      this.background.updateBackground2(bg.image)
    } else {
      this.background.updateBackground2(BackgroundManager.getBackground())
    }
    // this.background.updateBackground2(bg.image && UIState.beatmapBackground ? bg.image : BackgroundLoader.getBackground())
  }

  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.background = new BackgroundBounce(OSUPlayer.background.value.image)
    this.videoBackground = new VideoBackground(null)
    this.addDisposable(() => {
      return collectLatest(OSUPlayer.background, this.collector)
    })
    this.add(
      this.background,
      this.videoBackground
    )
    ScreenManager.currentId.collect(screenId => {
      this.isVisible = screenId !== "story"
      const bg = OSUPlayer.background.value
      this.videoBackground.isVisible = !!bg.video && (screenId !== 'main' && screenId !== 'legacy' && UIState.beatmapBackground)
      if (screenId !== 'main') {
        this.background.out()
      }
    })
    onLeftSide.collect(this.leftSideCollector)
    onRightSide.collect(this.rightSideCollector)
    this.addDisposable(() => {
      const scope = effectScope()
      scope.run(() => {
        watch(BackgroundManager.currentLoader, value => {
          if (value === BackgroundManager.Default || value === BackgroundManager.Custom) {
            this.videoBackground.isVisible = false
            this.background.updateBackground2(BackgroundManager.getBackground())
          } else if (value === BackgroundManager.Beatmap) {
            const bg = OSUPlayer.background.value
            if (bg.video && !['main', 'legacy'].includes(ScreenManager.currentId.value)) {
              this.videoBackground.isVisible = true
              this.videoBackground.setVideo(bg.video)
            }
            this.background.updateBackground2(bg.image ?? BackgroundLoader.getBackground())
          }
          watch(BackgroundManager.customBackgroundChange, () => {
            this.background.updateBackground2(BackgroundManager.getBackground())
          })
        })
      })
      return scope.stop
    })
  }

  public get isVideoVisible() {
    return this.videoBackground.isVisible
  }

  public dispose() {
    super.dispose();
    // OSUPlayer.background.removeCollect(this.collector)
    onLeftSide.removeCollect(this.leftSideCollector)
    onRightSide.removeCollect(this.rightSideCollector)
  }

}