import {onMounted, onUnmounted, Ref, ref} from 'vue';
import {Collector, Flow, MutableStateFlow} from "./flow";

export function useCollect<T>(
    flow: Flow<T>,
    collector: Collector<T>
) {
    // onMounted(() => {
    flow.collect(collector);
    // });
    onUnmounted(() => {
        flow.removeCollect(collector);
    });
}

export function useStateFlow<T>(stateFlow: MutableStateFlow<T>) {
    const value = ref<T>(stateFlow.value) as Ref<T>
    useCollect(stateFlow, v => value.value = v)
    return value
}

export function useWindowEvent<K extends keyof WindowEventMap>(events: K[], listener: (event: WindowEventMap[K]) => void) {
    onMounted(() => {
        for (let i = 0; i < events.length; i++) {
            window.addEventListener(events[i], listener)
        }
    })
    onUnmounted(() => {
        for (let i = 0; i < events.length; i++) {
            window.removeEventListener(events[i], listener);
        }
    })
}