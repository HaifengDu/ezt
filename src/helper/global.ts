import Vue from 'vue';

export function toast(msg:string){
    const toasted = Vue.prototype.$toasted;
    return toasted.show(msg);
}