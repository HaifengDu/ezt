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
        addReceiveGoodInfo:{}//添加采购入库单 单据信息
    },
    getters:{
        // goodList:state=>state.goodList,
        addReceiveGoodInfo: state=> state.addReceiveGoodInfo
    },
    mutations:{
        // [ReceiveGoodType.UPDATE_GOODLIST](state,goodList:any[]){
        //     state.goodList = goodList;
        // }
         [initStockType.ADD_RECEIVEGOODINFO](state,addReceiveGoodInfo:{}){
            state.addReceiveGoodInfo = addReceiveGoodInfo;
        }
    },
    actions:{
        ...actions
    }
}
export default initStock