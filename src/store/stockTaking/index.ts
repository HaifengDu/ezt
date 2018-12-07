import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { InventoryType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const stockTaking:Module<any,IRootState> = {
    namespaced:true,
    state:{
        addinventory:{}, //新增盘库单数据
        // inventoryList:[],  //盘库列表
        // inventoryDetails:[], //盘库详情
        // queryResult:[], //查询结果详情
        // addBeforeInventory:{},//新增单据中有可能修改信息，需要还原回去的值
        // pkinventory:{},// 盘点类型
        // pktemplateimport:[],//模板导入     
    },
    getters:{
        addinventory:state=>state.addinventory,
        // inventoryList:state=>state.inventoryList,
        // inventoryDetails:state=>state.inventoryDetails,
        // queryResult:state=>state.queryResult,
        // addBeforeInventory:state=>state.addBeforeInventory,
        // pkinventory:state=>state.pkinventory,
        // pktemplateimport:state=>state.pktemplateimport,
    },    
    mutations:{
        [InventoryType.PK_AddInventory](state,addinventory:{}){
            state.addinventory = addinventory;
        },
        // [InventoryType.PK_GOODLIST](state,inventoryList:any[]){
        //     state.inventoryList = inventoryList;
        // },
        // [InventoryType.PK_Details](state,inventoryDetails:any[]){
        //     state.inventoryDetails = inventoryDetails;
        // },
        // [InventoryType.PK_QueryResult](state,queryResult:any[]){
        //     state.queryResult = queryResult;
        // },
       
        // [InventoryType.PK_AddBeforeInventory](state,addBeforeInventory:{}){
        //     state.addBeforeInventory = addBeforeInventory;
        // },
        // [InventoryType.PK_InventoryType](state,pkinventory:{}){
        //     state.pkinventory = pkinventory;
        // },
        // [InventoryType.PK_TemplateImport](state,pktemplateimport:any[]){
        //     state.pktemplateimport = pktemplateimport;
        // },
        
        
    },
    actions:{
        ...actions
    }
}
export default stockTaking