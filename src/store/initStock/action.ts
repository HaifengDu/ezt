import { Action } from "vuex";
import initStockType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { InitStockService } from "../../service/InitStockService";
import Pager from "../../common/Pager";
const initStockService = InitStockService.getInstance();
// export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
//     commit(ReceiveGoodType.UPDATE_GOODLIST, goodList);
// };
export const setAddReceiveGoodInfo:Action<any,IRootState> = ({commit},addReceiveGoodInfo:{})=>{
    commit(initStockType.ADD_RECEIVEGOODINFO, addReceiveGoodInfo);
}

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }