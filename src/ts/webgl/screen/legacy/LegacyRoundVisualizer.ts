import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {degreeToRadian} from "../../../Utils";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector, Vector2} from "../../core/Vector2";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {VisualizerV2} from "../../../VisualizerV2";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import Coordinate from "../../base/Coordinate";
import {Texture} from "../../core/Texture";
import {WebGLRenderer} from "../../WebGLRenderer";
import {Blend} from "../../drawable/Blend";
import {QuadBuffer} from "../../buffer/QuadBuffer";
import {TextureStore} from "../../texture/TextureStore";
import {Shaders} from "../../shader/Shaders";
import {DrawNode} from "../../drawable/DrawNode";
import type {LegacyVisualizerShaderWrapper} from "../../shader/LegacyVisualizerShaderWrapper";
import {Matrix3} from "../../core/Matrix3";
import {TransformUtils2} from "../../core/TransformUtils2";

export interface LegacyRoundVisualizerConfig extends BaseDrawableConfig {
  innerRadius?: number
}

export class LegacyRoundVisualizer extends Drawable<LegacyRoundVisualizerConfig> {

  private readonly borderBarTexture: Texture
  private readonly barTexture: Texture

  private readonly visualizer: VisualizerV2

  private innerRadius = 236
  constructor(
    config: LegacyRoundVisualizerConfig
  ) {
    super(config)
    if (config.innerRadius) {
      this.innerRadius = config.innerRadius
    }
    this.barTexture = TextureStore.get('Bar')
    this.borderBarTexture = TextureStore.get('BorderBar')

    this.visualizer = AudioPlayerV2.getVisualizer()
  }

  public drawNode: LegacyVisualizerDrawNode = new LegacyVisualizerDrawNode(this)

  private centerOfDrawable = Vector()
  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.blend = Blend.Additive
    node.vertexBuffer = new QuadBuffer(renderer, 200 * 5 * 2, renderer.gl.STREAM_DRAW, 5)
    node.shader = Shaders.LegacyVisualizer
    node.useTexture(
      { texture: this.barTexture, unit: 5 },
      {texture: this.borderBarTexture, unit: 6 }
    )
    node.apply()
    this.centerOfDrawable = this.position.add(this.size.divValue(2))
    this.scale = Vector(-1, 1)
  }

  public onWindowResize() {
    super.onWindowResize();
    this.centerOfDrawable = this.position.add(this.size.divValue(2))
  }

  protected onUpdate() {
    super.onUpdate();
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
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

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as LegacyVisualizerShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.alpha = BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14
    shader.sampler2D1 = 5
    shader.sampler2D2 = 6
  }

  public onDraw(node: DrawNode) {

    const centerX = 0, centerY = 0
    const spectrum = this.targetSpectrum
    const length = 200
    const innerRadius = this.innerRadius
    const lineWidth = (
      innerRadius / 2 * Math.sin(
        degreeToRadian(360 / (length))
      )
    ) * 2
    const half = lineWidth / 2
    let k = 0;
    const barMatrix = Matrix3.newIdentify()

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5

        const value = innerRadius + spectrum[i] * (160)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        let point1 = new Vector2(fromX - half, fromY)
        let point2 = new Vector2(fromX + half, fromY)
        let point3 = new Vector2(toX - half, toY)
        let point4 = new Vector2(toX + half, toY)

        barMatrix.setFrom(Matrix3.identify)
        TransformUtils2.rotateFromLeft(barMatrix, degree)
        TransformUtils2.translateFromLeft(barMatrix, this.centerOfDrawable)

        TransformUtils.applySelf(point1, barMatrix)
        TransformUtils.applySelf(point2, barMatrix)
        TransformUtils.applySelf(point3, barMatrix)
        TransformUtils.applySelf(point4, barMatrix)

        node.drawQuad(point1, point2, point3, point4, undefined, k)
        node.drawTexture(this.barTexture, Vector(0, 1), Vector(1, 0), k)
        node.drawOne(0, 4, 4, k)
        k++

      }
    }

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5 + 1.8

        const value = innerRadius + spectrum[i] * (80)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        let point1 = new Vector2(fromX - half, fromY)
        let point2 = new Vector2(fromX + half, fromY)
        let point3 = new Vector2(toX - half, toY)
        let point4 = new Vector2(toX + half, toY)

        barMatrix.setFrom(Matrix3.identify)
        TransformUtils2.rotateFromLeft(barMatrix, degree)
        TransformUtils2.translateFromLeft(barMatrix, this.centerOfDrawable)

        TransformUtils.applySelf(point1, barMatrix)
        TransformUtils.applySelf(point2, barMatrix)
        TransformUtils.applySelf(point3, barMatrix)
        TransformUtils.applySelf(point4, barMatrix)

        node.drawQuad(point1, point2, point3, point4, undefined, k)
        node.drawTexture(this.borderBarTexture, Vector(0, 1), Vector(1, 0), k)
        node.drawOne(1, 4, 4, k)
        k++
      }
    }
  }

  public dispose() {
    super.dispose()
    this.drawNode.vertexBuffer.dispose()
  }

}

interface TextureAndUnit {
  texture: Texture,
  unit: number
}

class LegacyVisualizerDrawNode extends DrawNode {

  private textures: TextureAndUnit[] = []

  public useTexture(...textures: TextureAndUnit[]) {
    this.textures.push(...textures)
  }

  draw(renderer: WebGLRenderer) {
    this.source.onDraw(this, renderer)
    this.shader.bind()
    const textures = this.textures
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      renderer.bindTexture(texture.texture, texture.unit)
    }
    this.vertexBuffer.bind()
    const data = this.bufferData
    this.vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    )

    renderer.setBlend(this.blend)

    this.source.beforeCommit(this)
    this.shader.use()
    this.vertexBuffer.draw()

    this.shader.unbind()
    this.vertexBuffer.unbind()
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      renderer.unbindTexture(texture.texture)
    }
  }
}