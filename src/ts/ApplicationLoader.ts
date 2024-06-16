import {Resource} from "./global/Resource";
import {runTask} from "./notify/OsuNotification";
import {Images, loadImage} from "./webgl/util/ImageResource";
import BackgroundManager from "./global/BackgroundManager";
import {Icon} from "./icon/Icon";
import {loadSoundEffect} from "./player/SoundEffect";
import {WebGLRenderer} from "./webgl/WebGLRenderer";
import {Shaders} from "./webgl/shader/Shaders";
import {Buffers} from "./webgl/buffer/Buffers";
import {TextureStore} from "./webgl/texture/TextureStore";
import {genTexture} from "./webgl/util/GenTexture";
import {Vector} from "./webgl/core/Vector2";
import ScreenManager from "./webgl/util/ScreenManager";
import {MainScreen} from "./webgl/screen/main/MainScreen";
import {SongPlayScreen} from "./webgl/screen/songPlay/SongPlayScreen";
import {TestScreen} from "./webgl/screen/test/TestScreen";
import {LegacyScreen} from "./webgl/screen/legacy/LegacyScreen";
import {StoryScreen} from "./webgl/screen/story/StoryScreen";
import {LegacyPlayScreen} from "./webgl/screen/legacyPlay/LegacyPlayScreen";
import {loadIconsAtlas} from "./webgl/texture/IconAtlas";

export class ApplicationLoader {

  public static async loadWorkDirectly() {
    await Resource.init()
  }

  public static async loadWebGL(webgl: WebGL2RenderingContext) {
    const renderer = new WebGLRenderer(webgl)
    Shaders.init(renderer)
    Buffers.init(renderer)
    await this.loadTexture(webgl)
    return renderer
  }

  private static async loadTexture(webgl: WebGL2RenderingContext) {
    for (const imagesKey in Images) {
      TextureStore.add(webgl, imagesKey, Images[imagesKey])
    }
    const gradiant = genTexture(webgl, Vector(40, 90), context => {
      context.beginPath()
      let canvasGradient = context.createLinearGradient(0, 0, 40, 0);
      canvasGradient.addColorStop(0, '#ffffff')
      canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = canvasGradient
      context.fillRect(0, 0, 40, 90)
      context.fill()
    })
    TextureStore.addTexture('Gradiant', gradiant)
    const verticalGradiant = genTexture(webgl, Vector(90, 40), context => {
      context.beginPath()
      let canvasGradient = context.createLinearGradient(45, 0, 45, 40);
      canvasGradient.addColorStop(0, '#ffffff')
      canvasGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = canvasGradient
      context.fillRect(0, 0, 90, 40)
      context.fill()
    })
    TextureStore.addTexture('VerticalGradiant', verticalGradiant)
    // await TextureStore.addTextureAtlas('Icons-Atlas', iconsAtlas, Images.Icons, false)
    // generate icons atlas
    await loadIconsAtlas()
  }

  public static async loadImages() {
    await runTask("Downloading images...", async task => {
      task.progress.value = 0
      await loadImage()
      task.progress.value = .5
      await BackgroundManager.changeLoader(BackgroundManager.Default)
      task.progress.value = 1
      task.finish("Images downloaded", Icon.Check)
    }, true)
  }

  public static async loadSounds() {
    await loadSoundEffect()
  }

  public static async loadScreen(renderer: WebGLRenderer) {
    ScreenManager.init(renderer)
    ScreenManager.addScreen("main", () => {
      return new MainScreen()
    })
    ScreenManager.addScreen("second", () => {
      return new SongPlayScreen()
    })
    ScreenManager.addScreen('test', () => {
      return new TestScreen()
    })
    ScreenManager.addScreen('legacy', () => {
      return new LegacyScreen()
    })
    ScreenManager.addScreen("story", () => {
      return new StoryScreen(renderer.gl)
    })
    ScreenManager.addScreen("legacyPlay", () => {
      return new LegacyPlayScreen()
    })
    ScreenManager.activeScreen("main")
  }

}