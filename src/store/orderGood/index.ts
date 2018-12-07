import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { OrderGoodType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const OrderGood:Module<any,IRootState> = {
    namespaced:true,
    state:{
        goodList:[],
        
    },
    getters:{
        
    },
    mutations:{
      
    },
    actions:{
        ...actions
    }
}
export default OrderGood