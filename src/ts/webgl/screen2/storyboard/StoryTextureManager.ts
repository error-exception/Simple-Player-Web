import { Disposable } from "../../graphic/core/Disposable";
import { Texture } from "../../graphic/core/Texture";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { RenderScheduler } from "../../RenderScheduler";

export class StoryTextureStore implements Disposable {

  private textureMap = new Map<string, Texture>()

  public addIfAbsent(name: string, imageBitmap: ImageBitmap, format: number) {
    if (this.textureMap.has(name)) {
      return
    }
    const texture = TextureStore.create()
    texture.setTextureImage(imageBitmap, format)
    this.textureMap.set(name, texture)
  }

  public getTexture(name: string): Texture | undefined {
    return this.textureMap.get(name)
  }

  public dispose() {
    const textureMap = this.textureMap
    textureMap.forEach(v => v.dispose())
    textureMap.clear()
  }

}