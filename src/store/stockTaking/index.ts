import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { RootType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const stockTaking:Module<any,IRootState> = {
    namespaced:true,
    state:{
        inventoryList:[]
    },
    getters:{
        inventoryList:state=>state.inventoryList
    },
    mutations:{
        [RootType.PK_GOODLIST](state,inventoryList:any[]){
            state.inventoryList = inventoryList;
        }
    },
    actions:{
        ...actions
    }
}
export default stockTaking