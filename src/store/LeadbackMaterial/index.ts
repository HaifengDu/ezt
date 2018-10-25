import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { LeadbackMaterialType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../interface/store/IRootState";
Vue.use(VueX);
const leadbackMaterial:Module<any,IRootState> = {
    namespaced:true,
    state:{
        goodList:[],
        
    },
    getters:{
        
    },
    mutations:{
      
    },
    actions:{
        ...actions
    }
}
export default leadbackMaterial