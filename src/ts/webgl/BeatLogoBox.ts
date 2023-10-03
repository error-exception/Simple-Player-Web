import {Box} from "./Box";
import {BeatDispatcher, BeatState, IBeat} from "../Beater";
import {BaseDrawableConfig} from "./Drawable";
import {Logo} from "./Logo";
import {Ripples} from "./Ripples";
import {RoundVisualizer} from "./RoundVisualizer";
import {easeInCubic, easeOut, easeOutCubic, easeOutElastic, easeOutQuint} from "../util/Easing";
import AudioPlayerV2 from "../player/AudioPlayer";
import {Time} from "../Time";
import {Vector2} from "./core/Vector2";
import {LogoTriangles} from "./LogoTriangles";
import {MouseState} from "../MouseState";
import {Interpolation} from "./Interpolation";
import {onEnterMenu} from "../GlobalState";
import {inject} from "./DependencyInject";
import {Menu} from "./menu/Menu";
import {BackgroundBounce} from "./MovableBackground";

class BeatLogo extends Box implements IBeat {

    // @ts-ignore
    private readonly logo: Logo
    private readonly triangles: LogoTriangles

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        const logo = new Logo(gl, {
            size: [520, 520],
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
        BeatDispatcher.register(this)

    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatState.isAvailable) {
            return;
        }
        const volume = BeatState.nextBeatRMS
        const adjust = Math.min(volume + 0.4, 1)
        this.scaleBegin()
            .to(new Vector2(1 - adjust * 0.03, 1 - adjust * 0.03), 60, easeOut)
            .to(new Vector2(1, 1), gap * 2, easeOutQuint)

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
        BeatDispatcher.unregister(this)
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
            if (BeatState.isAvailable) {
                const scale = this.scale
                const a = Interpolation.dump(
                    scale.x,
                    1 - Math.min(BeatState.currentRMS - 0.4,1) * 0.0635,
                    0.9,
                    Time.elapsed
                )
                scale.x = a
                scale.y = a
                this.scale = scale
            } else {
                const a = 1 - BeatState.currentRMS * 0.08
                this.scale = new Vector2(a, a)
            }
        }
    }

}

class LogoAmpBox extends Box {

    private readonly visualizer: RoundVisualizer
    private readonly logoBeatBox: LogoBeatBox

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
    }

    public onHover(): boolean {
        this.scaleBegin()
            .to(new Vector2(1.1, 1.1), 500, easeOutElastic)
        return true
    }

    public onHoverLost(): boolean {
        this.scaleBegin()
            .to(new Vector2(1, 1), 500, easeOutElastic)
        return true
    }
}

export class LogoBounceBox extends Box {

    private readonly logoAmpBox: LogoAmpBox

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.logoAmpBox = new LogoAmpBox(gl, { size: config.size })
        this.add(this.logoAmpBox)
    }

    private flag = false
    private startPosition = Vector2.newZero()
    public onDrag(which: number): boolean {
        const position = MouseState.position
        if (!this.flag) {
            this.flag = true
            this.startPosition.x = MouseState.position.x
            this.startPosition.y = MouseState.position.y
        }
        this.translate = new Vector2(
            (position.x - this.startPosition.x) * 0.05,
            (position.y - this.startPosition.y) * 0.05
        )
        // console.log(this._translate)
        return true
    }

    public onDragLost(which: number): boolean {
        this.flag = false
        this.translateBegin()
            .translateTo(new Vector2(0, 0), 600, easeOutElastic)
        return true
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