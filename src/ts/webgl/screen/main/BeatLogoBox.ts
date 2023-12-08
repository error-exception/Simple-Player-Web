import {Box} from "../../box/Box";
import {BeatState} from "../../../global/Beater";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {Logo} from "./Logo";
import {Ripples} from "./Ripples";
import {RoundVisualizer} from "./RoundVisualizer";
import {easeInCubic, easeOut, easeOutCubic, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import AudioPlayerV2 from "../../../player/AudioPlayer";
import {Time} from "../../../global/Time";
import {Vector, Vector2} from "../../core/Vector2";
import {LogoTriangles} from "./LogoTriangles";
import {MouseState} from "../../../global/MouseState";
import {Interpolation} from "../../util/Interpolation";
import {onEnterMenu} from "../../../global/GlobalState";
import {inject} from "../../util/DependencyInject";
import {Menu} from "../../menu/Menu";
import {BackgroundBounce} from "./MovableBackground";
import {effectScope, watch} from "vue";
import {UIState} from "../../../global/UISettings";
import AudioChannel from "../../../player/AudioChannel";
import {BeatBox} from "../../box/BeatBox";

class BeatLogo extends BeatBox {

    // @ts-ignore
    private readonly logo: Logo
    private readonly triangles: LogoTriangles

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        const logo = new Logo(gl, {
            size: [520, 520]
        })
        const triangles = new LogoTriangles(gl, {
            size: [500, 500]
        })
        this.logo = logo
        this.triangles = triangles
        this.add(
            triangles,
            logo
        )
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatState.isAvailable) {
            return;
        }
        const volume = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() + 0.4 : 0
        const adjust = Math.min(volume, 1)
        this.scaleBegin()
            .to(Vector(1 - adjust * 0.02), 60, easeOut)
            .to(Vector(1), gap * 2, easeOutQuint)

        this.triangles.velocityBegin()
            .transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut)
            .transitionTo(0, gap * 2, easeOutQuint)

        if (BeatState.isKiai) {
            this.triangles.lightBegin()
                .transitionTo(0.2, 60, easeOut)
                .transitionTo(0, gap * 2, easeOutQuint)
        }
    }

    public dispose() {
        super.dispose();
    }

}

class LogoBeatBox extends Box {

    private readonly beatLogo: BeatLogo

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.beatLogo = new BeatLogo(gl, config)
        this.add(
            this.beatLogo
        )
    }

    protected onUpdate() {
        if (AudioPlayerV2.isPlaying()) {
            // if (BeatState.isAvailable) {
                const scale = this.scale
                const adjust = AudioPlayerV2.isPlaying() ? AudioChannel.maxVolume() - 0.4 : 0
                const a = Interpolation.damp(
                    scale.x,
                    1 - Math.max(0, adjust) * 0.04,
                    0.94,
                    Time.elapsed
                )
                scale.x = a
                scale.y = a
                this.scale = scale
            // }
        }
    }

}

class LogoAmpBox extends Box {

    private readonly visualizer: RoundVisualizer
    private readonly logoBeatBox: LogoBeatBox
    private logoHoverable = false
    private scope = effectScope()

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.visualizer = new RoundVisualizer(gl, { size: ['fill-parent', 'fill-parent'] })
        const ripple = new Ripples(gl, {
            size: [500, 500]
        })
        this.logoBeatBox = new LogoBeatBox(gl, config)

        this.add(
          this.visualizer,
          ripple,
          this.logoBeatBox
        )
        this.scope.run(() => {
            watch(() => UIState.logoHover, val => this.logoHoverable = val, { immediate: true })
        })
    }

    public onHover(): boolean {
        if (!this.logoHoverable) {
            return true
        }
        this.scaleBegin()
            .to(new Vector2(1.1, 1.1), 500, easeOutElastic)
        return true
    }

    public onHoverLost(): boolean {
        if (!this.logoHoverable) {
            return true
        }
        this.scaleBegin()
            .to(new Vector2(1, 1), 500, easeOutElastic)
        return true
    }

    public dispose() {
        super.dispose();
        this.scope.stop()
    }
}

export class LogoBounceBox extends Box {

    private readonly logoAmpBox: LogoAmpBox
    private isDraggable = true
    private scope = effectScope()

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.logoAmpBox = new LogoAmpBox(gl, { size: config.size })
        this.add(this.logoAmpBox)
        this.scope.run(() => {
            watch(() => UIState.logoDrag, value => {
                this.isDraggable = value
            }, { immediate: true })
        })
    }

    private flag = false
    private startPosition = Vector2.newZero()
    public onDrag(which: number): boolean {
        if (!this.isDraggable) {
            return true
        }
        const position = MouseState.position
        if (!this.flag) {
            this.flag = true
            this.startPosition.x = MouseState.position.x
            this.startPosition.y = MouseState.position.y
        }
        let translateX = position.x - this.startPosition.x
        let translateY = position.y - this.startPosition.y
        translateX = Math.sqrt(Math.abs(translateX)) * (translateX < 0 ? -1 : 1)
        translateY = Math.sqrt(Math.abs(translateY)) * (translateY < 0 ? -1 : 1)
        this.translate = Vector(translateX, translateY)
        return true
    }

    public onDragLost(which: number): boolean {
        if (!this.isDraggable) {
            return true
        }
        this.flag = false
        this.translateBegin()
            .translateTo(new Vector2(0, 0), 600, easeOutElastic)
        return true
    }

    public dispose() {
        super.dispose();
        this.scope.stop()
    }
}

export class BeatLogoBox extends Box {

    private readonly logoBounceBox: Box

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.logoBounceBox = new LogoBounceBox(gl, { size: config.size })
        this.add(this.logoBounceBox)
    }

    private flag = true
    public onClick(which: number): boolean {
        const menu = inject<Menu>('Menu')
        const bg = inject<BackgroundBounce>('BackgroundBounce')

        if (this.flag) {
            this.translateBegin()
                .translateTo(new Vector2(-240, 0), 400, easeInCubic)
            this.scaleBegin()
                .to(new Vector2(0.5, 0.5), 400, easeInCubic)
            menu.show()
            bg.in()
        } else {
            this.translateBegin()
                .translateTo(new Vector2(0, 0), 400, easeOutCubic)
            this.scaleBegin()
                .to(new Vector2(1, 1), 400, easeOutCubic)
            menu.hide()
            bg.out()
        }
        const v = this.flag
        onEnterMenu.emit(v)
        this.flag = !this.flag
        return true
    }

}