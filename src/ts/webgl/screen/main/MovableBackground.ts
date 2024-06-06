import BackgroundLoader from "../../../global/BackgroundLoader";
import {Box} from "../../box/Box";
import Coordinate from "../../base/Coordinate";
import {Drawable} from "../../drawable/Drawable";
import {Texture} from "../../core/Texture";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector, Vector2} from "../../core/Vector2";
import {easeOutQuint} from "../../../util/Easing";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Color} from "../../base/Color";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {TextureStore} from "../../texture/TextureStore";
import type {DrawNode} from "../../drawable/DrawNode";
import {Anchor} from "../../drawable/Anchor";

// const vertexShader = `
//     attribute vec4 a_position;
//     attribute vec2 a_tex_coord;
//
//     varying mediump vec2 v_tex_coord;
//
//     uniform mat4 u_transform;
//
//     void main() {
//         gl_Position = a_position * u_transform;
//         v_tex_coord = a_tex_coord;
//     }
// `
//
// const fragmentShader = `
//     varying mediump vec2 v_tex_coord;
//     uniform sampler2D u_sampler;
//     //uniform mediump vec2 u_brightness;
//     uniform mediump float u_alpha;
//     void main() {
//         mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//         /*
//         mediump float distance = 0.0;
//         mediump float target = 0.0;
//
//         mediump float leftDistance = (0.15 - v_tex_coord.x) / 0.1;
//         mediump float rightDistance = (v_tex_coord.x - 0.85) / 0.1;
//         leftDistance = max(leftDistance, 0.0);
//         rightDistance = max(rightDistance, 0.0);
//         target = max(u_brightness.x * leftDistance, 0.0);
//         target = max(u_brightness.y * rightDistance, target);
//
//         texelColor.rgb = min(texelColor.rgb + target, 1.0);*/
//         texelColor.a = texelColor.a * u_alpha;
//         gl_FragColor = texelColor;
//     }
// `

interface ImageDrawInfo {
  drawWidth: number
  drawHeight: number,
  offsetLeft: number,
  offsetTop: number,
  needToChange: boolean
}

export class MovableBackground extends Drawable {

  private readonly texture: Texture

  public imageDrawInfo: ImageDrawInfo = {
    drawHeight: 0, drawWidth: 0, needToChange: false, offsetLeft: 0, offsetTop: 0
  }

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent'],
      anchor: Anchor.Center
    })
    this.texture = TextureStore.create()
  }

  protected onUpdate() {
    super.onUpdate();
    if (this.transition.transitionAlpha.isEnd) {
      this.onFinish?.()
      this.onFinish = null
    }

    const min = Math.min
    const viewport = Coordinate;
    const {imageWidth, imageHeight} = this.texture

    const imageDrawInfo = this.imageDrawInfo
    if (imageDrawInfo.needToChange) {
      const rawWidth = this.width
      const rawHeight = this.height
      const rawRatio = rawWidth / rawHeight
      const imageRatio = imageWidth / imageHeight
      if (rawRatio > imageRatio) {
        imageDrawInfo.drawWidth = imageWidth
        imageDrawInfo.drawHeight = imageWidth / rawRatio
        imageDrawInfo.offsetLeft = 0
        imageDrawInfo.offsetTop = (imageHeight - imageDrawInfo.drawHeight) / 2
      } else {
        imageDrawInfo.drawHeight = imageHeight
        imageDrawInfo.drawWidth = imageHeight * rawRatio
        imageDrawInfo.offsetTop = 0
        imageDrawInfo.offsetLeft = (imageWidth - imageDrawInfo.drawWidth) / 2
      }
      imageDrawInfo.needToChange = false
    }

    const scale = 1.02
    const translate = this.translate

    const scaledWidth = imageWidth * scale
    const scaledHeight = imageHeight * scale

    const shortOnImage = min(scaledHeight, scaledWidth)
    const shortOnViewport = min(viewport.width, viewport.height)
    const factor = shortOnViewport / shortOnImage

    const widthDiffer = scaledWidth - imageWidth
    const heightDiffer = scaledHeight - imageHeight
    const x = (factor * widthDiffer / viewport.width) * (translate.x - Coordinate.centerX)
    const y = (factor * heightDiffer / viewport.height) * (translate.y - Coordinate.centerY)

    this.scale = Vector(scale)
    this.translate = new Vector2(x, y)
  }

  public setBackgroundImage(image: ImageBitmap) {
    this.texture.setTextureImage(image)
    this.imageDrawInfo.needToChange = true
  }

  private onFinish: (() => void) | null = null

  public fadeOut(onFinish: () => void) {
    this.transform().fadeTo(0, 220)
    this.onFinish = onFinish
  }

  public onWindowResize(): void {
    super.onWindowResize()
    this.imageDrawInfo.needToChange = true
  }

  private white = Color.White.copy()

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
    this.white.alpha = this.appliedTransform.alpha
    shader.color = this.white
  }

  public onDraw(node: DrawNode) {
    const topLeft = this.position.copy()
    const bottomRight = this.position.add(this.size)

    const info = this.imageDrawInfo
    const imageTopLeft = new Vector2(info.offsetLeft, info.offsetTop)

    const imageBottomRight = new Vector2(info.offsetLeft + info.drawWidth, info.offsetTop + info.drawHeight)
    const imageScale = TransformUtils.scale(1 / this.texture.imageWidth, 1 / this.texture.imageHeight)
    TransformUtils.applySelf(imageTopLeft, imageScale)
    TransformUtils.applySelf(imageBottomRight, imageScale)

    node.drawRect(topLeft, bottomRight)
    node.drawTexture(this.texture, imageTopLeft, imageBottomRight)
  }

  public dispose() {
    super.dispose()
    this.texture.dispose()
  }
}

