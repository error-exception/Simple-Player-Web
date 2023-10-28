import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Shader} from "../../core/Shader";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {degreeToRadian} from "../../../Utils";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector2} from "../../core/Vector2";
import {IndexBuffer} from "../../core/IndexBuffer";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {VisualizerV2} from "../../../VisualizerV2";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import Coordinate from "../../base/Coordinate";
import {Texture} from "../../core/Texture";
import {Images} from "../../util/ImageResource";

const vertexShader = `
    attribute vec2 a_vertexPosition;
    attribute vec2 a_tex_coord;
    attribute float a_sampler_flag;
    
    varying lowp float v_sampler_flag;
    varying mediump vec2 v_tex_coord;
    
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    void main() {
        vec4 coord = vec4(a_vertexPosition, 0.0, 1.0) * u_transform;
        v_sampler_flag = a_sampler_flag;
        v_tex_coord = a_tex_coord;
        gl_Position = coord * u_orth;
    }
`

const fragmentShader = `
    uniform lowp float u_alpha;
    uniform sampler2D u_sampler_4;
    uniform sampler2D u_sampler_5;
    
    varying mediump vec2 v_tex_coord;
    varying lowp float v_sampler_flag;
    
    void main() {
        mediump vec4 texelColor = vec4(0.0);
        if (v_sampler_flag > 0.5) {
            texelColor = texture2D(u_sampler_4, v_tex_coord);
        } else {
            texelColor = texture2D(u_sampler_5, v_tex_coord);
        }
        
        texelColor.a = texelColor.a * u_alpha;
//        gl_FragColor = vec4(1.0, 1.0, 1.0, u_alpha);
        gl_FragColor = texelColor;
    }
`

export interface LegacyRoundVisualizerConfig extends BaseDrawableConfig {
  innerRadius?: number
}

export class LegacyRoundVisualizer extends Drawable<LegacyRoundVisualizerConfig> {

  private readonly vertexArray: VertexArray
  private readonly buffer: VertexBuffer
  private readonly shader: Shader
  private readonly layout: VertexBufferLayout
  private readonly indexBuffer: IndexBuffer
  private readonly borderBarTexture: Texture
  private readonly barTexture: Texture
  private vertexCount = 0

  private readonly visualizer: VisualizerV2

  private innerRadius = 236
  constructor(
    gl: WebGL2RenderingContext,
    config: LegacyRoundVisualizerConfig
  ) {
    super(gl, config)
    if (config.innerRadius) {
      this.innerRadius = config.innerRadius
    }
    const vertexArray = new VertexArray(gl)
    vertexArray.bind()
    const shader = new Shader(gl, vertexShader, fragmentShader)
    const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
    const layout = new VertexBufferLayout(gl)
    this.barTexture = new Texture(gl, Images.Bar)
    this.borderBarTexture = new Texture(gl, Images.BorderBar)

    const indexBuffer = new IndexBuffer(gl)
    const index: number[] = [
      0, 1, 2, 1, 2, 3
    ]
    const indexArray: number[] = new Array(index.length * 200 * 5 * 2)
    for (let i = 0, j = 0; i < 200 * 5 * 2; i++, j += 6) {
      const increment = i << 2
      indexArray[j] = index[0] + increment
      indexArray[j + 1] = index[1] + increment
      indexArray[j + 2] = index[2] + increment
      indexArray[j + 3] = index[3] + increment
      indexArray[j + 4] = index[4] + increment
      indexArray[j + 5] = index[5] + increment
    }
    indexBuffer.bind()
    indexBuffer.setIndexBuffer(new Uint32Array(indexArray))

    buffer.bind()
    shader.bind()

    shader.setUniform1i('u_sampler_4', 5)
    shader.setUniform1i('u_sampler_5', 6)

    layout.pushFloat(shader.getAttributeLocation('a_vertexPosition'), 2)
    layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
    layout.pushUInt(shader.getAttributeLocation('a_sampler_flag'), 1)
    vertexArray.addBuffer(buffer, layout)

    vertexArray.unbind()
    buffer.unbind()
    indexBuffer.unbind()
    shader.unbind()

    this.vertexArray = vertexArray
    this.buffer = buffer
    this.shader = shader
    this.layout = layout
    this.indexBuffer = indexBuffer

    this.visualizer = AudioPlayerV2.getVisualizer()
  }

  private vertexData = new Float32Array(0)

  protected onUpdate() {
    super.onUpdate();
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
    this.updateVertex(this.targetSpectrum, 200)
  }

