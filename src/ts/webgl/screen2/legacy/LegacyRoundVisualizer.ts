import { BeatState } from "../../../global/Beater";
import { Time } from "../../../global/Time";
import { OSUApplication } from "../../../OSUApplication";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import { degreeToRadian } from "../../../Utils";
import { VisualizerV2 } from "../../../VisualizerV2";
import { color } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { Blend } from "../../drawable/Blend";
import { QuadBuffer } from "../../graphic/buffer/QuadBuffer";
import { Texture } from "../../graphic/core/Texture";
import { matrix3 } from "../../graphic/matrix/mat3";
import { vector2 } from "../../graphic/matrix/vec2";
import { quad } from "../../graphic/shape/Quad";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { View } from "../../view/View";


export class LegacyRoundVisualizer extends View {

  private readonly borderBarTexture: Texture
  private readonly barTexture: Texture

  private readonly visualizer: VisualizerV2

  constructor(private innerRadius: number = 236) {
    super()
    this.barTexture = TextureStore.getTexture('Bar')
    this.borderBarTexture = TextureStore.getTexture('BorderBar')
    console.log(this.barTexture, this.borderBarTexture)
    this.visualizer = AudioPlayerV2.getVisualizer()
    this.color = color.White
  }

  // public drawNode: LegacyVisualizerDrawNode = new LegacyVisualizerDrawNode(this)

  private centerOfDrawable = vector2.create()
  //@ts-ignore
  private vertexBuffer: QuadBuffer
  public onLoad() {
    super.onLoad();
    const renderer = OSUApplication.renderer
    if (!renderer) {
      return
    }
    // node.blend = Blend.Additive
    this.vertexBuffer = new QuadBuffer(renderer, 200 * 5, renderer.gl.STREAM_DRAW)
    // node.shader = Shaders.LegacyVisualizer
    // node.useTexture(
    //   { texture: this.barTexture, unit: 5 },
    //   {texture: this.borderBarTexture, unit: 6 }
    // )
    // node.apply()
    // this.setScale(Vector(-1, 1))
  }

  public onUpdate() {
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

    this.alpha = BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.08 : 0.14
  }

  public onDraw(canvas: Canvas) {
    vector2.middle(this.centerOfDrawable, vector2.create(), this.size)
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
    const barMatrix = matrix3.identity(matrix3.create())
    const identity = matrix3.identity(matrix3.create())
    const tempQuad = quad.create()

    canvas.setBlend(Blend.Additive)
    canvas.useVertexBuffer(this.vertexBuffer)
    canvas.beginBatch()
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5

        const value = innerRadius + spectrum[i] * (160)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        vector2.set(tempQuad.topLeft, fromX - half, fromY)
        vector2.set(tempQuad.topRight, fromX + half, fromY)
        vector2.set(tempQuad.bottomLeft, toX - half, toY)
        vector2.set(tempQuad.bottomRight, toX + half, toY)

        matrix3.copy(barMatrix, identity)
        matrix3.translate(barMatrix, barMatrix, this.centerOfDrawable)
        matrix3.rotate(barMatrix, barMatrix, degreeToRadian(degree))        
        
        quad.transformMat3(tempQuad, tempQuad, barMatrix)

        canvas.drawQuad(
          tempQuad, this.borderBarTexture
        )
      }
    }
    canvas.endBatch()
    canvas.beginBatch()

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {

        const degree = i / 200 * 360 + j * 360 / 5 + 1.8

        const value = innerRadius + spectrum[i] * (80)
        const fromX = centerX
        const fromY = centerY + innerRadius
        const toX = centerX
        const toY = centerY + value

        vector2.set(tempQuad.topLeft, fromX - half, fromY)
        vector2.set(tempQuad.topRight, fromX + half, fromY)
        vector2.set(tempQuad.bottomLeft, toX - half, toY)
        vector2.set(tempQuad.bottomRight, toX + half, toY)

        matrix3.copy(barMatrix, identity)
        matrix3.translate(barMatrix, barMatrix, this.centerOfDrawable)
        matrix3.rotate(barMatrix, barMatrix, degreeToRadian(degree))        

        quad.transformMat3(tempQuad, tempQuad, barMatrix)

        canvas.drawQuad(
          tempQuad, this.barTexture
        )
      }
    }
    canvas.endBatch()
  }

  public dispose() {
    super.dispose()
    this.vertexBuffer.dispose()
  }

}