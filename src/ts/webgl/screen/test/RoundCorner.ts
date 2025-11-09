import {Drawable} from "../../drawable/Drawable";
import {type DrawNode} from "../../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../../graphic/shader/DefaultShaderWrapper";
import {type WebGLRenderer} from "../../WebGLRenderer";
import {QuadBuffer} from "../../graphic/buffer/QuadBuffer";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {Rectangle} from "../../graphic/shape/Rectangle";
import {Vector} from "../../graphic/core/Vector2";
import {Color} from "../../base/Color";
import {Coordinate2} from "../../base/Coordinate2";

export class RoundCorner extends Drawable {

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.setColor(Color.White)

    const node = this.drawNode
    node.vertexBuffer = new QuadBuffer(renderer, 7, renderer.gl.STREAM_DRAW)
    node.apply()
  }

  beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.color = this.computeColor()
    shader.sampler2D = 0
  }

  onDraw(node: DrawNode, renderer: WebGLRenderer) {
    const radius = 200
    const size = Vector(400)
    const texture = TextureStore.getTexture('WhiteRound')
    const cornerRect = new Rectangle()
    cornerRect.setWidth(radius)
    cornerRect.setHeight(radius)
    const rectangle = new Rectangle()
    // topLeft
    node.drawRect(cornerRect, undefined, 0)
    node.drawTexture(texture, Vector(0), Vector(0.5), 0)
    //topCenter
    rectangle.setWidth(size.x - radius * 2)
    rectangle.setHeight(radius)
    rectangle.setTopLeft(radius, 0)
    node.drawRect(rectangle, undefined, 1)
    node.drawTexture(texture, Vector(.5, 0), Vector(0.5), 1)
    //topRight
    cornerRect.setTopLeft(size.x - radius, 0)
    node.drawRect(cornerRect, undefined, 2)
    node.drawTexture(texture, Vector(.5, 0), Vector(1, .5), 2)
    //center
    rectangle.setWidth(size.x)
    rectangle.setHeight(size.y - radius * 2)
    rectangle.setTopLeft(0, radius)
    node.drawRect(rectangle, undefined, 3)
    node.drawTexture(texture, Vector(0, .5), Vector(1, 0.5), 3)

    //bottomLeft
    cornerRect.setTopLeft(0, size.y - radius)
    node.drawRect(cornerRect, undefined, 4)
    node.drawTexture(texture, Vector(0, .5), Vector(0.5, 1), 4)

    //bottomCenter
    rectangle.setWidth(size.x - radius * 2)
    rectangle.setHeight(radius)
    rectangle.setTopLeft(radius, size.y - radius)
    node.drawRect(rectangle, undefined, 5)
    node.drawTexture(texture, Vector(0.5), Vector(0.5, 1), 5)
    //bottomRight
    cornerRect.setTopLeft(size.x - radius, size.y - radius)
    node.drawRect(cornerRect, undefined, 6)
    node.drawTexture(texture, Vector(0.5), Vector(1), 6)
  }

}