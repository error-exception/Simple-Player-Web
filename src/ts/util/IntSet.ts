export class IntSet {

    private list: boolean[] = []

    public add(i: number) {
        this.list[i] = true
    }

    public has(i: number): boolean {
        return !!this.list[i]
    }

    public delete(i: number) {
        this.list[i] = false
    }

}