import {Box} from "../../box/Box";

export class StoryboardScreen extends Box {

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
  }

}