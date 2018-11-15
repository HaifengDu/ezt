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
            allow_modify_quantity : 1,//是否允许修改实收数量
            isAnyReturn : 1,//是否任意退货  当选择不支持任意退货时供应商退货单页面需要选择进货单号
            show_order_price : 0,//订单 是否展示要货价格
            show_db_price : 0,//是否显示 平调价格
            show_back_price : 1,//配送退货单 是否显示配送价 
            show_sy_price : 1,//报损报溢单 是否显示库存均价
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