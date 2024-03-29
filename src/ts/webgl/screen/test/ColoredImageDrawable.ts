import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable"
import {Shader} from "../../core/Shader";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Texture} from "../../core/Texture";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {VertexArray} from "../../core/VertexArray";
import {
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_ALPHA, UNI_COLOR,
  UNI_ORTH,
  UNI_SAMPLER,
  UNI_TRANSFORM
} from "../../shader/ShaderConstant";
import {Shape2D} from "../../util/Shape2D";
import Coordinate from "../../base/Coordinate";
import {Color} from "../../base/Color";
import ColorTextureShader from "../../shader/ColorTextureShader";

interface ColoredImageDrawableConfig extends BaseDrawableConfig {
  color: Color,
  image: HTMLImageElement
}

export class ColoredImageDrawable extends Drawable<ColoredImageDrawableConfig> {

  private readonly shader: Shader
  private readonly buffer: VertexBuffer
  private readonly texture: Texture
  private readonly layout: VertexBufferLayout
  private readonly vertexArray: VertexArray
  private textureUnit = 0
  private isVertexUpdate = true

  constructor(
    gl: WebGL2RenderingContext,
    config: ColoredImageDrawableConfig
  ) {
    super(gl, config)
    const vertexArray = new VertexArray(gl)
    vertexArray.bind()
    const buffer = new VertexBuffer(gl)
    const shader = ColorTextureShader.newShader(gl)//new Shader(gl, vertexShader, fragmentShader)
    const layout = new VertexBufferLayout(gl)
    const texture = new Texture(gl, config.image)

    buffer.bind()
    shader.bind()
    shader.setUniform4fv(UNI_COLOR, new Float32Array([
      config.color.red, config.color.green, config.color.blue, config.color.alpha
    ]))
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
    vertexArray.addBuffer(buffer, layout)

    vertexArray.unbind()
    buffer.unbind()
    shader.unbind()

    this.vertexArray = vertexArray
    this.buffer = buffer;
    this.layout = layout
    this.shader = shader
    this.texture = texture

  }

  public createVertexArray() {
    const width = this.width
    const height= this.height
    const { x, y } = this.position
    const vertexData: number[] = []
    Shape2D.quad(
      x, y,
      x + width, y - height,
      vertexData, 0, 4
    )
    Shape2D.quad(0, 0, 1, 1, vertexData, 2, 4)
    return new Float32Array(vertexData)
  }

  public onWindowResize() {
    super.onWindowResize()
    this.isVertexUpdate = true

  }

  public unbind() {
    this.vertexArray.unbind()
    this.buffer.unbind()
    this.texture.unbind()
    this.shader.unbind()
  }

  public bind() {
    this.texture.bind(this.textureUnit)
    this.vertexArray.bind()
    this.buffer.bind()
    this.shader.bind()
  }

  public onDraw() {
    const gl = this.gl
    if (this.isVertexUpdate) {
      this.buffer.setBufferData(this.createVertexArray())
      this.isVertexUpdate = false
    }
    const shader = this.shader
    shader.setUniform1i(UNI_SAMPLER, this.textureUnit)
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
    shader.setUniform1f(UNI_ALPHA, this.appliedTransform.alpha)
    this.vertexArray.addBuffer(this.buffer, this.layout)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  public dispose() {
    this.texture.dispose()
    this.vertexArray.dispose()
    this.shader.dispose()
    this.buffer.dispose()
  }
}