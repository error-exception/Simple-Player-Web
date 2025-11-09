import {Color} from "../base/Color";
import {Nullable} from "../../type";
import {ShaderWrapper} from "../graphic/shader/ShaderWrapper";
import {BasicVertexBuffer} from "../graphic/buffer/BasicVertexBuffer";

/**
 * the additional info for drawing
 */
export class DrawInfo {

  public color: Nullable<Color> = null

  public alpha: number = 1;

  public index: number = 0;

  public shader: Nullable<ShaderWrapper> = null

  public buffer: Nullable<BasicVertexBuffer> = null

}