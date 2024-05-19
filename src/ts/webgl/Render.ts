import {BindGroup} from "./BindGroup";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexArray} from "./core/VertexArray";

export class Render {

  private bindGroup = new BindGroup()

  public setVertexBuffer(vb: VertexBuffer) {
    this.bindGroup.vertexBuffer = vb
  }

  public setVertexArray(va: VertexArray) {
    this.bindGroup.vertexArray = va
  }

}