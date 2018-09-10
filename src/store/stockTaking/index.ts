import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { RootType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const stockTaking:Module<any,IRootState> = {
    namespaced:true,
    state:{
        inventoryList:[],  //盘库列表
        inventoryDetails:[], //盘库详情
    },
    getters:{
        inventoryList:state=>state.inventoryList,
        inventoryDetails:state=>state.inventoryDetails
    },
    mutations:{
        [RootType.PK_GOODLIST](state,inventoryList:any[]){
            state.inventoryList = inventoryList;
        },
        [RootType.PK_Details](state,inventoryDetails:any[]){
            state.inventoryDetails = inventoryDetails;
        }
    },
    actions:{
        ...actions
    }
}
export default stockTaking