  private updateVertex(spectrum: number[], length: number = spectrum.length) {
    const centerX = 0, centerY = 0
    if (this.vertexData.length !== length) {
      this.vertexData = new Float32Array(length * 20 * 5 * 2)
    }
    const array = this.vertexData
    const innerRadius = this.innerRadius
    const lineWidth = (
      innerRadius / 2 * Math.sin(
        degreeToRadian(360 / (length))
      )
    ) * 2
    const half = lineWidth / 2

    let k = 0;

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5

        const radian = degreeToRadian(degree)
        const value = innerRadius + spectrum[i] * (160)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        let point1 = new Vector2(fromX - half, fromY)
        let point2 = new Vector2(fromX + half, fromY)
        let point3 = new Vector2(toX - half, toY)
        let point4 = new Vector2(toX + half, toY)

        const matrix3 = TransformUtils.rotate(radian)

        point1 = TransformUtils.apply(point1, matrix3)
        point2 = TransformUtils.apply(point2, matrix3)
        point3 = TransformUtils.apply(point3, matrix3)
        point4 = TransformUtils.apply(point4, matrix3)

        this.updateAt(array, k, point1, 1, false)
        this.updateAt(array, k + 5, point2, 2, false)
        this.updateAt(array, k + 10, point3, 3, false)
        this.updateAt(array, k + 15, point4, 4, false)

        k += 20

      }
    }

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5 + 1.8

        const radian = degreeToRadian(degree)
        const value = innerRadius + spectrum[i] * (80)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        let point1 = new Vector2(fromX - half, fromY)
        let point2 = new Vector2(fromX + half, fromY)
        let point3 = new Vector2(toX - half, toY)
        let point4 = new Vector2(toX + half, toY)

        const matrix3 = TransformUtils.rotate(radian)

        point1 = TransformUtils.apply(point1, matrix3)
        point2 = TransformUtils.apply(point2, matrix3)
        point3 = TransformUtils.apply(point3, matrix3)
        point4 = TransformUtils.apply(point4, matrix3)

        this.updateAt(array, k, point1, 1, true)
        this.updateAt(array, k + 5, point2, 2, true)
        this.updateAt(array, k + 10, point3, 3, true)
        this.updateAt(array, k + 15, point4, 4, true)

        k += 20

      }
    }

    this.vertexCount = length * 6 * 5 * 2

    this.buffer.bind()
    this.buffer.setBufferData(array)
    this.buffer.unbind()
  }

  /**
   * 3   4
   * 1   2
   * @param array
   * @param offset
   * @param point
   * @param pos
   * @param isOod
   * @private
   */
  private updateAt(
    array: Float32Array,
    offset: number,
    point: Vector2,
    pos: number,
    isOod: boolean
  ) {
    array[offset] = point.x
    array[offset + 1] = point.y
    if (pos === 1) {
      array[offset + 2] = 1
      array[offset + 3] = 1
    } else if (pos === 2) {
      array[offset + 2] = 1
      array[offset + 3] = 0
    } else if (pos === 3) {
      array[offset + 2] = 0
      array[offset + 3] = 1
    } else {
      array[offset + 2] = 0
      array[offset + 3] = 0
    }
    array[offset + 4] = isOod ? 1 : 0
  }

  private simpleSpectrum: number[] = new Array<number>(200)

  private lastTime = 0
  private updateOffsetTime = 0

  private indexOffset = 0
  private indexChange = 5

  private targetSpectrum: number[] = new Array<number>(200).fill(0)

  // TODO: 调整频谱
  private spectrumShape: number[] = [
    1.5, 2, 2.7, 2.1, 1.4,
    1.1, 1, 1, 1, 1,
    ...(new Array<number>(190).fill(1))
  ]

  private getSpectrum(timestamp: number, barScale: number) {
    if (this.lastTime === 0 || this.updateOffsetTime === 0) {
      this.lastTime = timestamp
      this.updateOffsetTime = timestamp
    }
    const fftData = this.visualizer.getFFT()
    for (let i = 0; i < fftData.length; i++) {
      this.simpleSpectrum[i] = fftData[i] / 255.0
    }
    for (let i = 0; i < 200; i++) {
      const targetIndex = (i + this.indexOffset) % 200
      const target = this.simpleSpectrum[targetIndex]
      if (target > this.targetSpectrum[i]) {
        this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale)
      }
    }
    if (timestamp - this.updateOffsetTime >= 50) {
      this.updateOffsetTime = timestamp
      this.indexOffset = (this.indexOffset - this.indexChange) % 200
    }
    const decayFactor = (timestamp - this.lastTime) * 0.0024
    for (let i = 0; i < 200; i++) {
      this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03)
      if (this.targetSpectrum[i] < 0) {
        this.targetSpectrum[i] = 0
      }
    }
    this.lastTime = timestamp
  }

  public bind() {
    this.borderBarTexture.bind(6)
    this.barTexture.bind(5)
    this.buffer.bind()
    this.shader.bind()
    this.vertexArray.bind()
  }

  public unbind() {
    this.borderBarTexture.unbind()
    this.barTexture.unbind()
    this.shader.unbind()
    this.buffer.unbind()
    this.vertexArray.unbind()
  }

  public onDraw() {
    const gl = this.gl

    this.shader.setUniform1f("u_alpha", BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14)
    this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
    this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    this.vertexArray.addBuffer(this.buffer, this.layout)
    gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_INT, 0)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  public dispose() {
    this.vertexArray.dispose()
    this.buffer.dispose()
    this.shader.dispose()
    this.indexBuffer.dispose()
    this.barTexture.dispose()
    this.borderBarTexture.dispose()
  }

}
