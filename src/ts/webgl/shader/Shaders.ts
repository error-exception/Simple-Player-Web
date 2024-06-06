import {DefaultShaderWrapper} from "./DefaultShaderWrapper";
import {SimpleShaderWrapper} from "./SimpleShaderWrapper";
import {RoundClipShaderWrapper} from "./RoundClipShaderWrapper";
import {WhiteShaderWrapper} from "./WhiteShaderWrapper";
import {AlphaTextureShaderWrapper} from "./AlphaTextureShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {LegacyVisualizerShaderWrapper} from "./LegacyVisualizerShaderWrapper";
import {StoryShaderWrapper} from "./StoryShaderWrapper";

export class Shaders {

  public static Default: DefaultShaderWrapper
  public static Simple: SimpleShaderWrapper
  public static RoundClip: RoundClipShaderWrapper
  public static White: WhiteShaderWrapper
  public static AlphaTexture: AlphaTextureShaderWrapper
  public static LegacyVisualizer: LegacyVisualizerShaderWrapper
  public static StoryDefault: StoryShaderWrapper

  public static init(renderer: WebGLRenderer) {
    this.Default = new DefaultShaderWrapper(renderer)
    this.RoundClip = new RoundClipShaderWrapper(renderer)
    this.Simple = new SimpleShaderWrapper(renderer)
    this.White = new WhiteShaderWrapper(renderer)
    this.AlphaTexture = new AlphaTextureShaderWrapper(renderer)
    this.LegacyVisualizer = new LegacyVisualizerShaderWrapper(renderer)
    this.StoryDefault = new StoryShaderWrapper(renderer)
  }

  public static dispose() {
    this.Default.dispose()
    this.Simple.dispose()
    this.RoundClip.dispose()
    this.White.dispose()
    this.AlphaTexture.dispose()
    this.LegacyVisualizer.dispose()
    this.StoryDefault.dispose()
  }

}