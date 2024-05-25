import { defineClientConfig } from '@vuepress/client';
import {defineAsyncComponent} from 'vue';
import Wormhole from "./Components/Wormhole";
import Travelling from "./Components/Travelling";
const NavMusic = defineAsyncComponent(() => import('./Components/NavMusic.vue'));
// const HeroBG = defineAsyncComponent(() => import('./Components/HeroBG.vue'));
const HeroHitokoto = defineAsyncComponent(() => import('./Components/HeroHitokoto.vue'));


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("Wormhole", Wormhole);
    app.component("Travelling", Travelling);
  },


  rootComponents: [
    // HeroBG,
    NavMusic,
    HeroHitokoto,
  ],
});
