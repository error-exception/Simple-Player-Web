import {Sprite} from "./Sprite";
import {Drawable} from "../../drawable/Drawable";
import StoryTextureManager from "./StoryTextureManager";
import OSUPlayer from "../../../player/OSUPlayer";
import Coordinate from "../../base/Coordinate";
import {TransformUtils} from "../../core/TransformUtils";
import {isAnimation} from "../../../osu/OSUFile";
import {Animation} from "./Animation";
import {Shaders} from "../../shader/Shaders";
import {DrawNode} from "../../drawable/DrawNode";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {StoryboardLayer} from "./StoryboardLayer";

export class StoryScreen extends Drawable {

  // public spriteList: Sprite[] = []
  private orth: Float32Array = new Float32Array(16)
  private layers: StoryboardLayer = new StoryboardLayer()

  public drawNode: DrawNode = new class extends DrawNode {
    apply() {}
    draw(renderer: WebGLRenderer) {
      this.source.onDraw(this, renderer)
    }
  }(this)

  constructor(gl: WebGL2RenderingContext) {
    super({
      size: ['fill-parent', 'fill-parent']
    });

    const osb = OSUPlayer.currentOSUFile.value.Events?.storyboard
    const osbSource = OSUPlayer.currentOSZFile.value.source.osb
    if (osb) {
      for (let i = 0; i < osb.sprites.length; i++) {
        try {
          const osbSprite = osb.sprites[i]
          let sprite: Sprite
          if (isAnimation(osbSprite)) {
            sprite = new Animation(gl, osbSprite, osbSource)
          } else {
            sprite = new Sprite(gl, osbSprite, osbSource)
          }
          if (sprite.layer === 'Background') {
            this.layers.background.push(sprite)
          } else if (sprite.layer === 'Fail') {
            this.layers.fail.push(sprite)
          } else if (sprite.layer === 'Pass') {
            this.layers.pass.push(sprite)
          } else if (sprite.layer === 'Foreground') {
            this.layers.foreground.push(sprite)
          } else {
            this.layers.overlay.push(sprite)
          }
        } catch (e: any) {
          // if (e instanceof Error) {
            console.log(e)
            // notifyMessage(e.message)
          // }
        }
      }
    }
    const shader = Shaders.StoryDefault
    shader.bind()
    shader.sampler2D = 0
    shader.unbind()
    const scale = 480 / Coordinate.height
    const scaledWidth = Coordinate.width * scale
    const s = scaledWidth - 640 < 0 ? 0 : scaledWidth - 640
    this.orth = TransformUtils.orth(
      -s / 2, 640 + s / 2, 480, 0, 0, 1
    )
    // console.log("story size", 0, Coordinate.width * scale, 480, 0)
  }

  public onWindowResize() {
    super.onWindowResize();
    const scale = 480 / Coordinate.height
    const scaledWidth = 640 / scale
    const s = Coordinate.width - scaledWidth
    this.orth = TransformUtils.orth(
      -s / 2, scaledWidth + s / 2, 480, 0, 0, 1
    )
    this.layers.onResize()
    // for (let i = 0; i < this.spriteList.length; i++) {
    //   this.spriteList[i].onResize()
    // }
  }

  protected onUpdate() {
    super.onUpdate();
    this.layers.update()
    // for (let i = 0; i < this.spriteList.length; i++) {
    // }
  }

  public bind() {
    Shaders.StoryDefault.bind()
  }

  public onDraw(node: DrawNode, renderer: WebGLRenderer) {
    this.bind()
    Shaders.StoryDefault.orth = this.orth
    // const sprites = this.spriteList
    // for (let i = 0; i < sprites.length; i++) {
    //   sprites[i].draw(renderer)
    // }
    this.layers.draw(renderer)
    this.unbind()
  }

  public dispose() {
    super.dispose();
    StoryTextureManager.dispose()
    // this.spriteList.forEach(v => v.dispose())
    this.layers.dispose()
  }

  unbind(): void {
  }

}