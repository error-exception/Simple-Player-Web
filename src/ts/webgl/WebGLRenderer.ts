import {Drawable} from "./drawable/Drawable";
import {Disposable} from "./core/Disposable";
import {MouseState} from "../global/MouseState";
import Coordinate from "./base/Coordinate";
import type {VertexBuffer} from "./core/VertexBuffer";
import type {Texture} from "./core/Texture";
import {Blend} from "./drawable/Blend";
import type {IndexBuffer} from "./core/IndexBuffer";
import type {VertexArray} from "./core/VertexArray";
import type {Shader} from "./core/Shader";
import type {Nullable} from "../type";

export class WebGLRenderer implements Disposable {

  private currentBoundedShader: Nullable<Shader> = null
  private currentBoundedVertexBuffer: Nullable<VertexBuffer> = null
  private currentBoundedIndexBuffer: Nullable<IndexBuffer> = null
  private currentBoundedVertexArray: Nullable<VertexArray> = null
  private currentBoundedTexture: Nullable<Texture> = null

  private readonly drawables: Drawable[] = []
  private readonly disposables: Disposable[] = []
  private isViewportChanged: boolean = false
  private isEventReady: boolean = false

  public onDispose: Nullable<() => void> = null

  public readonly gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    console.log(Coordinate.resolution)
    console.log(Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
    gl.viewport(0, 0, Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    console.log("Max vertex attributes: " + maxVertexAttribs);

    const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    console.log("Max vertex uniform vectors: " + maxVertexUniformVectors);


    const maxVertexAttribStride = gl.getParameter(gl.MAX_ELEMENTS_VERTICES);
    console.log("Max elements vertices : " + maxVertexAttribStride);


    MouseState.onClick = this.onClick.bind(this)
    MouseState.onMouseMove = this.onMouseMove.bind(this)
    MouseState.onMouseDown = this.onMouseDown.bind(this)
    MouseState.onMouseUp = this.onMouseUp.bind(this)

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

  public bindShader(shader: Shader) {
    if (this.currentBoundedShader !== shader) {
      // console.log("bind shader", shader)
      shader.bind()
      this.currentBoundedShader = shader
    }
  }

  public unbindShader(shader: Shader) {
    if (this.currentBoundedShader === shader) {
      shader.unbind()
      this.currentBoundedShader = null
    }
  }

  public bindVertexArray(va: VertexArray) {
    if (this.currentBoundedVertexArray !== va) {
      // console.log("bind va", va)
      va.bind()
      this.currentBoundedVertexArray = va
    }
  }

  public unbindVertexArray(va: VertexArray) {
    if (this.currentBoundedVertexArray === va) {
      va.unbind()
      this.currentBoundedVertexArray = null
    }
  }

  public bindVertexBuffer(vb: VertexBuffer) {
    if (this.currentBoundedVertexBuffer !== vb) {
      // console.log("bind vb", vb)
      vb.bind()
      this.currentBoundedVertexBuffer = vb
    }
  }

  public unbindVertexBuffer(vb: VertexBuffer) {
    if (this.currentBoundedVertexBuffer === vb) {
      vb.unbind()
      this.currentBoundedVertexBuffer = null
    }
  }

  public bindTexture(texture: Texture, unit: number = 0) {
    if (this.currentBoundedTexture !== texture) {
      // console.log("bind texture", texture)
      texture.bind(unit)
      this.currentBoundedTexture = texture
    }
  }

  public unbindTexture(texture: Texture) {
    if (this.currentBoundedTexture === texture) {
      texture.unbind()
      this.currentBoundedTexture = null
    }
  }

  public bindIndexBuffer(ib: IndexBuffer) {
    if (this.currentBoundedIndexBuffer !== ib) {
      // console.log("bind ib", ib)
      ib.bind()
      this.currentBoundedIndexBuffer = ib
    }
  }

  public unbindIndexBuffer(ib: IndexBuffer) {
    if (this.currentBoundedIndexBuffer === ib) {
      ib.unbind()
      this.currentBoundedIndexBuffer = null
    }
  }

  public disposeBounded() {
    this.currentBoundedTexture?.unbind()
    this.currentBoundedShader?.dispose()
    this.currentBoundedShader?.unbind()
    this.currentBoundedShader?.dispose()
    this.currentBoundedVertexArray?.unbind()
    this.currentBoundedVertexArray?.dispose()
    this.currentBoundedVertexBuffer?.unbind()
    this.currentBoundedVertexBuffer?.dispose()
    this.currentBoundedIndexBuffer?.unbind()
    this.currentBoundedIndexBuffer?.dispose()
  }

  private onClick(which: number) {
    if (!this.isEventReady) return
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].click(which, MouseState.position)
    }
  }

  private onMouseDown(which: number) {
    if (!this.isEventReady) return
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseDown(which, MouseState.position)
    }
  }

  private onMouseMove() {
    if (!this.isEventReady) return
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseMove(MouseState.position)
    }
  }

  private onMouseUp(which: number) {
    if (!this.isEventReady) return
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseUp(which, MouseState.position)
    }
  }

  public addDrawable(drawable: Drawable) {
    this.drawables.push(drawable)
    drawable.load(this)
    this.disposables.push(drawable)
  }

  public removeDrawable(drawable: Drawable) {
    let index = this.drawables.indexOf(drawable)
    this.drawables.splice(index, 1)
    index = this.disposables.indexOf(drawable)
    this.disposables.splice(index, 1)
    drawable.dispose()
  }

  public render() {
    this.isEventReady = true
    const gl = this.gl
    if (this.isViewportChanged) {
      this.isViewportChanged = false
      gl.viewport(0, 0, Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
      console.log(Coordinate.resolution)
      console.log(Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
      for (let i = 0; i < this.drawables.length; i++) {
        this.drawables[i].onWindowResize()
      }
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];
      drawable.update()
      drawable.draw(this)
    }
  }

  public dispose() {
    for (let i = 0; i < this.disposables.length; i++) {
      this.disposables[i].dispose()
    }
    this.disposeBounded()
    this.onDispose?.()
    this.onDispose = null
  }

}