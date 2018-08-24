import { Action } from "vuex";
import RootType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { ReturnGoodService } from "../../service/ReturnGoodService";
import Pager from "../../common/Pager";
const returnGoodService = ReturnGoodService.getInstance();
export const updateGoodList:Action<any,IRootState> = ({commit},goodList:[])=>{
    commit(RootType.UPDATE_GOODLIST, goodList);
};

export const getGoodList:Action<any,IRootState> = ({commit})=>{
    const pager = new Pager();
    return returnGoodService.getGoodList(pager.getPage()).then(res=>{
        commit(RootType.UPDATE_GOODLIST, res.data.data);
    });
}