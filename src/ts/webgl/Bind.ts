import {Bindable} from "./core/Bindable";
import {VertexArray} from "./core/VertexArray";
import {Nullable} from "../type";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {Texture} from "./core/Texture";
import {IndexBuffer} from "./core/IndexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";

export class Bind {

  public static currentBoundedVertexArray: Nullable<VertexArray> = null
  public static currentBoundedShader: Nullable<Shader> = null
  public static currentBoundedVertexBuffer: Nullable<VertexBuffer> = null
  public static currentBoundedTexture: Nullable<Texture> = null
  public static currentBoundedIndexBuffer: Nullable<IndexBuffer> = null

  public vertexArray: Nullable<VertexArray> = null
  public shader: Nullable<Shader> = null
  public layout: Nullable<VertexBufferLayout> = null
  public vertexBuffer: Nullable<VertexBuffer> = null
  public indexBuffer: Nullable<IndexBuffer> = null
  public texture: Nullable<Texture> = null

  public bindAll() {
    if (this.vertexBuffer) Bind.bind(this.vertexBuffer)
    if (this.texture) Bind.bind(this.texture)
    if (this.shader) Bind.bind(this.shader)
    if (this.indexBuffer) Bind.bind(this.indexBuffer)
    if (this.vertexArray) Bind.bind(this.vertexArray)
  }

  // TODO: 增加返回值，当返回 false 时，表示要绑定的对象已经绑定。当返回 true 时，表示绑定已更改
  public static bind(bindable: Bindable) {
    if (bindable instanceof VertexBuffer) {
      const vertexBuffer = Bind.currentBoundedVertexBuffer
      if (bindable === vertexBuffer) {
        return false
      }
      bindable.bind()
      Bind.currentBoundedVertexBuffer = bindable
      return true
    } else if (bindable instanceof Texture) {
      const texture = Bind.currentBoundedTexture
      if (bindable === texture) {
        return false;
      }
      bindable.bind()
      Bind.currentBoundedTexture = bindable
      return true
    } else if (bindable instanceof Shader) {
      const shader = Bind.currentBoundedShader
      if (bindable === shader) {
        return false;
      }
      bindable.bind()
      Bind.currentBoundedShader = bindable
      return true
    } else if (bindable instanceof IndexBuffer) {
      const indexBuffer = Bind.currentBoundedIndexBuffer
      if (bindable === indexBuffer) {
        return false;
      }
      bindable.bind()
      Bind.currentBoundedIndexBuffer = bindable
      return true
    } else if (bindable instanceof VertexArray) {
      const vertexArray = Bind.currentBoundedVertexArray
      if (bindable === vertexArray) {
        return false;
      }
      bindable.bind()
      Bind.currentBoundedVertexArray = bindable
      return true
    } else {
      throw new Error("cannot bind this " + bindable)
    }
  }

  // TODO: 增加返回值，当返回 true 时，表示当前可解邦，并已解绑，当返回 false 时，表示与当前绑定的对象不同，不做任何操作
  public static unbind(bindable: Bindable) {
    if (bindable instanceof VertexBuffer) {
      if (Bind.currentBoundedVertexBuffer === bindable) {
        bindable.unbind()
        Bind.currentBoundedVertexBuffer = null
        return true
      }
      return false
    } else if (bindable instanceof Texture) {
      if (Bind.currentBoundedTexture === bindable) {
        bindable.unbind()
        Bind.currentBoundedTexture = null
        return true
      }
      return false
    } else if (bindable instanceof Shader) {
      if (Bind.currentBoundedShader === bindable) {
        bindable.unbind()
        Bind.currentBoundedShader = null
        return true
      }
      return false
    } else if (bindable instanceof IndexBuffer) {
      if (Bind.currentBoundedIndexBuffer === bindable) {
        bindable.unbind()
        Bind.currentBoundedIndexBuffer = null
        return true
      }
      return false
    } else if (bindable instanceof VertexArray) {
      if (Bind.currentBoundedVertexArray === bindable) {
        bindable.unbind()
        Bind.currentBoundedVertexArray = null
        return true
      }
      return false
    } else {
      throw new Error("cannot unbind this " + bindable)
    }
  }

  public static unbindCurrentTexture() {
    this.currentBoundedTexture && this.unbind(this.currentBoundedTexture)
  }
  public static unbindCurrentVertexBuffer() {
    this.currentBoundedVertexBuffer && this.unbind(this.currentBoundedVertexBuffer)
  }
  public static unbindCurrentShader() {
    this.currentBoundedShader && this.unbind(this.currentBoundedShader)
  }
  public static unbindCurrentVertexArray() {
    this.currentBoundedVertexArray && this.unbind(this.currentBoundedVertexArray)
  }
  public static unbindCurrentIndexBuffer() {
    this.currentBoundedIndexBuffer && this.unbind(this.currentBoundedIndexBuffer)
  }


  public copy() {
    const group = new Bind()
    group.layout = this.layout
    group.vertexArray = this.vertexArray
    group.shader = this.shader
    group.indexBuffer = this.indexBuffer
    group.vertexBuffer = this.vertexBuffer
    group.texture = this.texture
  }

}

export const commonBindGroup: Bind = new Bind()