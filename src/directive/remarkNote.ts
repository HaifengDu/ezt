import Vue from 'vue';
import CACHE_KEY from '../constans/cacheKey'
import { CachePocily } from "../common/Cache";
import { ECache } from "../enum/ECache";

let cache = CachePocily.getInstance();

/**
 * 获取元素高度  这是放指令的文件
 */
Vue.directive("fixHeight",{
    inserted(el,binding){
        let limitHeight;
       
        if(cache.getData(CACHE_KEY.DEVICE_LINEHEIGHT)){
            limitHeight = cache.getData(CACHE_KEY.DEVICE_LINEHEIGHT);
        }else{
            cache.save(CACHE_KEY.DEVICE_LINEHEIGHT,getComputedStyle(el).lineHeight);
            limitHeight = getComputedStyle(el).lineHeight;
        }
        // Vue.set(binding.value,'show',el.offsetHeight >= parseInt(getComputedStyle(el).lineHeight) +10);
        //备注为一行的时候不等于行高，超出两行要小于行高
        Vue.set(binding.value,'show',(el.offsetHeight-10) != parseInt(limitHeight) && (el.offsetHeight-10)/2 < parseInt(limitHeight));
    }
});