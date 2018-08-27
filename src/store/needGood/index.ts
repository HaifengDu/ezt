import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { RootType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const needGood:Module<any,IRootState> = {
    namespaced:true,
    state:{
        psList:[]
    },
    getters:{
        psList:state=>state.psList
    },
    mutations:{
        [RootType.PS_GOODLIST](state,psList:any[]){
            state.psList = psList;
        }
    },
    actions:{
        ...actions
    }
}
export default needGood