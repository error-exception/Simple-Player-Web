import BackgroundLoader from "../../../global/BackgroundLoader";
import {MouseState} from "../../../global/MouseState";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "../../box/Box";
import {Flashlight} from "./Flashlight";
import {BackgroundBounce} from "./MovableBackground";
import {Menu} from "../../menu/Menu";
import {Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {StarSmoke} from "./StarSmoke";

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
        const smoke = new StarSmoke(gl)
        OSUPlayer.background.collect(this.collector)
        this.add(
            background,
            menu,
            flashlight,
            beatLogo,
            smoke
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