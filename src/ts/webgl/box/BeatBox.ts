import {Box} from "./Box";
import {BeatDispatcher, IBeat} from "../../global/Beater";
import {BaseDrawableConfig} from "../drawable/Drawable";

export abstract class BeatBox<T extends BaseDrawableConfig = BaseDrawableConfig> extends Box<T> implements IBeat {

    constructor(config: T) {
        super(config);
        BeatDispatcher.register(this)
    }

    abstract onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void

    public dispose() {
        super.dispose()
        BeatDispatcher.unregister(this)
    }

}