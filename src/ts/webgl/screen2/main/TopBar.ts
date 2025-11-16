import { VueUI } from "../../../global/GlobalState";
import { OSUPanelStack } from "../../../osu/OSUPanelStack";
import { OSUApplication } from "../../../OSUApplication";
import { playSound, Sound } from "../../../player/SoundEffect";
import { easeOutQuint } from "../../../util/Easing";
import { SingleEvent } from "../../../util/SingleEvent";
import { color } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import type { IconAtlas } from "../../graphic/texture/IconAtlas";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { Row } from "../../layout/Row";
import { ImageView } from "../../view/ImageView";
import { TextView } from "../../view/TextView";
import { SizeMode, View } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";
import { LegacyScreen } from "../legacy/LegacyScreen";

export class TopBar extends ViewGroup {

  private stateTextView: TextView

  constructor() {
    super();
    const topBarBackground = new ImageView()
    {
      topBarBackground.size = SizeMode.fill()
      topBarBackground.texture = TextureStore.getTexture("Square")
      topBarBackground.color = color.fromHex(0x191919)
      topBarBackground.objectFit = 'fill'
    }
    const buttonBox = new Row()
    {
      buttonBox.size = SizeMode.fill()
      buttonBox.anchor = anchor.TopLeft
      const size = vector2.fromValues(36, 36)
      const settingsIcon = new TopBarButton("Icon-Settings", size)
      {
        settingsIcon.anchor = anchor.TopLeft
        settingsIcon.onClickListener.add(() => {
          VueUI.settings = true
        })
      }
      const helpIcon = new TopBarButton("Icon-Help", size)
      {
        helpIcon.anchor = anchor.TopLeft
        helpIcon.onClickListener.add(() => {
          OSUPanelStack.push({ name: 'help' })
        })
      }
      const help2Icon = new TopBarButton("Icon-Help", size)
      {
        help2Icon.anchor = anchor.TopLeft
        help2Icon.onClickListener.add(() => {
          OSUPanelStack.push({ name: 'test' })
        })
      }
      const help3Icon = new TopBarButton("Icon-Help", size)
      {
        help3Icon.anchor = anchor.TopLeft
        help3Icon.onClickListener.add(() => {
          OSUApplication.screenManager.push(LegacyScreen)
        })
      }

      const stateText = new TextView()
      {
        stateText.size = vector2.fromValues(200, 25)
        stateText.anchor = anchor.Center
        stateText.textAlignment = "center"
        stateText.textSize = 30
        stateText.color = color.White
        stateText.text = "Playing"
        this.stateTextView = stateText
      }

      const musicIcon = new TopBarButton("Icon-MusicNote", size)
      {
        musicIcon.anchor = anchor.TopRight
        musicIcon.onClickListener.add(() => {
          VueUI.miniPlayer = true
        })
      }
      const folderIcon = new TopBarButton("Icon-Folder", size)
      {
        folderIcon.anchor = anchor.TopRight
        folderIcon.onClickListener.add(() => {
          OSUPanelStack.push({ name: 'beatmapList' })
        })
      }
      const fullscreenIcon = new TopBarButton("Icon-Fullscreen", size)
      {
        fullscreenIcon.anchor = anchor.TopRight
      }
      const radioIcon = new TopBarButton("Icon-RadioButtonUnchecked", size)
      {
        radioIcon.anchor = anchor.TopRight
        radioIcon.onClickListener.add(() => {
          OSUPanelStack.push({ name: 'beatmapDetails' })
        })
      }
      const notificationIcon = new TopBarButton("Icon-Notifications", size)
      {
        notificationIcon.anchor = anchor.TopRight
        notificationIcon.onClickListener.add(() => {
          VueUI.notification = true
        })
      }
      buttonBox.addViews([
        settingsIcon, helpIcon, help2Icon, help3Icon, stateText, musicIcon, folderIcon, fullscreenIcon, radioIcon, notificationIcon
      ])
    }
    this.addViews([topBarBackground, buttonBox])
  }

  public set stateText(text: string) {
    this.stateTextView.text = text
  }

  public onLoad(): void {
    super.onLoad()
    this.translateY = -this.height
  }
}

class TopBarButton extends ViewGroup {

  private background: RoundedView  
  public onClickListener = new SingleEvent<MouseEvent>()

  constructor(icon: IconAtlas, size: vec2) {
    super();
    const background = new RoundedView()
    {
      background.size = SizeMode.fill()
      background.color = color.White
      background.alpha = 0
      background.cornerRadius = 4
    }
    const iconView = new ImageView()
    {
      iconView.size = vector2.fromValues(20, 20)
      iconView.anchor = anchor.Center
      iconView.textureRegin = TextureStore.getAtlas("Icons-Atlas").getRegin<IconAtlas>(icon)
    }
    this.background = background
    this.addViews([background, iconView])
    // this.size = vector2.fromValues(36, 36)
    // this.anchor = a
    this.isMouseEventEnabled = true
    this.size = size
  }

  public onHover(event: MouseEvent): void {
    this.background.clearTransform().fadeTo(.25, 200)
    playSound(Sound.ButtonHover)
  }

  public onHoverLost(event: MouseEvent): void {
    this.background.clearTransform().fadeTo(0, 200)
  }

  public onMouseDown(event: MouseEvent): void {
    this.background.clearTransform().fadeTo(.4, 40)
  }

  public onMouseUp(event: MouseEvent): void {
    this.background.clearTransform()
      .fadeTo(.8, 45)
      .fadeTo(.25, 400, easeOutQuint)
    playSound(Sound.ButtonSelect)
  }

  public onClick(event: MouseEvent): void {
    this.onClickListener.invoke(event)
  }

  protected onDispose(): void {
    super.onDispose()
    this.onClickListener.removeAll()
  }

}

class RoundedView extends View {

  public cornerRadius = 10

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    canvas.drawRoundRect(0, 0, this.width, this.height, this.cornerRadius)
  }

}