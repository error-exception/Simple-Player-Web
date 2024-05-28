import {DefaultShaderWrapper} from "./DefaultShaderWrapper";
import {SimpleShaderWrapper} from "./SimpleShaderWrapper";
import {RoundClipShaderWrapper} from "./RoundClipShaderWrapper";
import {WhiteShaderWrapper} from "./WhiteShaderWrapper";
import {AlphaTextureShaderWrapper} from "./AlphaTextureShaderWrapper";

export class Shaders {

  public static Default: DefaultShaderWrapper
  public static Simple: SimpleShaderWrapper
  public static RoundClip: RoundClipShaderWrapper
  public static White: WhiteShaderWrapper
  public static AlphaTexture: AlphaTextureShaderWrapper

  public static init(gl: WebGL2RenderingContext) {
    this.Default = new DefaultShaderWrapper(gl)
    this.RoundClip = new RoundClipShaderWrapper(gl)
    this.Simple = new SimpleShaderWrapper(gl)
    this.White = new WhiteShaderWrapper(gl)
    this.AlphaTexture = new AlphaTextureShaderWrapper(gl)
  }

}