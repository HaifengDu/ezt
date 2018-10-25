import Vue from 'vue';

/**
 * 获取元素高度  这是放指令的文件
 */
Vue.directive("fixHeight",{
    inserted(el,binding){
        Vue.set(binding.value,'show',el.offsetHeight>=46);
    }
});