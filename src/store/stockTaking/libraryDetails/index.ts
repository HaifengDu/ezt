import VueX, { Store, Module } from "vuex";
import Vue from "vue";
import { LibraryType } from "./mutation-types";
import * as actions from "./action"
import { IRootState } from "../../../interface/store/IRootState";
Vue.use(VueX);
const libraryDetails:Module<any,IRootState> = {
    namespaced:true,
    state:{
        inventoryDetails:[]
    },
    getters:{
        inventoryDetails:state=>state.inventoryDetails
    },
    mutations:{
        [LibraryType.PK_Detailed](state,inventoryDetails:any[]){
            state.inventoryDetails = inventoryDetails;
        }
    },
    actions:{
        ...actions
    }
}
export default libraryDetails