import {Box, type BoxConfig} from "./Box";
import {BeatDispatcher, IBeat} from "../../global/Beater";

export abstract class BeatBox<T extends BoxConfig = BoxConfig> extends Box<T> implements IBeat {

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