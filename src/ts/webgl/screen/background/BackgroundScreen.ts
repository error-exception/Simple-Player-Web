import {Box} from "../../box/Box";
import {BackgroundBounce} from "../main/MovableBackground";
import {VideoBackground} from "../songPlay/VideoBackground";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import BackgroundLoader from "../../../global/BackgroundLoader";
import {MouseState} from "../../../global/MouseState";
import ScreenManager from "../../util/ScreenManager";
import {Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {UIState} from "../../../global/UISettings";
import {effectScope, watch} from "vue";
import {collectLatest} from "../../../util/eventRef";

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
    this.background.updateBackground2(bg.image && UIState.beatmapBackground ? bg.image : BackgroundLoader.getBackground())
  }

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    this.background = new BackgroundBounce(gl, OSUPlayer.background.value.image)
    this.videoBackground = new VideoBackground(gl, null)
    // OSUPlayer.background.collect(this.collector)
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
        watch(() => UIState.beatmapBackground, value => {
          if (!value) {
            this.videoBackground.isVisible = false
            this.background.updateBackground2(BackgroundLoader.getBackground())
          } else {
            const bg = OSUPlayer.background.value
            if (bg.video && !['main', 'legacy'].includes(ScreenManager.currentId.value)) {
              this.videoBackground.isVisible = true
              this.videoBackground.setVideo(bg.video)
            }
            this.background.updateBackground2(bg.image ?? BackgroundLoader.getBackground())
          }
        })

      })
      return scope.stop
    })
  }

  protected onUpdate() {
    super.onUpdate();
    this.background.background.translate = MouseState.position.copy()
  }

  public dispose() {
    super.dispose();
    // OSUPlayer.background.removeCollect(this.collector)
    onLeftSide.removeCollect(this.leftSideCollector)
    onRightSide.removeCollect(this.rightSideCollector)
  }

}