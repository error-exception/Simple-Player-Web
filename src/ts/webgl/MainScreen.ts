import BackgroundLoader from "../BackgroundLoader";
import {MouseState} from "../MouseState";
import OSUPlayer, {OSUBackground} from "../player/OSUPlayer";
import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "./Box";
import {Flashlight} from "./Flashlight";
import {BackgroundBounce} from "./MovableBackground";
import {Menu} from "./menu/Menu";
import {Vector2} from "./core/Vector2";
import {easeOutCubic} from "../util/Easing";
import {onLeftSide, onRightSide} from "../GlobalState";

export class MainScreen extends Box {

    private readonly background: BackgroundBounce

    private leftSideCollector = (value: boolean) => {
        const translate = value ? new Vector2(40, 0) : Vector2.newZero()
        this.translateBegin()
            .translateTo(translate, 500, easeOutCubic)
    }

    private rightSideCollector = (value: boolean) => {
        const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
        this.translateBegin()
            .translateTo(translate, 500, easeOutCubic)
    }

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

        // console.log(bg);
    }

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent'],
        });
        const menu = new Menu(gl)
        const beatLogo = new BeatLogoBox(gl, { size: [520, 520] })
        const background = new BackgroundBounce(gl, OSUPlayer.background.value.image)
        this.background = background
        const flashlight = new Flashlight(gl, { size: ['fill-parent', 'fill-parent'] })
        OSUPlayer.background.collect(this.collector)
        this.add(
            background,
            menu,
            flashlight,
            beatLogo
        )


        onLeftSide.collect(this.leftSideCollector)
        onRightSide.collect(this.rightSideCollector)
    }

    protected onUpdate() {
        super.onUpdate();
        this.background.background.translate = MouseState.position.copy()
    }

    public dispose(): void {
        super.dispose()
        OSUPlayer.background.removeCollect(this.collector);
        onLeftSide.removeCollect(this.leftSideCollector)
        onRightSide.removeCollect(this.rightSideCollector)
    }

}