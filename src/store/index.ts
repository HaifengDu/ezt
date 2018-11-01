import VueX, { Store } from "vuex";
import Vue from "vue";
import { IRootState } from "../interface/store/IRootState";
import { RootType } from "./mutation-types";
import { IUser } from "../interface/IUserModel";
import * as actions from "./action"
import supplierReturn from "./supplierReturn";
import needGood from "./needGood";
import stockTaking from "./stockTaking"
import receiveGood from './receiveGood'
import publicAddGood from './PublicAddGood';
import initStock from './initStock'
Vue.use(VueX);
export default new Store<IRootState>({
    state:{
        user:void 0,
        systemParamSetting:{},//系统设置参数
        logistics:{
            isAnyReturn:false,//是否任意退货
        },//物流设置
    },
    getters:{
        user:state=>state.user,
        systemParamSetting:state=>state.systemParamSetting,
        logistics:state=>state.logistics,
    },
    mutations:{
        [RootType.UPDATE_USER](state,user:IUser){
            state.user = user;
        },
        [RootType.DELETE_USER](state){
            state.user = null;
        },
        [RootType.SET_SYSTEMPARAM](state,systemParamSetting:{}){
            state.systemParamSetting = systemParamSetting;
        },
        [RootType.SET_LOGISTICS](state,logistics:{}){
            state.logistics = logistics;
        }
    },
    actions:{
        ...actions
    },
    modules:{
        supplierReturn,//退货
        needGood,//要货
        stockTaking,//盘库
        receiveGood,//收货
        publicAddGood,//选择货品
        initStock,//库存初始化
    }
})