import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { GoodType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const returnGood:Module<any,IRootState> = {
    namespaced:true,
    state:{
        goodList:[]
    },
    getters:{
        goodList:state=>state.goodList
    },
    mutations:{
        [GoodType.UPDATE_GOODLIST](state,goodList:any[]){
            state.goodList = goodList;
        }
    },
    actions:{
        ...actions
    }
}
export default returnGood