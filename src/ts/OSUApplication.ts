import { ApplicationLoader } from "./ApplicationLoader";
import BeatBooster from "./global/BeatBooster";
import { BeatState } from "./global/Beater";
import { MOUSE_KEY_LEFT, MOUSE_KEY_NONE, MOUSE_KEY_RIGHT, MouseState } from "./global/MouseState";
import { Time } from "./global/Time";
import AudioChannel from "./player/AudioChannel";
import AudioPlayer from "./player/AudioPlayer";
import OSUPlayer from "./player/OSUPlayer";
import { easeOut, easeOutQuint } from "./util/Easing";
import { nullable } from "./Utils";
import { color } from "./webgl/base/Color";
import { Coordinate2 } from "./webgl/base/Coordinate2";
import { anchor } from "./webgl/drawable/Anchor";
import { MouseEventIntegrator } from "./webgl/event/MouseEventIntegrator";
import { almostEquals } from "./webgl/graphic/core/Utils";
import { vector2 } from "./webgl/graphic/matrix/vec2";
import { TextureStore } from "./webgl/graphic/texture/TextureStore";
import { Row } from "./webgl/layout/Row";
import { BackgroundScreen } from "./webgl/screen2/background/BackgroundScreen";
import { LogoBounceBox } from "./webgl/screen2/main/BeatLogoBox";
import { MainScreen } from "./webgl/screen2/main/MainScreen";
import { OverlayScreen } from "./webgl/screen2/overlay/OverlayScreen";
import { BackButton, SlashBackground } from "./webgl/screen2/songPlay/BackButton";
import { FadeLogo } from "./webgl/screen2/songPlay/FadeLogo";
import { PerformanceStatistics } from "./webgl/util/PerformanceStatistics";
import { ScreenLayer, ScreenManager } from "./webgl/util/ScreenManager";
import { ImageView } from "./webgl/view/ImageView";
import { TextView } from "./webgl/view/TextView";
import { SizeMode } from "./webgl/view/View";
import { ViewGroup } from "./webgl/view/ViewGroup";
import { WebGLRenderer } from "./webgl/WebGLRenderer";


export class OSUApplication {

  public static webgl = nullable<WebGL2RenderingContext>()

  public static renderer = nullable<WebGLRenderer>()
  public static canvas: HTMLCanvasElement
  public static screenManager: ScreenManager

