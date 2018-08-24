import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { RootType } from "./mutation-types";
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
        [RootType.UPDATE_GOODLIST](state,GOODLIST:[]){
            state.goodList = [];
        }
    },
    actions:{
        ...actions
    }
}
export default returnGood