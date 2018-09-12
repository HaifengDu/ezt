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
        addInitStockInfo:{}//添加采购入库单 单据信息
    },
    getters:{
        // goodList:state=>state.goodList,
        addInitStockInfo: state=> state.addInitStockInfo
    },
    mutations:{
        // [ReceiveGoodType.UPDATE_GOODLIST](state,goodList:any[]){
        //     state.goodList = goodList;
        // }
         [initStockType.ADD_INITSTOCKINFO](state,addInitStockInfo:{}){
            state.addInitStockInfo = addInitStockInfo;
        }
    },
    actions:{
        ...actions
    }
}
export default initStock