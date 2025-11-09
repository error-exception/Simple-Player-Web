import type {WebGLRenderer} from "../../WebGLRenderer";

export interface Loadable {

  load(renderer: WebGLRenderer): void

}