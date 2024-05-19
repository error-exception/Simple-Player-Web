import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "../../box/Box";
import {Flashlight} from "./Flashlight";
import {Menu} from "../../menu/Menu";
import {Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {StarSmoke} from "./StarSmoke";
import {effectScope, watch} from "vue";
import {UIState} from "../../../global/UISettings";

export class MainScreen extends Box {

    private leftSideCollector = (value: boolean) => {
        const translate = value ? new Vector2(40, 0) : Vector2.newZero()
        this.transform().moveTo(translate, 500, easeOutCubic)
        // this.translateBegin()
        //     .translateTo(translate, 500, easeOutCubic)
    }

    private rightSideCollector = (value: boolean) => {
        const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
        this.transform().moveTo(translate, 500, easeOutCubic)
        // this.translateBegin()
        //     .translateTo(translate, 500, easeOutCubic)
    }

    private scope = effectScope()

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent'],
        });
        const menu = new Menu(gl)
        const beatLogo = new BeatLogoBox(gl, { size: [520, 520] })
        const flashlight = new Flashlight(gl, { size: ['fill-parent', 'fill-parent'] })
        let smoke = new StarSmoke(gl)
        this.add(
            menu,
            flashlight,
            beatLogo,
            smoke
        )
        onLeftSide.collect(this.leftSideCollector)
        onRightSide.collect(this.rightSideCollector)
        this.scope.run(() => {
            watch(() => UIState.starSmoke, value => {
                smoke.isVisible = value
            }, { immediate: true })

        })
    }

    public dispose(): void {
        super.dispose()
        onLeftSide.removeCollect(this.leftSideCollector)
        onRightSide.removeCollect(this.rightSideCollector)
        this.scope.stop()
    }

}