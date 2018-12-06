import { Action } from "vuex";
import RootType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
    commit(RootType.UPDATE_GOODLIST, goodList);
};

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return supplierReturnService.getGoodList(pager.getPage()).then(res=>{
//         commit(RootType.UPDATE_GOODLIST, res.data.data);
//     });
// }