import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { playSound, Sound } from "./ts/player/SoundEffect";
import { matrix3, identity } from './ts/webgl/graphic/matrix/mat3';
import { vector2 } from './ts/webgl/graphic/matrix/vec2';
import { degreeToRadian } from './ts/Utils';


const app = createApp(App)
const buttonHoverSound = () => playSound(Sound.ButtonHover)
const buttonSelectSound = () => playSound(Sound.ButtonSelect)
app.directive("osuButton", {
  mounted(el: HTMLElement) {
    el.addEventListener('mouseenter', buttonHoverSound)
    el.addEventListener('click', buttonSelectSound)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mouseenter', buttonHoverSound)
    el.removeEventListener('click', buttonSelectSound)
  }
})

const topBarButtonHoverSound = () => playSound(Sound.DefaultHover)
const topBarButtonSelectSound = () => playSound(Sound.DefaultSelect)
app.directive("osuTopBarBtn", {
  mounted(el: HTMLElement) {
    el.addEventListener('mouseenter', topBarButtonHoverSound)
    el.addEventListener('click', topBarButtonSelectSound)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mouseenter', topBarButtonHoverSound)
    el.removeEventListener('click', topBarButtonSelectSound)
  }
})

const defaultHoverSound = () => playSound(Sound.DefaultHover)
const defaultSelectSound = () => playSound(Sound.DefaultSelect)
app.directive('osu-default', {
  mounted(el: HTMLElement) {
    el.addEventListener('mouseenter', defaultHoverSound)
    el.addEventListener('click', defaultSelectSound)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mouseenter', defaultHoverSound)
    el.removeEventListener('click', defaultSelectSound)
  }
})
app.mount('#app');
// // root world matrix
// const rootWorldMatrix = matrix3.identity(matrix3.create())

// // parent world matrix

// const parentWorldMatrix = matrix3.identity(matrix3.create())
// matrix3.translate(parentWorldMatrix, parentWorldMatrix, vector2.fromValues(23, 40))
// matrix3.multiply(parentWorldMatrix, parentWorldMatrix, rootWorldMatrix)
// // child local matrix


// const translate = vector2.fromValues(23, 40)

// const identity = matrix3.identity(matrix3.create())

// let mb = matrix3.translate(identity, identity, translate)

// // print world matrix
// console.log(
//   rootWorldMatrix,
//   parentWorldMatrix,
//   matrix3.multiply(matrix3.create(), parentWorldMatrix, mb)
// )