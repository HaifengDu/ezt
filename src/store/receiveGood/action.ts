import { Action } from "vuex";
import ReceiveGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { ReceiveGoodService } from "../../service/ReceiveGoodService";
import Pager from "../../common/Pager";
const receiveGoodService = ReceiveGoodService.getInstance();
export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
    commit(ReceiveGoodType.UPDATE_GOODLIST, goodList);
};

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }