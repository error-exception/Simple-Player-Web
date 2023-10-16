import {Box} from "../../box/Box";
import {BackgroundBounce} from "../main/MovableBackground";
import {VideoBackground} from "../songPlay/VideoBackground";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import BackgroundLoader from "../../../global/BackgroundLoader";
import {MouseState} from "../../../global/MouseState";
import ScreenManager from "../../util/ScreenManager";

export class BackgroundScreen extends Box {

  private readonly background: BackgroundBounce
  private readonly videoBackground: VideoBackground

  private collector = (bg: OSUBackground) => {
    this.setupImageBackground(bg)
    this.setupVideoBackground(bg)
  }

  private setupVideoBackground(bg: OSUBackground) {
    if (bg.video)
      this.videoBackground.setVideo(bg.video)
    if (ScreenManager.currentId.value === 'main') {
      return
    }
    this.videoBackground.isVisible = bg.video !== undefined
  }

  private setupImageBackground(bg: OSUBackground) {
    if (bg.video && ScreenManager.currentId.value !== 'main') {
      this.background.isVisible = false
      return
    }
    this.background.isVisible = true
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
      this.videoBackground.isVisible = screenId !== 'main'
      if (screenId !== 'main') {
        this.background.out()
      }
    })
  }

  protected onUpdate() {
    super.onUpdate();
    this.background.background.translate = MouseState.position.copy()
  }

  public dispose() {
    super.dispose();
    OSUPlayer.background.removeCollect(this.collector)
  }

}