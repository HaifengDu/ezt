import VueX, { Store, Module } from "vuex";
import Vue from 'vue';
import * as actions from './action';
import {IRootState} from '../../interface/store/IRootState';
import {PublicAddGoodType} from './mutation-types';
Vue.use(VueX);
const publicAddGood:Module<any,IRootState> = {
    namespaced:true,
    state:{
        selectedGood:[]
    },
    getters:{
        selectedGood:state=>state.selectedGood
    },
    mutations:{
        [PublicAddGoodType.UPDATE_SELECTEDGOOD](state,selectedGood:any[]){
            state.selectedGood = selectedGood;
        }
    },
    actions:{
        ...actions
    }
}
export default publicAddGood

