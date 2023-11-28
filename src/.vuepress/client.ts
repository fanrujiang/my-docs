import { defineClientConfig } from '@vuepress/client';
import {defineAsyncComponent} from 'vue';
const NavMusic = defineAsyncComponent(() => import('./Components/NavMusic.vue'));
// const HeroBG = defineAsyncComponent(() => import('./Components/HeroBG.vue'));
const HeroHitokoto = defineAsyncComponent(() => import('./Components/HeroHitokoto.vue'));


export default defineClientConfig({


  rootComponents: [
    // HeroBG,
    NavMusic,
    HeroHitokoto,
  ],
});
