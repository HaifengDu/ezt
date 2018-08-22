import VueX, { Store } from "vuex";
import Vue from "vue";
import { IRootState } from "../interface/store/IRootState";
import { RootType } from "./mutation-types";
import { IUser } from "../interface/IUserModel";
import * as actions from "./action"
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
        }
    },
    actions:{
        ...actions
    }
})