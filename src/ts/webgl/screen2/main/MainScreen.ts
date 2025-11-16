import { playSound, Sound } from "../../../player/SoundEffect";
import { easeInCirc, easeInQuad, easeInSine, easeOutCirc, easeOutCubic, easeOutExpo, easeOutQuint, easeOutSine } from "../../../util/Easing";
import { color } from "../../base/Color";
import { anchor } from "../../drawable/Anchor";
import { vector2 } from "../../graphic/matrix/vec2";
import { inject } from "../../util/InstanceInject";
import { Screen } from "../../util/Screen";
import { SizeMode } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";
import { BackgroundScreen } from "../background/BackgroundScreen";
import { BeatLogoBox } from "./BeatLogoBox";
import { Menu } from "./Menu";
import { SideFlashlight } from "./SideFlashlight";
import { TopBar } from "./TopBar";


export class MainScreen extends Screen {

  // private topBar: TopBar
  private menu: Menu
  private logo: BeatLogoBox
  private sideLight: SideFlashlight

  constructor() {
    super();
    this.scale = vector2.create()
    this.alpha = 0
    this.origin = anchor.Center
    // const topBar = new TopBar()
    // {
    //   topBar.size = vector2.fromValues(SizeMode.FILL_WIDTH, 36)
    //   this.topBar = topBar
    // }
    const menu = new Menu()
    {
      menu.origin = anchor.Center
      menu.anchor = anchor.Center
      menu.size = vector2.fromValues(SizeMode.FILL_WIDTH, 80)
      this.menu = menu
    }
    const logo = new BeatLogoBox(vector2.fromValues(400, 400))
    {
      logo.anchor = anchor.Center
      let isShowMenu = true, menuTimeoutId: any
      logo.onClickListener.add(ev => {
        const menu = inject(Menu)
        const topBar = inject(TopBar)
        const background = inject(BackgroundScreen)
        const transition = logo.clearTransform()
        if (isShowMenu) {
          playSound(Sound.OsuLogoSelect)
          transition.moveTo(vector2.fromValues(-200, 0), 500, easeOutExpo)
            .scaleTo(vector2.fromValues(0.6, 0.6), 500, easeOutExpo)
          menuTimeoutId = setTimeout(() => {
            menu.open()
          }, 100)

          background.clearTransform()
            .delay(100).scaleTo(vector2.fromValues(0.996, 0.996), 500, easeOutQuint)
            .delay(100).moveTo(vector2.fromValues(0, 35), 500, easeOutQuint)
            .delay(100).fadeTo(0.8, 500, easeOutQuint)

          topBar.clearTransform()
            .delay(100)
            .moveYTo(0, 500, easeOutQuint)
        } else {
          transition.delay(100).moveTo(vector2.create(), 1000, easeOutQuint)
            .delay(100).scaleTo(vector2.fromValues(1, 1), 1000, easeOutQuint)
          clearTimeout(menuTimeoutId)
          menu.close()

          background.clearTransform()
            .delay(100).scaleTo(vector2.fromValues(1, 1), 500, easeOutQuint)
            .delay(100).moveTo(vector2.create(), 500, easeOutQuint)
            .delay(100).fadeTo(1, 500, easeOutQuint)

          topBar.clearTransform()
            .delay(100).moveYTo(-36, 500, easeOutQuint)
        }
        isShowMenu = !isShowMenu
      })
      logo.onLogoHoverListener.add(ev => {
        const menu = inject(Menu)
        menu.logoHover()
      })
      logo.onLogoHoverLostListener.add(ev => {
        const menu = inject(Menu)
        menu.logoHoverLost()
      })
      this.logo = logo
    }
    const sideLight = new SideFlashlight(color.fromHex(0x0090ff), SizeMode.percentValue(0.1))
    {
      sideLight.anchor = anchor.TopLeft
      sideLight.size = SizeMode.fill()
      this.sideLight = sideLight
    }
    this.addViews([sideLight, menu, logo])
  }

  public onEntering(): void {
    super.onEntering()
    console.log("MainScreen onEntering")

    this.clearTransform()
      .delay(1000).scaleTo(vector2.fromValues(1, 1), 1000, easeOutQuint)
      .delay(1000).fadeTo(1, 1000, easeOutQuint)
  }

  public onExiting(): void {
    super.onExiting()
    console.log("MainScreen onExiting")
  }

  public onResuming(): void {
    super.onResuming()
    this.sideLight.clearTransform()
      .delay(300)
      .fadeTo(1, 60, easeOutSine)
    this.clearTransform()
      .fadeTo(1, 300, easeOutSine)
      .moveXTo(0, 300, easeOutSine)
      .scaleTo(vector2.fromValues(1, 1), 300, easeOutSine)
  }

  public onSuspending(): void {
    super.onSuspending()
    this.sideLight.alpha = 0
    this.clearTransform()
      .fadeTo(0, 300, easeOutQuint)
      .moveXTo(-1280, 300, easeInSine)
      .scaleTo(vector2.fromValues(0.6, 0.6), 300, easeOutQuint)
  }

}