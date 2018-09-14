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
        addinventory:{}, //新增盘库单数据
        pkinventory:{},// 盘点类型
        pktemplateimport:[],//模板导入
    },
    getters:{
        inventoryList:state=>state.inventoryList,
        inventoryDetails:state=>state.inventoryDetails,
        queryResult:state=>state.queryResult,
        addinventory:state=>state.addinventory,
        pkinventory:state=>state.pkinventory,
        pktemplateimport:state=>state.pktemplateimport,
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
        },
        [RootType.PK_AddInventory](state,addinventory:{}){
            state.addinventory = addinventory;
        },
        [RootType.PK_InventoryType](state,pkinventory:{}){
            state.pkinventory = pkinventory;
        },
        [RootType.PK_TemplateImport](state,pktemplateimport:any[]){
            state.pktemplateimport = pktemplateimport;
        },
        
        
    },
    actions:{
        ...actions
    }
}
export default stockTaking