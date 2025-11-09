import type {Bindable} from "./Bindable";
import type {Disposable} from "./Disposable";
import type {Texture} from "./Texture";

export class FrameBuffer implements Bindable, Disposable {

  private readonly rendererId: WebGLFramebuffer

  constructor(private gl: WebGL2RenderingContext) {
    const buffer = gl.createFramebuffer()
    if (!buffer) {
      throw new Error('create frame buffer error')
    }
    this.rendererId = buffer
  }

  public bind(): void {
    const gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rendererId)
  }

  public setTexture(texture: Texture): void {
    const gl = this.gl;
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture.rendererId,
      0
    )
  }

  public unbind() {
    const gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  public dispose() {
    this.gl.deleteFramebuffer(this.rendererId)
  }

}