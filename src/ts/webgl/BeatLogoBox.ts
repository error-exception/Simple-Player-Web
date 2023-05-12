import {Box} from "./Box";
import {BeatDispatcher, BeatState, IBeat} from "../Beater";
import {BaseDrawableConfig} from "./Drawable";
import {BeatLogo} from "./BeatLogo";
import {Ripple} from "./Ripple";
import {RoundVisualizer} from "./RoundVisualizer";
import {easeOut, easeOutQuint} from "../util/Easing";
import {AudioPlayerV2} from "../AudioPlayerV2";
import {Time} from "../Time";
import {Vector2} from "./core/Vector2";

export class BeatLogoBox extends Box implements IBeat {

    private readonly logo: BeatLogo
    private readonly ripple: Ripple
    private readonly visualizer: RoundVisualizer
    private readonly logoBeatBox: Box

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        const logo = new BeatLogo(gl, {
            width: 600,
            height: 600,
            vertical: "center",
            horizontal: "center"
        })
        const ripple = new Ripple(gl, {
            width: 564,
            height: 564,
            vertical: "center",
            horizontal: "center"
        })
        const visualizer = new RoundVisualizer(gl, {
            width: '100w',
            height: '100h',
            horizontal: "center",
            vertical: "center"
        })
        const logoBeatBox = new Box(gl, config)
        logoBeatBox.add(logo)
        this.logo = logo
        this.ripple = ripple
        this.visualizer = visualizer
        this.logoBeatBox = logoBeatBox
        this.add(
            visualizer,
            ripple,
            logoBeatBox
        )
        BeatDispatcher.register(this)
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatState.beat.isAvailable) {
            return;
        }
        const volume = BeatState.nextBeatRMS
        const logoScale = 1 - Math.min(volume + 0.4, 1) * 0.02
        const logo = this.logo
        logo.scaleBegin()
            .scaleTo(logoScale, 60, easeOut)
            .scaleTo(1, gap * 2, easeOutQuint)

        if (BeatState.isKiai) {
            logo.lightBegin()
                .transitionTo(1, 60, easeOut)
                .transitionTo(0, gap * 2, easeOutQuint)
        }

        const ripple = this.ripple
        ripple.scaleBegin()
            .scaleTo(1)
            .scaleTo(1.1, gap, easeOutQuint)
        ripple.fadeBegin()
            .fadeTo(0.3)
            .fadeTo(0, gap, easeOutQuint)
    }

    public updateChildren() {
        super.updateChildren()
    }

    protected onUpdate() {
        if (AudioPlayerV2.instance.isPlaying.value) {
            if (BeatState.beat.isAvailable) {
                const scale = this.logoBeatBox.scale
                const a = this.interpolationDump(
                    scale.x,
                    1 - Math.max(0, Math.min(BeatState.currentRMS, 1)) * 0.04,
                    0.9,
                    Time.elapsed
                )
                scale.x = a
                scale.y = a
                this.logoBeatBox.scale = scale
            } else {
                const a = 1 - BeatState.currentRMS * 0.06
                this.logoBeatBox.scale = new Vector2(a, a)
            }
        }
    }

    private interpolationDump(start: number, final: number, base: number, exponent: number) {
        const amount = 1 - Math.pow(base, exponent)
        return start + (final - start) * amount
    }

    public dispose() {
        super.dispose();
        BeatDispatcher.unregister(this)
    }

}