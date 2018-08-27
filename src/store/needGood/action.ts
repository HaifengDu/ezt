import { Action } from "vuex";
import RootType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { NeedGoodService } from "../../service/NeedGoodService";
import Pager from "../../common/Pager";
const needGoodService = NeedGoodService.getInstance();
export const psGoodList:Action<any,IRootState> = ({commit},psList:[])=>{
    commit(RootType.PS_GOODLIST, psList);
};    
 
export const getPsList:Action<any,IRootState> = ({commit})=>{
    const pager = new Pager();
    return needGoodService.getPsList(pager.getPage()).then(res=>{
        commit(RootType.PS_GOODLIST, res.data.data);
    });   
}