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
        InterfaceSysTypeBOH:false,//后台接口是SAAS（false）还是BOH（true） 
        systemParamSetting:{},//系统设置参数
        materialSetting:{//物料参数设置
            isModifyActNum:true,//是否允许修改实收数量
            isAnyReturn:true,//是否任意退货
        }  
       
    },    
    getters:{
        user:state=>state.user,
        systemParamSetting:state=>state.systemParamSetting,
        InterfaceSysTypeBOH:state=>state.InterfaceSysTypeBOH,
        materialSetting:state=>state.materialSetting,
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
        [RootType.SET_INTERFACESYSTYPEBOH](state,InterfaceSysTypeBOH:false){
            state.InterfaceSysTypeBOH = InterfaceSysTypeBOH;
        },
        [RootType.SET_MATERIALSETTING](state,materialSetting:{}){
            state.materialSetting = materialSetting;
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