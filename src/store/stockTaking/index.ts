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
        queryResult:[], //查询结果详情
    },
    getters:{
        inventoryList:state=>state.inventoryList,
        inventoryDetails:state=>state.inventoryDetails,
        queryResult:state=>state.queryResult
    },    
    mutations:{
        [RootType.PK_GOODLIST](state,inventoryList:any[]){
            state.inventoryList = inventoryList;
        },
        [RootType.PK_Details](state,inventoryDetails:any[]){
            state.inventoryDetails = inventoryDetails;
        },
        [RootType.PK_QueryResult](state,queryResult:any[]){
            state.queryResult = queryResult;
        }
    },
    actions:{
        ...actions
    }
}
export default stockTaking