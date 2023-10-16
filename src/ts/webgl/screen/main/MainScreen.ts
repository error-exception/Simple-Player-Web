import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "../../box/Box";
import {Flashlight} from "./Flashlight";
import {Menu} from "../../menu/Menu";
import {Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {StarSmoke} from "./StarSmoke";

export class MainScreen extends Box {

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

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent'],
        });
        const menu = new Menu(gl)
        const beatLogo = new BeatLogoBox(gl, { size: [520, 520] })
        const flashlight = new Flashlight(gl, { size: ['fill-parent', 'fill-parent'] })
        const smoke = new StarSmoke(gl)
        this.add(
            menu,
            flashlight,
            beatLogo,
            smoke
        )
        onLeftSide.collect(this.leftSideCollector)
        onRightSide.collect(this.rightSideCollector)
    }

    public dispose(): void {
        super.dispose()
        onLeftSide.removeCollect(this.leftSideCollector)
        onRightSide.removeCollect(this.rightSideCollector)
    }

}