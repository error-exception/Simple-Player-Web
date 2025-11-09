import { BeatState } from "../../../global/Beater";
import { Time } from "../../../global/Time";
import { OSUApplication } from "../../../OSUApplication";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import { degreeToRadian } from "../../../Utils";
import type { VisualizerV2 } from "../../../VisualizerV2";
import { color } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { Blend } from "../../drawable/Blend";
import { QuadBuffer } from "../../graphic/buffer/QuadBuffer";
import { matrix3 } from "../../graphic/matrix/mat3";
import { vector2 } from "../../graphic/matrix/vec2";
import { quad } from "../../graphic/shape/Quad";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { View } from "../../view/View";

export class RoundVisualizer extends View {
  private readonly barCountPerRound = 220
  private readonly maxSpectrumHeight: number = 160
  private readonly scaleFactor = 160 / (450 / 2 * 0.9)
  private readonly visualizer: VisualizerV2
  private readonly innerRadius: number = 236

  constructor(innerRadius?: number) {
    super()
    if (innerRadius) {
      this.innerRadius = innerRadius
    }
    this.visualizer = AudioPlayerV2.getVisualizer()
    this.maxSpectrumHeight = this.innerRadius * this.scaleFactor
    this.color = color.White
  }

  private centerOfView = vector2.create()
  //@ts-ignore
  private quadBuffer: QuadBuffer

  public onLoad(): void {
    const renderer = OSUApplication.renderer
    if (!renderer) {
      return
    }
    this.quadBuffer = new QuadBuffer(renderer, this.barCountPerRound * 5, renderer.gl.STREAM_DRAW)
    // this.setScale(vector2.fromValues(-1, -1))
  }

  public onUpdate(): void {
    super.onUpdate()
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5)
  }

  private simpleSpectrum: number[] = new Array<number>(this.barCountPerRound)
  private lastTime = 0
  private updateOffsetTime = 0
  private indexOffset = 0
  private indexChange = ~~Math.round(this.barCountPerRound / 40)
  private targetSpectrum: number[] = new Array<number>(this.barCountPerRound).fill(0)
  // TODO: 调整频谱
  private spectrumShape: number[] = [
    1.5, 2, 2.7, 2.1, 1.4,
    1.1, 1, 1, 1, 1,
    ...(new Array<number>(this.barCountPerRound - 10).fill(1))
  ]

  private getSpectrum(timestamp: number, barScale: number) {
    // Following code is based on LogoVisualizer in osu!
    if (this.lastTime === 0 || this.updateOffsetTime === 0) {
      this.lastTime = timestamp
      this.updateOffsetTime = timestamp
    }
    const fftData = this.visualizer.getFFT()
    for (let i = 0; i < fftData.length; i++) {
      this.simpleSpectrum[i] = fftData[i] / 255.0
    }
    const c = this.barCountPerRound
    for (let i = 0; i < c; i++) {
      const targetIndex = (i + this.indexOffset) % c
      const target = this.simpleSpectrum[targetIndex]
      if (target > this.targetSpectrum[i]) {
        this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale)
      }
    }
    if (timestamp - this.updateOffsetTime >= 50) {
      this.updateOffsetTime = timestamp
      this.indexOffset = (this.indexOffset - this.indexChange) % c
    }
    const decayFactor = (timestamp - this.lastTime) * 0.0024
    for (let i = 0; i < c; i++) {
      this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03)
      if (this.targetSpectrum[i] < 0) {
        this.targetSpectrum[i] = 0
      }
    }
    this.lastTime = timestamp

    this.alpha = BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.08 : 0.14
  }

  public onDraw(canvas: Canvas): void {
    vector2.middle(this.centerOfView, vector2.create(), this.size)
    const centerX = 0, centerY = 0
    const spectrum = this.targetSpectrum
    const length = this.barCountPerRound
    const innerRadius = this.innerRadius
    const lineWidth = (
      innerRadius / 2 * Math.sin(
        degreeToRadian(360 / (length))
      )
    ) * 2
    const half = lineWidth / 2

    const texture = TextureStore.getTexture('Square')
    const maxSpectrumHeight = this.maxSpectrumHeight;
    const tempQuad = quad.create()
    const mat3 = matrix3.identity(matrix3.create())
    const identity = matrix3.identity(matrix3.create())

    canvas.beginBatch()
    canvas.setBlend(Blend.Additive)
    canvas.useVertexBuffer(this.quadBuffer)

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {
        const degree = i / length * 360 + j * 360 / 5
        const value = innerRadius + spectrum[i] * (maxSpectrumHeight)
        const fromX = centerX;
        const fromY = centerY + innerRadius;
        const toX = centerX;
        const toY = centerY + value;

        vector2.set(tempQuad.topLeft, fromX - half, fromY)
        vector2.set(tempQuad.topRight, fromX + half, fromY)
        vector2.set(tempQuad.bottomLeft, toX - half, toY)
        vector2.set(tempQuad.bottomRight, toX + half, toY)

        matrix3.copy(mat3, identity)
        matrix3.translate(mat3, mat3, this.centerOfView)
        matrix3.rotate(mat3, mat3, degreeToRadian(degree))

        quad.transformMat3(tempQuad, tempQuad, mat3)
        canvas.drawQuad(
          tempQuad,
          texture
        )
      }
    }

    canvas.endBatch()
  }
}