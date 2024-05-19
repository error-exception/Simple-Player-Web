import {Texture} from "../../core/Texture";
import {Nullable} from "../../../type";
import {Disposable} from "../../core/Disposable";

class StoryTextureManager implements Disposable {

  private textureMap = new Map<string, Texture>()

  public addIf(gl: WebGL2RenderingContext, name: string, imageBitmap: ImageBitmap, format: number) {
    if (this.textureMap.has(name)) {
      return
    }
    const texture = new Texture(gl)
    texture.setTextureImage(imageBitmap, format)
    this.textureMap.set(name, texture)
  }

  private currentBondedTexture: Nullable<Texture> = null

  public tryBind(name: string, slot: GLenum = 0) {
    try {
      const texture = this.textureMap.get(name)!
      if (this.currentBondedTexture === texture) {
        return
      }
      if (this.currentBondedTexture) {
        this.currentBondedTexture.unbind()
      }
      texture.bind(slot)
      this.currentBondedTexture = texture
    } catch (e) {
      console.error("texture bind error", name)
      throw new Error()
    }
  }

  public dispose() {
    if (this.currentBondedTexture) {
      this.currentBondedTexture.unbind()
    }
    this.currentBondedTexture = null
    this.textureMap.forEach(v => v.dispose())
    this.textureMap.clear()
  }

}

export default new StoryTextureManager()