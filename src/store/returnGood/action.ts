import { Action } from "vuex";
import RootType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";

export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
    commit(RootType.UPDATE_GOODLIST, goodList);
};