import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { initStockType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const initStock:Module<any,IRootState> = {
    namespaced:true,
    state:{
        goodList:[],
        // addInitStockInfo:{},//添加采购入库单 单据信息
        // beforeAddInitStockInfo:{},//修改之后跳路由了记住之前的选择，点击取消时会还原
        isFirstStore:true,//是否是一个新的门店未曾库存初始化
    },
    getters:{
        // goodList:state=>state.goodList,
        // addInitStockInfo: state=> state.addInitStockInfo,
        // beforeAddInitStockInfo: state=> state.beforeAddInitStockInfo,
        isFirstStore: state=> state.isFirstStore,
    },
    mutations:{
        // [ReceiveGoodType.UPDATE_GOODLIST](state,goodList:any[]){
        //     state.goodList = goodList;
        // }
        // [initStockType.ADD_INITSTOCKINFO](state,addInitStockInfo:{}){
        //     state.addInitStockInfo = addInitStockInfo;
        // },
        // [initStockType.ADD_BEFOREINITSTOCKINFO](state,beforeAddInitStockInfo:{}){
        //     state.beforeAddInitStockInfo = beforeAddInitStockInfo;
        // },
        [initStockType.IS_FIRSTSTORE](state,isFirstStore:true){
            state.isFirstStore = isFirstStore;
        }
    },
    actions:{
        ...actions
    }
}
export default initStock