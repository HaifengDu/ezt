import VueX, { Store } from "vuex";
import Vue from "vue";
import { IRootState } from "../interface/store/IRootState";
import { RootType } from "./mutation-types";
import { IUser } from "../interface/IUserModel";
import * as actions from "./action"
import returnGood from "./returnGood";
import needGood from "./needGood";
import stockTaking from "./stockTaking"
import libraryDetails from "./stockTaking/libraryDetails"
import receiveGood from './receiveGood'
import publicAddGood from './PublicAddGood';
Vue.use(VueX);
export default new Store<IRootState>({
    state:{
        user:void 0
    },
    getters:{
        user:state=>state.user
    },
    mutations:{
        [RootType.UPDATE_USER](state,user:IUser){
            state.user = user;
        },
        [RootType.DELETE_USER](state){
            state.user = null;
        }
    },
    actions:{
        ...actions
    },
    modules:{
        returnGood,//退货
        needGood,//要货
        stockTaking,//盘库
        libraryDetails,
        receiveGood,//收货
        publicAddGood,//选择货品
    }
})