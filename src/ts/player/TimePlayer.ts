import {ref} from "vue";
import {currentMilliseconds, int} from "../Utils";

export class TimePlayer {

    private previousTime = 0
    private startTime = 0
    private isPlaying = false
    private _current = ref(0)
    private sp = 1

    public reset() {
        this.sp = 1
        this._current.value = 0
        this.previousTime = 0
        this.startTime = 0
        this.isPlaying = false
    }

    public play() {
        this.isPlaying = true
        this.startTime = currentMilliseconds()
    }

    public pause() {
        this.isPlaying = false
        this.previousTime = this._current.value
    }

    public seek(milli: number) {
        this.startTime = currentMilliseconds()
        this._current.value = milli
        this.previousTime = milli
    }

    public currentTime() {
        if (this.isPlaying) {
            this._current.value = this.previousTime + int((currentMilliseconds() - this.startTime) * this.sp)
        }
        return this._current
    }

    public speed(s: number) {
        this.sp = s
        this.previousTime = this._current.value
        this.startTime = currentMilliseconds()
    }


}
