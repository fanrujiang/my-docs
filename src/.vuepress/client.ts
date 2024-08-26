import {defineClientConfig} from '@vuepress/client';
import {defineAsyncComponent} from 'vue';
import 'vuepress-theme-hope/presets/bounce-icon.scss';
import MyIcon from "./Components/MyIcon.vue";
import BlogBg from "./Components/BlogBg.vue"; // 为页面图标添加鼠标悬停的跳动效果。

const NavMusic = defineAsyncComponent(() => import('./Components/NavMusic.vue'));
// const HeroBG = defineAsyncComponent(() => import('./Components/HeroBG.vue'));
const HeroHitokoto = defineAsyncComponent(() => import('./Components/HeroHitokoto.vue'));


export default defineClientConfig({


    rootComponents: [
        NavMusic,
        HeroHitokoto,
        MyIcon,
        BlogBg,
    ],
});
