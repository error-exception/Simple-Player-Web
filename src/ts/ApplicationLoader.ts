import BackgroundManager from "./global/BackgroundManager";
import { Resource } from "./global/Resource";
import { Icon } from "./icon/Icon";
import { runTask } from "./notify/OsuNotification";
import { loadSoundEffect } from "./player/SoundEffect";
import { WebGLRenderer } from "./webgl/WebGLRenderer";
import { Buffers } from "./webgl/graphic/buffer/Buffers";
import { vector2 } from "./webgl/graphic/matrix/vec2";
import { Shaders } from "./webgl/graphic/shader/Shaders";
import { loadIconsAtlas } from "./webgl/graphic/texture/IconAtlas";
import { loadAsciiTextAtlas } from "./webgl/graphic/texture/TextAtlas";
import { TextureStore } from "./webgl/graphic/texture/TextureStore";
import { LegacyScreen } from "./webgl/screen/legacy/LegacyScreen";
import { LegacyPlayScreen } from "./webgl/screen/legacyPlay/LegacyPlayScreen";
import { MainScreen } from "./webgl/screen/main/MainScreen";
import { SongPlayScreen } from "./webgl/screen/songPlay/SongPlayScreen";
import { StoryScreen } from "./webgl/screen/story/StoryScreen";
import { StoryScreen2 } from "./webgl/screen/story2/StoryScreen";
import { TestScreen } from "./webgl/screen/test/TestScreen";
import { genTexture } from "./webgl/util/GenTexture";
import { Images, loadImage } from "./webgl/util/ImageResource";
// import ScreenManager from "./webgl/util/ScreenManager";

export class ApplicationLoader {

  public static renderer: WebGLRenderer

  public static init(webgl: WebGL2RenderingContext) {
    this.renderer = new WebGLRenderer(webgl)
  }

  public static async loadWorkDirectly() {
    await Resource.init()
  }

  public static async loadWebGL(webgl: WebGL2RenderingContext) {
    const renderer = this.renderer
    Shaders.init(renderer)
    Buffers.init(renderer)
    await this.loadTexture(webgl)
    return renderer
  }

  private static async loadTexture(webgl: WebGL2RenderingContext) {
    for (const imagesKey in Images) {
      TextureStore.add(webgl, imagesKey, Images[imagesKey])
    }
    const gradient = genTexture(webgl, vector2.fromValues(40, 90), context => {
      context.beginPath()
      let canvasGradient = context.createLinearGradient(0, 0, 40, 0);
      canvasGradient.addColorStop(0, '#ffffff')
      canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = canvasGradient
      context.fillRect(0, 0, 40, 90)
      context.fill()
    })
    TextureStore.addTexture('Gradient', gradient)
    const verticalGradient = genTexture(webgl, vector2.fromValues(90, 40), context => {
      context.beginPath()
      let canvasGradient = context.createLinearGradient(45, 0, 45, 40);
      canvasGradient.addColorStop(0, '#ffffff')
      canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = canvasGradient
      context.fillRect(0, 0, 90, 40)
      context.fill()
    })
    TextureStore.addTexture('VerticalGradient', verticalGradient)
    // await TextureStore.addTextureAtlas('Icons-Atlas', iconsAtlas, Images.Icons, false)
    // generate icons atlas
    await loadIconsAtlas()
    await loadAsciiTextAtlas()
  }

  public static async loadImages() {
    await runTask("Downloading images...", async task => {
      task.progress.value = 0
      task.text.value = "Loading texture images..."
      await loadImage()

      task.progress.value = .5
      task.text.value = "Loading background images..."
      await BackgroundManager.changeLoader(BackgroundManager.Default)
      task.progress.value = 1
      task.finish("Images downloaded", Icon.Check)
    }, true)
  }

  public static async loadSounds() {
    await loadSoundEffect()
  }

}