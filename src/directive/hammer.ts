import Vue from "vue";
import "hammerjs";
declare var Hammer:any;
Vue.directive("swipeleft",function(el,binding,vnode,oldNode){
    const hammertime = new Hammer(el);
    hammertime.on('swipeleft',binding.value)
});