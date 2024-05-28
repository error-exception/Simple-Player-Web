import {Bind} from "./Bind";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexArray} from "./core/VertexArray";

export class Render {

  private bind = new Bind()

  public setVertexBuffer(vb: VertexBuffer) {
    this.bind.vertexBuffer = vb
  }

  public setVertexArray(va: VertexArray) {
    this.bind.vertexArray = va
  }

}