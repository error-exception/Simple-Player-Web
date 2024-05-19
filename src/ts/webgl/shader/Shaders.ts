import {Disposable} from "../core/Disposable";
import {Shader} from "../core/Shader";
import {BindGroup} from "../BindGroup";

export class Shaders implements Disposable {

  private static shaderMap = new Map<string, Shader>()

  public static add(name: string, shader: Shader) {
    if (this.shaderMap.has(name)) {
      return
    }
    this.shaderMap.set(name, shader)
  }

  public static bind(name: string) {
    const shader = this.shaderMap.get(name)
    if (!shader) {
      return
    }
    BindGroup.bind(shader)
  }

  public static dispose() {
    this.shaderMap.forEach(v => {
      BindGroup.unbind(v)
      v.dispose()
    })
  }
}