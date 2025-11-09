import type { Canvas } from "../../canvas/Canvas";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { SizeMode, View } from "../../view/View";

export class MouseIndicator extends View {

    constructor() {
        super();
        this.isMouseEventEnabled = true;
        this.size = SizeMode.fill()
    }

    private mousePosition = vector2.create()

    public onMouseMove(event: MouseEvent): void {
        vector2.set(this.mousePosition, event.x, event.y)
    }

    public onDraw(canvas: Canvas): void {
        canvas.drawTexture(
            TextureStore.getTexture('Square'),
            this.mousePosition[0] - 10,
            this.mousePosition[1] - 10,
            20,
            20
        )
    }

}