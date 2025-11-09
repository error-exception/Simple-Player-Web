import { BeatDispatcher, type IBeat } from "../../../global/Beater";
import { VueUI } from "../../../global/GlobalState";
import { OSUPanelStack } from "../../../osu/OSUPanelStack";
import { OSUApplication } from "../../../OSUApplication";
import { playSound, Sound } from "../../../player/SoundEffect";
import { easeOutCubic, easeOutElastic, easeOutQuint } from '../../../util/Easing';
import { SingleEvent } from "../../../util/SingleEvent";
import { color, type Color4 } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { quad } from "../../graphic/shape/Quad";
import type { IconAtlas } from "../../graphic/texture/IconAtlas";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { Row } from "../../layout/Row";
import { ImageView } from "../../view/ImageView";
import { TextView } from "../../view/TextView";
import { SizeMode, View } from "../../view/View";
import { ViewGroup } from "../../view/ViewGroup";
import { SongPlayScreen } from "../songPlay/SongPlayScreen";
import { StoryScreen } from "../storyboard/StoryScreen";

export class Menu extends ViewGroup {
  private background: ImageView
  private leftButtonGroup: Row
  private rightButtonGroup: Row
  private leftWidthList: number[] = []
  private rightWidthList: number[] = []

  constructor() {
    super()
    const background = new ImageView()
    {
      background.texture = TextureStore.getTexture("Square")
      background.size = SizeMode.fill()
      background.origin = anchor.Center
      background.anchor = anchor.Center
      background.color = color.fromHex(0x323232)
      background.objectFit = 'fill'
    }
    const row = new Row()
    {
      row.size = SizeMode.fill()
      {
        const leftGroup = new Row()
        this.leftButtonGroup = leftGroup
        {
          leftGroup.size = vector2.fromValues(350, SizeMode.FILL_HEIGHT)
          leftGroup.anchor = anchor.CenterLeft
          {
            const settingsIcon = new MenuButton("Icon-Settings", color.fromHex(0x555555), Sound.ButtonSelect, "Settings")
            {
              settingsIcon.size = vector2.fromValues(120, SizeMode.FILL_HEIGHT)
              settingsIcon.anchor = anchor.CenterRight
              settingsIcon.origin = anchor.CenterRight
              settingsIcon.onClickListener.add(() => {
                VueUI.settings = true
              })
            }
            leftGroup.addViews([settingsIcon])
          }
        }
        const blank = new View()
        {
          blank.size = vector2.fromValues(400, SizeMode.FILL_HEIGHT)
        }

        const rightGroup = new Row()
        this.rightButtonGroup = rightGroup
        {
          rightGroup.size = vector2.fromValues(750, SizeMode.FILL_HEIGHT)
          rightGroup.anchor = anchor.CenterRight
          {
            const playingIcon = new MenuButton("Icon-PlayArrow", color.fromHex(0x6644cc), Sound.DefaultSelect, "Play")
            {
              playingIcon.size = vector2.fromValues(140, SizeMode.FILL_HEIGHT)
              playingIcon.origin = anchor.CenterLeft
              playingIcon.anchor = anchor.CenterLeft
              playingIcon.onClickListener.add(ev => {
                OSUApplication.screenManager.push(SongPlayScreen)
              })
            }
            const storyboardIcon = new MenuButton("Icon-RadioButtonUnchecked", color.fromHex(0xff9000), Sound.DefaultSelect, "Storyboard")
            {
              storyboardIcon.size = vector2.fromValues(120, SizeMode.FILL_HEIGHT)
              storyboardIcon.origin = anchor.CenterLeft
              storyboardIcon.anchor = anchor.CenterLeft
              storyboardIcon.onClickListener.add(() => {
                OSUApplication.screenManager.push(StoryScreen)
              })
            }
            const legacyMain = new MenuButton("Icon-OpenInBrowser", color.fromHex(0x0090ff), Sound.DefaultSelect, "Browse")
            {
              legacyMain.size = vector2.fromValues(120, SizeMode.FILL_HEIGHT)
              legacyMain.origin = anchor.CenterLeft
              legacyMain.anchor = anchor.CenterLeft
              legacyMain.onClickListener.add(() => {
                OSUPanelStack.push({ name: 'beatmapList' })
              })
            }
            const close = new MenuButton("Icon-Close", color.fromHex(0xff00ff), Sound.DefaultSelect, "Exit")
            {
              close.size = vector2.fromValues(120, SizeMode.FILL_HEIGHT)
              close.origin = anchor.CenterLeft
              close.anchor = anchor.CenterLeft
            }
            rightGroup.addViews([playingIcon, storyboardIcon, legacyMain, close])
          }
        }
        row.addViews([leftGroup, blank, rightGroup])
      }
    }
    this.background = background
    this.addViews([background, row])
    // default hide    
    this.background.scaleY = 0.3
    this.background.alpha = 0

    this.leftButtonGroup.alpha = 0
    this.rightButtonGroup.alpha = 0


    // reserve children for row
    const rightGroup = this.rightButtonGroup
    rightGroup.children.reverse()

  }

  public onLoad(): void {
    super.onLoad()
    this.leftWidthList = this.leftButtonGroup.children.map(child => child.width)
    this.rightWidthList = this.rightButtonGroup.children.map(child => child.width)
    this.collapseLeftButtonGroup()
    this.collapseRightButtonGroup()

  }

  public logoHover() {
    this.leftButtonGroup.transform()
      .moveXTo(-10, 500, easeOutElastic)
    this.rightButtonGroup.transform()
      .moveXTo(10, 500, easeOutElastic)
  }

  public logoHoverLost() {
    this.leftButtonGroup.transform()
      .moveXTo(0, 500, easeOutElastic)
    this.rightButtonGroup.transform()
      .moveXTo(0, 500, easeOutElastic)
  }

