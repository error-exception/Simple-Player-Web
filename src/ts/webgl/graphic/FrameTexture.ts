import {FrameBuffer} from "./core/FrameBuffer";
import {Texture} from "./core/Texture";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Vector2} from "./core/Vector2";
import {almostEquals} from "./core/Utils";
import type {Bindable} from "./core/Bindable";
import type {Disposable} from "./core/Disposable";
import type {Nullable} from "../../type";
import {Coordinate2} from "../base/Coordinate2";
import { vector2 } from "./matrix/vec2";

/**
 * @deprecated
 */
export class FrameTexture implements Bindable, Disposable {

  public frameBuffer: FrameBuffer;
  public texture: Nullable<Texture> = null;

  constructor(private renderer: WebGLRenderer) {
    this.frameBuffer = new FrameBuffer(renderer.gl)
  }

  private isSizeChanged = true
  private size = vector2.create()

  public setSize(width: number, height: number) {
    this.setWidth(width)
    this.setHeight(height)
  }

  public setHeight(height: number) {
    const size = this.size
    if (almostEquals(size[1], height)) {
      return
    }
    this.isSizeChanged = true
    this.size[1] = height
  }

  public setWidth(width: number) {
    const size = this.size
    if (almostEquals(size[0], width)) {
      return
    }
    this.isSizeChanged = true
    size[0] = width
  }

  public setTexture(texture: Texture) {
    this.texture = texture
    this.isSizeChanged = true
  }

  private oldViewportSize = vector2.create()
  public bind() {
    const texture = this.texture
    if (texture == null) {
      throw new Error('Cannot bind, because texture is null')
    }
    const frameBuffer = this.frameBuffer
    const renderer = this.renderer
    renderer.pushFrameBuffer(frameBuffer)
    renderer.bindTexture(texture)
    vector2.copy(this.oldViewportSize, Coordinate2.size)
    // this.oldViewportSize.setFrom(Coordinate2.size)
    Coordinate2.setViewport(this.size[0], this.size[1])
    const resolution = Coordinate2.resolution
    if (this.isSizeChanged) {
      texture.setTextureSize(resolution[0], resolution[1])
      this.isSizeChanged = false
    }
    frameBuffer.setTexture(texture)
    renderer.unbindTexture(texture)
    renderer.setViewport(0, 0, resolution[0], resolution[1])
  }

  public unbind() {
    const renderer = this.renderer
    renderer.popFrameBuffer()
    Coordinate2.setViewport(this.oldViewportSize[0], this.oldViewportSize[1])
    renderer.setViewport(0, 0, Coordinate2.resolution[0], Coordinate2.resolution[1])
  }

  public dispose() {
    this.frameBuffer.dispose()
    this.texture?.dispose()
  }

}