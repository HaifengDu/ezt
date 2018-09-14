import VueX, { Store, Module } from "vuex";
import Vue from 'vue';
import * as actions from './action';
import {IRootState} from '../../interface/store/IRootState';
import {PublicAddGoodType} from './mutation-types';
Vue.use(VueX);
const publicAddGood:Module<any,IRootState> = {
    namespaced:true,
    state:{
        addBillInfo:{},//单据中选择物料选择的值
        addBeforeBillInfo:{},//单据中有可能修改信息，需要还原回去的值
        selectedGood:[],//选择物料时已选物品
    },
    getters:{
        selectedGood:state=>state.selectedGood,
        addBillInfo:state=>state.addBillInfo,
        addBeforeBillInfo:state=>state.addBeforeBillInfo,
    },
    mutations:{
        [PublicAddGoodType.UPDATE_SELECTEDGOOD](state,selectedGood:any[]){
            state.selectedGood = selectedGood;
        },
        [PublicAddGoodType.ADD_BILLINFO](state,addBillInfo:{}){
            state.addBillInfo = addBillInfo;
        },
        [PublicAddGoodType.ADD_BEFOREBILLINFO](state,addBeforeBillInfo:{}){
            state.addBeforeBillInfo = addBeforeBillInfo;
        }
    },
    actions:{
        ...actions
    }
}
export default publicAddGood

