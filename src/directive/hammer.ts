import Vue from "vue";
import "hammerjs";
/**
 * 左侧滑动指令
 */
declare var Hammer:any;
Vue.directive("swipeleft",function(el,binding,vnode,oldNode){
    const hammertime = new Hammer(el);
    hammertime.on('swipeleft',binding.value)
});
Vue.directive("swiperight",function(el,binding,vnode,oldNode){
    const hammertime = new Hammer(el);
    hammertime.on('swiperight',binding.value)
});