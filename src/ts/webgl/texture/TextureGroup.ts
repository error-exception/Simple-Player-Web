import {Texture} from "../core/Texture";
import {Disposable} from "../core/Disposable";
import {Bind} from "../Bind";

export class TextureGroup implements Disposable {

  private textureMap: Map<string, Texture> = new Map()

  public addTexture(gl:WebGL2RenderingContext, name: string, image: TexImageSource) {
    let texture = this.textureMap.get(name);
    if (texture) return
    texture = new Texture(gl, image)
    this.textureMap.set(name, texture)

  }

  public bind(name: string) {
    const texture = this.textureMap.get(name)
    if (!texture) return false
    Bind.bind(texture)
    return true;
  }

  public dispose() {
    this.textureMap.forEach(value => {
      Bind.unbind(value)
      value.dispose()
    })
    this.textureMap.clear()
  }

}