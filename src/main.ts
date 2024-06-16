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