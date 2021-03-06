import { Action } from "vuex";
import ReceiveGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { ReceiveGoodService } from "../../service/receiveGood/ReceiveGoodService";
import Pager from "../../common/Pager";
const receiveGoodService = ReceiveGoodService.getInstance();
// export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
//     commit(ReceiveGoodType.UPDATE_GOODLIST, goodList);
// };
// export const setAddReceiveGoodInfo:Action<any,IRootState> = ({commit},addReceiveGoodInfo:{})=>{
//     commit(ReceiveGoodType.ADD_RECEIVEGOODINFO, addReceiveGoodInfo);
// }
// export const setBeforeAddReceiveGoodInfo:Action<any,IRootState> = ({commit},beforeAddReceiveGoodInfo:{})=>{
//     commit(ReceiveGoodType.BEFORE_ADDRECEIVEGOODINFO, beforeAddReceiveGoodInfo);
// }

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }