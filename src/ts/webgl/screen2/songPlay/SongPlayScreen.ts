import { OSUApplication } from "../../../OSUApplication";
import { easeOutQuint } from "../../../util/Easing";
import { color } from "../../base/Color";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { Row } from "../../layout/Row";
import { inject } from "../../util/InstanceInject";
import { Screen } from "../../util/Screen";
import { ImageView } from "../../view/ImageView";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";
import { BackgroundScreen } from "../background/BackgroundScreen";
import { LogoBounceBox } from "../main/BeatLogoBox";
import { BackButton } from "./BackButton";
import { FadeLogo } from "./FadeLogo";

export class SongPlayScreen extends Screen {

  private readonly backButton: BackButton
  private readonly logoContainer: ViewGroup
  private readonly fadeLogo: FadeLogo
  private readonly bottomBar: ViewGroup


  constructor() {
    super();
    const fadeLogo = new FadeLogo()
    {
      fadeLogo.size = vector2.fromValues(180, 180)
      fadeLogo.anchor = anchor.Center
      fadeLogo.origin = anchor.Center
      fadeLogo.scale = vector2.create()
      this.fadeLogo = fadeLogo
    }
    const backButton = new BackButton()
    {
      backButton.onClick = function (ev: MouseEvent) {
        OSUApplication.screenManager.pop()
      }
      backButton.translateX = -120
      this.backButton = backButton
    }
    const logoContainer = new ViewGroup()
    {
      logoContainer.size = vector2.fromValues(200, 200)
      logoContainer.anchor = anchor.BottomRight
      logoContainer.translate = vector2.fromValues(32, 68)
      logoContainer.scale = vector2.create()
      const logo = new LogoBounceBox(vector2.fromValues(200, 200))
      {
        logo.anchor = anchor.Center
      }
      this.logoContainer = logoContainer

      logoContainer.addView(logo)
    }
    const bottomBar = new ViewGroup()
    {
      bottomBar.size = vector2.fromValues(SizeMode.FILL_WIDTH, 48)
      bottomBar.anchor = anchor.BottomLeft
      bottomBar.translateY = 48
      const bottomBarBackground = new ImageView()
      {
        bottomBarBackground.size = SizeMode.fill()
        bottomBarBackground.color = color.fromHex(0x222222)
        bottomBarBackground.alpha = 0.8
        bottomBarBackground.objectFit = 'fill'
        bottomBarBackground.texture = TextureStore.getTexture("Square")
      }
      const widgetRow = new Row()
      {
        widgetRow.size = SizeMode.fill()

      }
      this.bottomBar = bottomBar
      bottomBar.addViews([bottomBarBackground])
    }
    this.view.size = SizeMode.fill()
    this.view.addViews([fadeLogo, bottomBar, backButton, logoContainer])
  }

  public onEntering(): void {
    super.onEntering()
    const one = vector2.fromValues(1, 1)
    this.fadeLogo.transform()
      .scaleTo(one, 500, easeOutQuint)
    this.backButton.transform()
      .moveXTo(0, 500, easeOutQuint)
    this.bottomBar.transform()
      .moveYTo(0, 500, easeOutQuint)
    this.logoContainer.transform()
      .scaleTo(one, 500, easeOutQuint)
    // restore background transform
    const background = inject(BackgroundScreen)
    background.transform()
      .scaleTo(one, 500, easeOutQuint)
      .fadeTo(1, 500, easeOutQuint)
      .moveTo(vector2.create(), 500, easeOutQuint)
    this.view.transform()
      .fadeTo(1, 300, easeOutQuint)
  }

  public onExiting(): void {
    super.onExiting()
    const zero = vector2.create()
    this.fadeLogo.transform()
      .scaleTo(zero, 300, easeOutQuint)
    this.backButton.transform()
      .moveXTo(-120, 300, easeOutQuint)
    this.bottomBar.transform()
      .moveYTo(48, 300, easeOutQuint)
    this.logoContainer.transform()
      .scaleTo(zero, 300, easeOutQuint)
    this.view.transform()
      .fadeTo(0, 300, easeOutQuint)
    // revert background transform
    const background = inject(BackgroundScreen)
    background.transform()
      .scaleTo(vector2.fromValues(0.996, 0.996), 500, easeOutQuint)
      .moveTo(vector2.fromValues(0, 35), 500, easeOutQuint)
      .fadeTo(0.8, 500, easeOutQuint)
  }

  public onResuming(): void {
    super.onResuming()
    console.log("SongPlayScreen onResuming")
  }

  public onSuspending(): void {
    super.onSuspending()
    console.log("SongPlayScreen onSuspending")
  }

}