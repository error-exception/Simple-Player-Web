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

export class BackgroundScreen extends Box {

  private readonly background: BackgroundBounce
  private readonly videoBackground: VideoBackground
  private leftSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(40, 0) : Vector2.newZero()
    this.translateBegin()
      .translateTo(translate, 500, easeOutCubic)
  }

  private rightSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
    this.translateBegin()
      .translateTo(translate, 500, easeOutCubic)
  }

  private collector = (bg: OSUBackground) => {
    this.setupImageBackground(bg)
    this.setupVideoBackground(bg)
  }

  private setupVideoBackground(bg: OSUBackground) {
    if (bg.video)
      this.videoBackground.setVideo(bg.video)
  }

  private setupImageBackground(bg: OSUBackground) {
    this.background.updateBackground2(bg.image ? bg.image : BackgroundLoader.getBackground())
  }

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    this.background = new BackgroundBounce(gl, OSUPlayer.background.value.image)
    this.videoBackground = new VideoBackground(gl, null)
    OSUPlayer.background.collect(this.collector)
    this.add(
      this.background,
      this.videoBackground
    )
    ScreenManager.currentId.collect(screenId => {
      const bg = OSUPlayer.background.value
      this.videoBackground.isVisible = bg.video !== undefined && (screenId !== 'main')
      this.background.isVisible = screenId === 'main' || !bg.video
      if (screenId !== 'main') {
        this.background.out()
      }
    })
    onLeftSide.collect(this.leftSideCollector)
    onRightSide.collect(this.rightSideCollector)
  }

  protected onUpdate() {
    super.onUpdate();
    this.background.background.translate = MouseState.position.copy()
  }

  public dispose() {
    super.dispose();
    OSUPlayer.background.removeCollect(this.collector)
    onLeftSide.removeCollect(this.leftSideCollector)
    onRightSide.removeCollect(this.rightSideCollector)
  }

}