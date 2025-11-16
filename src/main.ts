import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { playSound, Sound } from "./ts/player/SoundEffect";
import { Transformable } from './ts/webgl/drawable/Transformable';
import { vector2 } from './ts/webgl/graphic/matrix/vec2';


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

const parent = new Transformable()
const child = new Transformable()

parent.addTransformable(child)

parent.translate = vector2.fromValues(100, 100)
child.scale = vector2.fromValues(0.5, 0.5)

// parent.updateTransformFromRoot()

console.log(child.localToWorld([10, 10]))
console.log(parent.localToWorld([10, 10]))
console.log(parent.worldToLocal([100, 100]))