import { Action } from "vuex";
import PublicAddGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
export const setSelectedGood:Action<any,IRootState> = ({commit},selectedGood:[])=>{
    commit(PublicAddGoodType.UPDATE_SELECTEDGOOD, selectedGood);
};
export const setAddBillInfo:Action<any,IRootState> = ({commit},addBillInfo:{})=>{
    commit(PublicAddGoodType.ADD_BILLINFO, addBillInfo);
};
export const setAddBeforeBillInfo:Action<any,IRootState> = ({commit},addBeforeBillInfo:{})=>{
    commit(PublicAddGoodType.ADD_BEFOREBILLINFO, addBeforeBillInfo);
}

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }