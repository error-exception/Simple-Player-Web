import {BaseDrawableConfig, Drawable} from "./Drawable";
import {BeatDispatcher, IBeat} from "../../global/Beater";

export abstract class BeatDrawable<C extends BaseDrawableConfig = BaseDrawableConfig> extends Drawable<C> implements IBeat {

    constructor(gl: WebGL2RenderingContext, config: C) {
        super(gl, config);
        BeatDispatcher.register(this)
    }

    abstract onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void

    public dispose() {
        super.dispose()
        BeatDispatcher.unregister(this)
    }

}