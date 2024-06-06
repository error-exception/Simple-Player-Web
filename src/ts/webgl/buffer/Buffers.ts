import {QuadBuffer} from "./QuadBuffer";
import type {WebGLRenderer} from "../WebGLRenderer";

export class Buffers {

  public static SingleQuad: QuadBuffer

  public static init(renderer: WebGLRenderer) {
    this.SingleQuad = new QuadBuffer(renderer, 1, renderer.gl.STREAM_DRAW)
  }

  public static dispose() {
    this.SingleQuad.dispose()
  }
}