interface TimingItemParam {
    isKiai: boolean
    timestamp: number
}

export class TimingItem {

    public isKiai: boolean = false
    public timestamp: number = 0

    constructor(param: TimingItemParam) {
        this.isKiai = param.isKiai
        this.timestamp = param.timestamp
    }

}