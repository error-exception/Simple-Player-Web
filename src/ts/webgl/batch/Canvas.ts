import type {Vector2} from "../core/Vector2";
import type {Texture} from "../core/Texture";
import type {Color} from "../base/Color";
import type {Nullable} from "../../type";
import type {ShaderWrapper} from "../shader/ShaderWrapper";
import {currentBatch} from "./Batch";
import type {VertexBuffer} from "../core/VertexBuffer";
import type {IndexBuffer} from "../core/IndexBuffer";
import {Blend} from "./Blend";
import {Shape2D} from "../util/Shape2D";

export class Canvas {

  public shader: Nullable<ShaderWrapper> = null
  public vertexBuffer: Nullable<VertexBuffer> = null
  public indexBuffer: Nullable<IndexBuffer> = null
  public texture: Nullable<Texture> = null
  public blend: Blend = Blend.Normal
  private offset = 0
  private buffer: number[] | Float32Array = []
  public beginIndex = 0

  constructor() {
    const batch = currentBatch
    if (batch) {
      this.shader = batch.shader
      this.vertexBuffer = batch.vertexBuffer
      this.indexBuffer = batch.indexBuffer
      this.texture = batch.texture
    }
  }

  //@ts-ignore
  private validDraw = true
  public beginDraw() {
    if (this.canBatch()) {
      //TODO
      return
    }
    if (this.shader === null || this.vertexBuffer === null) {
      this.validDraw = false
      return;
    }

  }

  private canBatch(): boolean {
    if (!currentBatch) {
      return false
    }
    let canBatch = this.shader === null && this.vertexBuffer === null &&
      this.indexBuffer === null && this.texture === null
    if (canBatch) {
      this.shader = currentBatch.shader
      this.vertexBuffer = currentBatch.vertexBuffer
      this.indexBuffer = currentBatch.indexBuffer
      this.texture = currentBatch.texture
      return true
    }
    canBatch = canBatch || (this.shader === currentBatch.shader &&
      this.vertexBuffer === currentBatch.vertexBuffer &&
      this.indexBuffer === currentBatch.indexBuffer &&
      this.texture === currentBatch.texture)
    return canBatch
  }

  public endDraw() {

    this.offset = 0
  }

  public drawColor(color: Color) {
    Shape2D.oneColor(
      color,
      this.buffer,
      this.beginIndex + this.offset,
      this.shader!.stride
    )
    this.offset += 4
  }

  public drawQuad(topLeft: Vector2, bottomRight: Vector2) {
    Shape2D.quadVector2(
      topLeft,
      bottomRight,
      this.buffer,
      this.beginIndex + this.offset,
      this.shader!.stride
    )
    this.offset += 2
  }

  public drawTexture(topLeft: Vector2, bottomRight: Vector2, texture: Texture) {
    this.texture = texture
    Shape2D.quadVector2(
      topLeft,
      bottomRight,
      this.buffer,
      this.beginIndex + this.offset,
      this.shader!.stride
    )
    this.offset += 2
  }

}