import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {playSound, Sound} from "./ts/player/SoundEffect";

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
app.mount('#app');