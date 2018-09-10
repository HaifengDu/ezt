import { Action } from "vuex";
import PublicAddGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { PublicAddGood } from "../../service/PublicAddGood";
import Pager from "../../common/Pager";
const addGoodService = PublicAddGood.getInstance();
export const setSelectedGood:Action<any,IRootState> = ({commit},selectedGood:[])=>{
    commit(PublicAddGoodType.UPDATE_SELECTEDGOOD, selectedGood);
};

// export const getGoodList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     const billType = {}
//     return receiveGoodService.getGoodList(pager.getPage()).then(res=>{
//         commit(ReceiveGoodType.UPDATE_GOODLIST, res.data.data);
//     });
// }