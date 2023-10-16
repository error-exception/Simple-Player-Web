import {onMounted, ref, Ref} from "vue";
import {Nullable} from "../type";

type CanvasRef = Ref<Nullable<HTMLCanvasElement>>
type DrawCallback = (context: CanvasRenderingContext2D) => void
export function useContext2D(canvas: CanvasRef, drawCallback: DrawCallback) {
  let drawFun = ref<Nullable<Function>>(null)
  onMounted(() => {
    if (canvas.value) {
      const context = canvas.value.getContext('2d')!
      drawFun.value = () => drawCallback(context)
    }
  })
  return drawFun
}