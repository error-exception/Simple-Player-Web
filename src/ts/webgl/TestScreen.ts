import { Box } from "./box/Box";
import { TestRoundDrawable } from "./TestRoundDrawable";
import { Axis } from "./drawable/Axis";

export class TestScreen extends Box {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent'],
            anchor: Axis.X_CENTER | Axis.Y_CENTER
        })
        const round = new TestRoundDrawable(gl)
        this.add(round)
    }

}