  private duration = 300

  public open() {
    // 1. overall opacity animation
    // 2. scaleY animation
    this.background.transform()
      .fadeTo(1, this.duration, easeOutQuint)
      .scaleYTo(1, this.duration, easeOutQuint)
    // 3. left and right button group expand animation
    this.expandLeftButtonGroup()
    this.expandRightButtonGroup()
    this.isVisible = true
  }

  public close() {
    this.background.transform()
      .fadeTo(0, this.duration, easeOutQuint)
      .scaleYTo(0.3, this.duration, easeOutQuint)
    this.collapseLeftButtonGroup()
    this.collapseRightButtonGroup()
  }

  private expandRightButtonGroup() {
    const rightGroup = this.rightButtonGroup
    const children = rightGroup.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.isMouseEventEnabled = true
      child.transform()
        .widthTo(this.rightWidthList[i], this.duration, easeOutQuint)
    }
    rightGroup.transform().fadeTo(1, this.duration, easeOutQuint)
  }

  private collapseRightButtonGroup() {
    const rightGroup = this.rightButtonGroup
    const children = rightGroup.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.isMouseEventEnabled = false
      child.transform()
        .widthTo(0, this.duration, easeOutQuint)
    }
    rightGroup.transform().fadeTo(0, this.duration, easeOutQuint)
  }

  private expandLeftButtonGroup() {
    const leftGroup = this.leftButtonGroup
    const children = leftGroup.children

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.isMouseEventEnabled = true
      child.transform()
        .widthTo(this.leftWidthList[i], this.duration, easeOutQuint)
    }
    leftGroup.transform().fadeTo(1, this.duration, easeOutQuint)
  }

  private collapseLeftButtonGroup() {
    const leftGroup = this.leftButtonGroup
    const children = leftGroup.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.isMouseEventEnabled = false
      child.transform()
        .widthTo(0, this.duration, easeOutQuint)
    }
    leftGroup.transform().fadeTo(0, this.duration, easeOutQuint)
  }

}

class MenuButton extends ViewGroup implements IBeat {

  private background: MenuButtonBackground
  private icon: ImageView
  private backgroundPressColor: Color4
  private backgroundActiveColor: Color4

  public onClickListener = new SingleEvent<MouseEvent>()

  constructor(
    icon: IconAtlas,
    private backgroundColor: Color4,
    private sound: AudioBuffer,
    labelText: string = "Menu"
  ) {
    super()
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    const background = new MenuButtonBackground(backgroundColor)
    {
      background.size = SizeMode.fill()
      background.anchor = anchor.Center
      background.origin = anchor.Center
    }
    const iconView = new ImageView()
    {
      iconView.size = vector2.fromValues(28, 28)
      iconView.anchor = anchor.Center
      iconView.origin = anchor.Center
      iconView.textureRegin = atlas.getRegin<IconAtlas>(icon)
    }
    const label = new TextView()
    {
      label.size = vector2.fromValues(SizeMode.FILL_WIDTH, 24)
      label.textAlignment = "center"
      label.color = color.White
      label.text = labelText
      label.textSize = 20
      label.fontStyle = 'normal'
      label.anchor = anchor.BottomCenter
    }
    this.addViews([background, iconView, label])
    this.background = background
    this.icon = iconView
    this.isMouseEventEnabled = true

    this.backgroundPressColor = color.lum(this.backgroundColor, .2)
    this.backgroundActiveColor = color.lum(this.backgroundColor, .4)
    BeatDispatcher.register(this)
  }

  public onLoad(): void {
    super.onLoad()
    this.originWidth = this.width
  }

  public onClick(event: MouseEvent): void {
    this.onClickListener.invoke(event)
  }

  private originWidth = 0
  private isHovered = false

  public onHover(event: MouseEvent): void {
    playSound(Sound.ButtonHover)
    this.transform().widthTo(this.originWidth * 1.4, 500, easeOutElastic)
    this.isHovered = true
  }

  public onHoverLost(event: MouseEvent): void {
    this.transform().widthTo(this.originWidth, 500, easeOutElastic)
    this.isHovered = false
  }

  public onMouseDown(event: MouseEvent): void {
    this.background.transform().colorTo(this.backgroundPressColor, 300)
  }

  public onMouseUp(event: MouseEvent): void {
    this.background.transform()
      .colorTo(this.backgroundActiveColor, 30)
      .colorTo(this.backgroundColor, 400, easeOutQuint)
    playSound(this.sound)
  }

  public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
    if (this.isNotPresent || !this.isHovered) {
      return
    }
    this.icon.transform()
      .scaleTo(vector2.fromValues(0.9, 0.9), 60, easeOutCubic)
      .scaleTo(vector2.fromValues(1, 1), gap * 2, easeOutQuint)
  }

  protected onDispose(): void {
    super.onDispose()
    BeatDispatcher.unregister(this)
    this.onClickListener.removeAll()
  }

}

export class MenuButtonBackground extends View {

  constructor(backgroundColor: Color4) {
    super()
    this.color = backgroundColor
  }

  private q = quad.create()

  public onUpdate(): void {
    super.onUpdate()
    vector2.set(this.q.topLeft, 0, 0)
    vector2.set(this.q.topRight, this.width, 0)
    vector2.set(this.q.bottomLeft, 0, this.height)
    vector2.set(this.q.bottomRight, this.width, this.height)

    this.q.topRight[0] += 20
    this.q.bottomLeft[0] -= 20
  }

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    canvas.drawQuad(this.q)
    // canvas.drawTexture(
    //   TextureStore.getTexture("Square"),
    //   0, 0, this.width, this.height,
    // )
  }

}