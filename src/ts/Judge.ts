import {reactive} from "vue";

export const Judge = reactive({
    perfect: 0,
    good: 0,
    bad: 0,
    miss: 0
})

export function resetJudge() {
    Judge.perfect = 0
    Judge.good = 0
    Judge.bad = 0
    Judge.miss = 0
}