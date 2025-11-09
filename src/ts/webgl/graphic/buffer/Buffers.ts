import {QuadBuffer} from "./QuadBuffer";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {FrameBuffer} from "../core/FrameBuffer";

export class Buffers {

  public static SingleQuad: QuadBuffer
  public static FrameBuffer: FrameBuffer

  public static init(renderer: WebGLRenderer) {
    this.SingleQuad = new QuadBuffer(renderer, 1, renderer.gl.STREAM_DRAW)
    this.FrameBuffer = new FrameBuffer(renderer.gl)
  }

  public static dispose() {
    this.SingleQuad.dispose()
    this.FrameBuffer.dispose()
  }
}