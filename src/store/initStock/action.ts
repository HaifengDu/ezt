import { Action } from "vuex";
import initStockType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
// export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
//     commit(ReceiveGoodType.UPDATE_GOODLIST, goodList);
// };
// export const setAddInitStockInfo:Action<any,IRootState> = ({commit},addInitStockInfo:{})=>{
//     commit(initStockType.ADD_INITSTOCKINFO, addInitStockInfo);
// }
// export const setBeforeAddInitStockInfo:Action<any,IRootState> = ({commit},beforeAddInitStockInfo:{})=>{
//     commit(initStockType.ADD_BEFOREINITSTOCKINFO, beforeAddInitStockInfo);
// }
export const setIsFirstStore:Action<any,IRootState> = ({commit},isFirstStore:{})=>{
    commit(initStockType.IS_FIRSTSTORE, isFirstStore);
}
// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }