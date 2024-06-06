import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import type {DrawNode} from "../../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Color} from "../../base/Color";
import {TextureStore} from "../../texture/TextureStore";

export class LegacyLogo extends Drawable {

  // private readonly shader: Shader
  // private readonly buffer: VertexBuffer
  // private readonly texture: Texture
  // private readonly layout: VertexBufferLayout
  // private readonly vertexArray: VertexArray
  // private readonly textureUnit = 0
  private brightness = 0
  private brightnessTransition = new ObjectTransition(this, 'brightness')

  constructor(config: BaseDrawableConfig) {
    super(config)

    // const vertexArray = new VertexArray(gl)
    // vertexArray.bind()
    // const buffer = new VertexBuffer(gl)
    // const shader = BrightnessTextureShader.newShader(gl)
    // const layout = new VertexBufferLayout(gl)
    // const texture = new Texture(gl, Images.LegacyLogo)
    //
    // buffer.bind()
    // shader.bind()
    //
    // layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
    // layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
    // vertexArray.addBuffer(layout)
    //
    // vertexArray.unbind()
    // buffer.unbind()
    // shader.unbind()
    //
    // this.vertexArray = vertexArray
    // this.buffer = buffer;
    // this.layout = layout
    // this.shader = shader
    // this.texture = texture
  }

  // public createVertexArray() {
  //   const width = this.width
  //   const height = this.height
  //   const { x, y } = this.position
  //
  //   const topLeft = new Vector2(x, y)
  //   const bottomRight = new Vector2(x + width, y - height)
  //   const vertexData: number[] = []
  //   Shape2D.quadVector2(
  //     topLeft, bottomRight,
  //     vertexData, 0, 4
  //   )
  //   Shape2D.quad(
  //     0, 0, 1, 1,
  //     vertexData, 2, 4
  //   )
  //   console.log(vertexData);
  //
  //   return new Float32Array(vertexData)
  // }

  public brightnessBegin(atTime: number = Time.currentTime) {
    this.brightnessTransition.setStartTime(atTime)
    return this.brightnessTransition
  }

  // public onLoad(): void {
  //   this.buffer.bind()
  //   this.buffer.setBufferData(this.createVertexArray())
  //   this.buffer.unbind()
  // }
  //
  // public onWindowResize(): void {
  //   super.onWindowResize()
  //   this.buffer.bind()
  //   this.buffer.setBufferData(this.createVertexArray())
  //   this.buffer.unbind()
  // }
  //
  // public unbind() {
  //   this.buffer.unbind()
  //   this.vertexArray.unbind()
  //   this.texture.unbind()
  //   this.shader.unbind()
  // }

  protected onUpdate() {
    super.onUpdate();
    this.brightnessTransition.update(Time.currentTime)
  }

  // public bind() {
  //   this.texture.bind(this.textureUnit)
  //   this.buffer.bind()
  //   this.vertexArray.bind()
  //   this.shader.bind()
  // }
  //
  private color = Color.White.copy()
  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
    const color = this.color
    color.red = Math.min(1 - this.brightness, 1)
    color.blue = Math.min(1 - this.brightness, 1)
    color.green = Math.min(1 - this.brightness, 1)
    color.alpha = this.appliedTransform.alpha
    shader.color = color
  }

  public onDraw(node: DrawNode) {
    node.drawRect(this.position, this.position.add(this.size))
    node.drawTexture(TextureStore.get('LegacyLogo'))
  }

  // public dispose() {
  //   this.texture.dispose()
  //   this.vertexArray.dispose()
  //   this.shader.dispose()
  //   this.buffer.dispose()
  // }

}