export class Background extends Box {

  constructor(initImage?: ImageBitmap) {
    super({size: ['fill-parent', 'fill-parent']});
    const current = new MovableBackground()
    const next = new MovableBackground()
    this.add(next, current)
    this.backImage.isVisible = false
    this.frontImage.setBackgroundImage(initImage ? initImage : BackgroundLoader.getBackground())
  }

  private swap() {
    const temp = this.childrenList[0]
    this.childrenList[0] = this.childrenList[1]
    this.childrenList[1] = temp
  }

  private get frontImage() {
    return this.childrenList[1] as MovableBackground
  }

  private get backImage() {
    return this.childrenList[0] as MovableBackground
  }

  private isFading = false

  public updateBackground2(image: ImageBitmap) {
    if (this.isFading) return
    this.isFading = true

    this.backImage.setBackgroundImage(image)
    this.backImage.isVisible = true
    this.backImage.alpha = 1
    this.frontImage.fadeOut(() => {
      this.frontImage.isVisible = false
      this.isFading = false
      this.swap()
    })
  }

  set translate(v: Vector2) {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].translate = v
    }
  }

  get translate(): Vector2 {
    return Vector2.newZero()
  }

  public draw(renderer: WebGLRenderer) {
    if (this.isVisible) {
      this.backImage.draw(renderer)
      this.frontImage.draw(renderer)
    }
  }

}

export class BackgroundBounce extends Box {

  public background: Background

  constructor(backgroundImage: ImageBitmap | undefined) {
    super( {
      size: ['fill-parent', 'fill-parent']
    });

    this.add((this.background = new Background(backgroundImage)))
  }

  public in() {
    this.transform()
      .delay(300).scaleTo(Vector(0.996), 500, easeOutQuint)
      .delay(300).moveTo(Vector(0, 40), 500, easeOutQuint)
      .delay(300).fadeTo(0.7, 500, easeOutQuint)
  }

  public out() {
    this.transform()
      .scaleTo(Vector(1), 500, easeOutQuint)
      .moveTo(Vector2.newZero(), 500, easeOutQuint)
      .fadeTo(1, 500, easeOutQuint)
  }

  public updateBackground2(image: ImageBitmap) {
    this.background.updateBackground2(image)
  }

}