  public static async setup(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      premultipliedAlpha: false,
      stencil: true
    })
    if (!gl) {
      throw new Error("setup webgl2 context failed!")
    }
    window.addEventListener('resize', () => {
      this.resizeCanvas()
    })
    this.webgl = gl
    await this.load(gl)
  }

  private static resizeCanvas() {
    const canvas = this.canvas
    const realPixelWidth = canvas.clientWidth * window.devicePixelRatio
    const realPixelHeight = canvas.clientHeight * window.devicePixelRatio
    canvas.width = realPixelWidth
    canvas.height = realPixelHeight
    Coordinate2.setViewportByCanvas(canvas.clientWidth, canvas.clientHeight)
  }

  private static async load(gl: WebGL2RenderingContext) {
    this.resizeCanvas()
    ApplicationLoader.init(gl)
    await ApplicationLoader.loadImages()
    await ApplicationLoader.loadSounds()
    const renderer = await ApplicationLoader.loadWebGL(gl)
    this.renderer = renderer
    this.screenManager = new ScreenManager(renderer.root)

    this.renderBackground(this.renderer)

    this.screenManager.push(MainScreen)
    this.screenManager.push(OverlayScreen, ScreenLayer.Foreground)

    renderer.updateViewport()
    this.setupMouseEvent()
    const integrator = MouseEventIntegrator.getInstance()
    integrator.setRootView(renderer.root)
    integrator.initialize()
  }

  public static renderTextView(renderer: WebGLRenderer) {
    const root = renderer.root
    const text = new TextView()
    {
      text.text = "Jumping Beat`abcdefghijklmn`"
      text.size = vector2.fromValues(500, 300)
      text.color = color.White
      text.textSize = 64
      text.textAlignment = "right"
    }
    root.addView(text)
  }

  private static renderBackground(renderer: WebGLRenderer) {
    const root = renderer.root
    const background = new BackgroundScreen()
    {
      background.size = SizeMode.fill()
    }
    root.backgroundView = background
  }

  private static prevTimestamp = -1
  public static render = (timestamp: number = 0) => {
    if (this.isDisposing) {
      return;
    }
    requestAnimationFrame(this.render)
    if (this.prevTimestamp < 0) {
      this.prevTimestamp = timestamp
    }
    const elapsed = timestamp - this.prevTimestamp
    this.prevTimestamp = timestamp
    if (almostEquals(elapsed, 0)) {
      return
    }
    OSUPlayer.update()
    const time = AudioPlayer.currentTime()

    Time.currentTime = timestamp
    Time.elapsed = elapsed

    AudioChannel.update(time)

    BeatState.isKiai = BeatBooster.isKiai(time)
    BeatState.beatIndex = BeatBooster.getCurrentBeatCount() + 1
    BeatState.currentBeat = BeatBooster.updateBeat(time, easeOut, easeOutQuint)
    BeatState.isAvailable = BeatBooster.isAvailable

    if (!this.renderer) {
      return
    }
    PerformanceStatistics.beginFrame()
    this.renderer.clear()
    this.renderer.renderView()
    PerformanceStatistics.endFrame()
  }

  private static mousePosition = vector2.create()

  private static mouseListener = {
    mousedown: (e: MouseEvent) => {
      const mousePosition = this.mousePosition
      vector2.set(mousePosition, e.x, e.y)
      this.handleMousePosition(mousePosition)
      let which: number = MOUSE_KEY_NONE
      if (e.button === 0)
        which = MOUSE_KEY_LEFT
      if (e.button === 2)
        which = MOUSE_KEY_RIGHT
      if (which !== MOUSE_KEY_NONE)
        MouseState.receiveMouseDown(which, mousePosition[0], mousePosition[1])
    },
    mouseup: (e: MouseEvent) => {
      const mousePosition = this.mousePosition
      vector2.set(mousePosition, e.x, e.y)
      this.handleMousePosition(mousePosition)
      let which: number = MOUSE_KEY_NONE
      if (e.button === 0)
        which = MOUSE_KEY_LEFT
      if (e.button === 2)
        which = MOUSE_KEY_RIGHT
      if (which !== MOUSE_KEY_NONE)
        MouseState.receiveMouseUp(which, mousePosition[0], mousePosition[1])
    },
    mousemove: (e: MouseEvent) => {
      const mousePosition = this.mousePosition
      vector2.set(mousePosition, e.x, e.y)
      this.handleMousePosition(mousePosition)
      MouseState.receiveMouseMove(mousePosition[0], mousePosition[1])
    }
  }

  private static handleMousePosition(position: vec2) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const width = Coordinate2.width
    const height = Coordinate2.height
    const scaleX = width / windowWidth
    const scaleY = height / windowHeight
    position[0] *= scaleX
    position[1] *= scaleY
  }

  private static setupMouseEvent() {
    const canvas = this.canvas
    canvas.addEventListener('mousedown', this.mouseListener.mousedown)
    canvas.addEventListener('mousemove', this.mouseListener.mousemove)
    canvas.addEventListener('mouseup', this.mouseListener.mouseup)
  }

  private static isDisposing = false
  public static dispose() {
    const canvas = this.canvas
    canvas.removeEventListener('mousedown', this.mouseListener.mousedown)
    canvas.removeEventListener('mousemove', this.mouseListener.mousemove)
    canvas.removeEventListener('mouseup', this.mouseListener.mouseup)
    this.renderer?.dispose()
    console.warn("OSUApplication dispose() method is not complete")
  }

}