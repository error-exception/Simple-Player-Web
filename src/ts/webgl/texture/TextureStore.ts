import {Texture} from "../core/Texture";
import {TextureAtlasParser} from "./TextureAtlasParser";
import type {TextureAtlas} from "./TextureAtlas";
import type {ImageName} from "../util/ImageResourceMap";

export type TextureKey = ImageName |
  "Gradiant" |
  "VerticalGradiant"

export type TextureAtlasKey = string |
  "Icon-Atlas"

export class TextureStore {

  private static map = new Map<string, Texture | TextureAtlas>()
  private static gl: WebGL2RenderingContext
  public static add(gl: WebGL2RenderingContext, name: string, source: TexImageSource) {
    this.gl = gl
    const texture = new Texture(gl, source)
    this.map.set(name, texture)
  }

  public static addTexture(name: TextureKey, texture: Texture) {
    this.map.set(name, texture)
  }

  public static get(name: TextureKey): Texture {
    return this.map.get(name) as Texture
  }

  public static getAtlas(name: TextureAtlasKey): TextureAtlas {
    return this.map.get(name) as TextureAtlas
  }

  public static create(image?: TexImageSource) {
    return new Texture(this.gl, image)
  }

  public static async addTextureAtlas(name: TextureAtlasKey, atlasUrl: string, image: TexImageSource, isUrl: boolean = true) {
    let text: string
    if (isUrl) {
      const response = await fetch(atlasUrl)
      text = await response.text()
    } else {
      text = atlasUrl
    }
    const atlas = TextureAtlasParser.parse(this.gl, text, image);
    if (atlas) {
      this.map.set(name, atlas)
    } else {
      throw new Error(`add texture atlas failed, name=${name}, url=${atlasUrl}`)
    }
  }

  public static dispose() {
    this.map.forEach(v => v.dispose())
  }

}