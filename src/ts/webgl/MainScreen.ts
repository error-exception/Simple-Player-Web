import BackgroundLoader from "../BackgroundLoader";
import { MouseState } from "../MouseState";
import { init } from "../Utils";
import OSUPlayer, { OSUBackground } from "../player/OSUPlayer";
import { BeatLogoBox } from "./BeatLogoBox";
import { Box } from "./Box";
import Coordinate from "./Coordinate";
import { Flashlight } from "./Flashlight";
import { Background } from "./MovableBackground";
import { Vector2, createV2 } from "./core/Vector2";
import { Axis } from "./layout/Axis";

export class MainScreen extends Box {

    private readonly background: Background

    private readonly collector = (bg: OSUBackground) => {
        if (bg.image) {
            // this.post(() => {
                this.background.isVisible = true;
                this.background.updateBackground2(bg.image!);
            // });
        } else {
            // this.post(() => {
                this.background.isVisible = true;
                this.background.updateBackground2(
                    BackgroundLoader.getBackground()
                );
            // });
        }

        console.log(bg);
    }

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent'],
        });
        // this.size = createV2(Coordinate.width, Coordinate.height)
        // this.anchor = Axis.X_CENTER | Axis.Y_CENTER
        // const beatLogo = new BeatLogoBox(gl, {
        //     width: 520,
        //     height: 520,
        //     horizontal: "center",
        //     vertical: "center"
        // })
        const beatLogo = new BeatLogoBox(gl, { size: [520, 520] })
        const background = new Background(gl, OSUPlayer.background.value.image)
        this.background = background
        const flashlight = new Flashlight(gl, { size: ['fill-parent', 'fill-parent'] })
        OSUPlayer.background.collect(this.collector)
        this.add(
            background,
            flashlight,
            beatLogo
        )
    }

    protected onUpdate() {
        super.onUpdate();
        const {x, y} = MouseState.position
        // const transX = (x - window.innerWidth / 2)
        // const transY = (window.innerHeight / 2 - y)
        this.background.translate = new Vector2(x, y)
    }

    public dispose(): void {
        super.dispose()
        OSUPlayer.background.removeCollect(this.collector);
    }

}