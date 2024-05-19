import {Texture} from "../core/Texture";
import {Disposable} from "../core/Disposable";
import {BindGroup} from "../BindGroup";

export class TextureGroup implements Disposable {

  private textureMap: Map<string, Texture> = new Map()

  public addTexture(gl:WebGL2RenderingContext, name: string, imageBitmap: ImageBitmap) {
    let texture = this.textureMap.get(name);
    if (texture) return
    texture = new Texture(gl)
    texture.setTextureImage(imageBitmap)
    this.textureMap.set(name, texture)

  }

  public bind(name: string) {
    const texture = this.textureMap.get(name)
    if (!texture) return false
    BindGroup.bind(texture)
    return true;
  }

  public dispose() {
    this.textureMap.forEach(value => {
      BindGroup.unbind(value)
      value.dispose()
    })
    this.textureMap.clear()
  }

}