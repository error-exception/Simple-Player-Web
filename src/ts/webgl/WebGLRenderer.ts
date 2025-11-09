import type { Nullable } from "../type";
import { ArrayStack } from "../util/Stack";
import { RenderScheduler } from "./RenderScheduler";
import Coordinate from "./base/Coordinate";
import { Coordinate2 } from "./base/Coordinate2";
import { Canvas } from "./canvas/Canvas";
import { Blend } from "./drawable/Blend";
import type { Bindable } from "./graphic/core/Bindable";
import { Disposable } from "./graphic/core/Disposable";
import type { FrameBuffer } from "./graphic/core/FrameBuffer";
import type { IndexBuffer } from "./graphic/core/IndexBuffer";
import type { Shader } from "./graphic/core/Shader";
import type { Texture } from "./graphic/core/Texture";
import { isUndef } from "./graphic/core/Utils";
import type { VertexArray } from "./graphic/core/VertexArray";
import type { VertexBuffer } from "./graphic/core/VertexBuffer";
import { TextureStore } from "./graphic/texture/TextureStore";
import { RootView } from "./view/RootView";
import { SizeMode } from "./view/View";
import { LegacyLogo } from './screen/legacy/LegacyLogo';
import { Shaders } from "./graphic/shader/Shaders";
import { color } from "./base/Color";

export class WebGLRenderer implements Disposable {

  private shaderStack = new ArrayStack<Shader>()
  private vertexArrayStack = new ArrayStack<VertexArray>()
  private indexBufferStack = new ArrayStack<IndexBuffer>()
  private vertexBufferStack = new ArrayStack<VertexBuffer>()
  private frameBufferStack = new ArrayStack<FrameBuffer>()
  private orthStack = new ArrayStack<Float32Array>()

  private currentBoundedTexture: Nullable<Texture> = null

  private currentBoundedTextureMap: Map<Texture, number> = new Map()
  private readonly textureUnits: Nullable<Texture>[]

  private isViewportChanged: boolean = true

  public onDispose: Nullable<() => void> = null

  public readonly gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    console.log("Max vertex attributes: " + maxVertexAttribs);

    const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    console.log("Max vertex uniform vectors: " + maxVertexUniformVectors);

    const maxVertexAttribStride = gl.getParameter(gl.MAX_ELEMENTS_VERTICES);
    console.log("Max elements vertices : " + maxVertexAttribStride);

    const maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    console.log('Max texture units: ' + maxTextureUnits);
    this.textureUnits = new Array<Nullable<Texture>>(maxTextureUnits)

    Coordinate2.onWindowResize.add(() => {
      this.isViewportChanged = true
    })
    Coordinate.onWindowResize = () => {
      this.isViewportChanged = true
    }
  }

  private currentBlend = Blend.Normal
  public setBlend(blend: Blend) {
    if (this.currentBlend === blend) {
      return
    }
    const gl = this.gl
    if (blend === Blend.Normal) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else if (blend === Blend.Additive) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    }
    this.currentBlend = blend
  }

  private pushBindable(stack: ArrayStack<Bindable & Disposable>, bindable: Bindable & Disposable) {
    const previous = stack.peek()
    stack.push(bindable)
    if (previous !== bindable) {
      bindable.bind()
    }
  }

  private popBindable(stack: ArrayStack<Bindable>) {
    const current = stack.pop()
    const previous = stack.peek()
    if (current !== previous) {
      previous?.bind()
    }
    if (stack.size === 0) {
      current?.unbind()
    }
  }

  public pushShader(shader: Shader): void {
    this.pushBindable(this.shaderStack, shader)
  }

  public popShader() {
    this.popBindable(this.shaderStack)
  }

  public pushVertexArray(va: VertexArray) {
    this.pushBindable(this.vertexArrayStack, va)
  }

  public popVertexArray() {
    this.popBindable(this.vertexArrayStack)
  }

  public pushVertexBuffer(vb: VertexBuffer) {
    this.pushBindable(this.vertexBufferStack, vb)
  }

  public popVertexBuffer() {
    this.popBindable(this.vertexArrayStack)
  }

  // TODO: use texture unit to bind texture, to support multi-texture and batch rendering
  public bindTexture(texture: Texture, unit: number = 0) {
    const textureUnits = this.textureUnits
    if (textureUnits[unit] !== texture) {
      texture.bind(unit)
      textureUnits[unit] = texture
      this.currentBoundedTextureMap.set(texture, unit)
    }
  }

  public unbindTexture(texture: Texture) {
    const unit = this.currentBoundedTextureMap.get(texture)
    if (isUndef(unit)) return
    texture.unbind()
    this.textureUnits[unit] = null
    this.currentBoundedTextureMap.delete(texture)
  }

  public pushIndexBuffer(ib: IndexBuffer) {
    this.pushBindable(this.indexBufferStack, ib)
  }

  public popIndexBuffer() {
    this.popBindable(this.indexBufferStack)
  }

  public pushFrameBuffer(fb: FrameBuffer) {
    this.pushBindable(this.frameBufferStack, fb)
  }

  public popFrameBuffer() {
    this.popBindable(this.frameBufferStack)
  }

  public pushOrth(orth: Float32Array) {
    this.orthStack.push(orth)
  }

  public popOrth() {
    this.orthStack.pop()
  }

  public currentOrth(): Float32Array {
    return this.orthStack.peek() ?? Coordinate2.orthographicProjectionMatrix4
  }

  public disposeBounded() {
    this.currentBoundedTexture?.unbind()
    this.currentBoundedTexture?.dispose()
    this.textureUnits.forEach(v => v?.dispose())
    this.currentBoundedTextureMap.clear()
  }

  /**
   * 
   * @param x 
   * @param y 
   * @param width 
   * @param height 
   */
  public setViewport(x: number, y: number, width: number, height: number) {
    this.gl.viewport(x, y, width, height);
  }

  public clear() {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
  }

  public updateViewport() {
    if (this.isViewportChanged) {
      this.isViewportChanged = false
      const resolution = Coordinate2.resolution
      this.setViewport(0, 0, resolution[0], resolution[1])
      this.root.onWindowResize()
    }
  }

  public root = new RootView().apply((t) => {
    t.size = SizeMode.fill();
  })

  private canvas: Nullable<Canvas> = null

  public renderView() {
    this.updateViewport()
    this.clear()
    let canvas = this.canvas
    if (!canvas) {
      canvas = new Canvas(this)
      this.canvas = canvas
    }
    
    this.root.update()
    this.root.draw(canvas)
    RenderScheduler.executeDispose()
  }


  public dispose() {
    // dispose current bounded resource
    this.disposeBounded()
    // dispose all previous bounded resource
    this.disposeStack()
    this.onDispose?.()
    this.onDispose = null
    // dispose root view
    this.root.dispose()
  }

  private disposeStack() {
    const callback = (e: Bindable & Disposable): void => e.dispose()
    this.shaderStack.forEach(callback)
    this.vertexArrayStack.forEach(callback)
    this.vertexBufferStack.forEach(callback)
    this.indexBufferStack.forEach(callback)
    this.frameBufferStack.forEach(callback)
  }

}