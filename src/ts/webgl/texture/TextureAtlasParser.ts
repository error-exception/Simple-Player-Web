import {TextureAtlas, TextureRegin} from "./TextureAtlas";
import type {Nullable} from "../../type";

export class TextureAtlasParser {

  public static parse(
    gl: WebGL2RenderingContext,
    content: string,
    image: TexImageSource
  ): Nullable<TextureAtlas> {
    const lines = content.split("\n").map(v => v.trimEnd())
    let regin: Nullable<TextureRegin> = null

    const atlas = new TextureAtlas(gl, image)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith(' ')) {
        const [prop, value] = line.split(':').map(v => v.trim())
        if (regin !== null) {
          if (prop === 'x') {
            regin.topLeft.x = parseFloat(value)
          } else if (prop === 'y') {
            regin.topLeft.y = parseFloat(value)
          } else if (prop === 'width') {
            regin.size.x = parseFloat(value)
          } else if (prop === 'height') {
            regin.size.y = parseFloat(value)
          }
        }
      } else {
        regin = new TextureRegin(line.trim())
        atlas.addRegin(regin)
      }
    }
    atlas.initRegin()
    return atlas
  }
}