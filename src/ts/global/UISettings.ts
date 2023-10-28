import {reactive, watch} from "vue";

export const UIState = reactive({
  starSmoke: false,
  logoDrag: true,
  logoHover: true
})

watch(() => UIState.logoDrag, value => {
  console.log("ui state logo drag", value)
})