import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable"
import {VertexBuffer} from "../../core/VertexBuffer";
import {Texture} from "../../core/Texture";
import {Shape2D} from "../../util/Shape2D";
import Coordinate from "../../base/Coordinate";
import {Color} from "../../base/Color";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Shaders} from "../../shader/Shaders";

interface ColoredImageDrawableConfig extends BaseDrawableConfig {
  color: Color,
  image: HTMLImageElement
}

export class ColoredImageDrawable extends Drawable<ColoredImageDrawableConfig> {

  private readonly shader: DefaultShaderWrapper
  private readonly buffer: VertexBuffer
  private readonly texture: Texture
  // private readonly layout: VertexBufferLayout
  // private readonly vertexArray: VertexArray
  private textureUnit = 0
  private isVertexUpdate = true

  constructor(
    gl: WebGL2RenderingContext,
    config: ColoredImageDrawableConfig
  ) {
    super(gl, config)
    // const vertexArray = new VertexArray(gl)
    // vertexArray.bind()
    const buffer = new VertexBuffer(gl)
    const shader = Shaders.Default//new Shader(gl, vertexShader, fragmentShader)
    // const layout = new VertexBufferLayout(gl)
    const texture = new Texture(gl, config.image)

    shader.bind()
    shader.color = config.color

    shader.unbind()

    this.buffer = buffer;
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
    this.buffer.unbind()
    this.texture.unbind()
    this.shader.unbind()
  }

  public bind() {
    this.texture.bind(this.textureUnit)
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
    shader.sampler2D = this.textureUnit
    shader.transform = this.matrixArray
    shader.orth = Coordinate.orthographicProjectionMatrix4
    this.config.color.alpha = this.appliedTransform.alpha
    shader.color = this.config.color
    // shader.setUniform1i(UNI_SAMPLER, this.textureUnit)
    // shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
    // shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
    // shader.setUniform1f(UNI_ALPHA, this.appliedTransform.alpha)
    shader.use()
    // this.vertexArray.addBuffer(this.layout)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  public dispose() {
    this.texture.dispose()
    // this.vertexArray.dispose()
    // this.shader.dispose()
    this.buffer.dispose()
  }
}