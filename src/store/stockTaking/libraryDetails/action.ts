import { Action } from "vuex";
import LibraryType from "./mutation-types";
import IRootState from "../../../interface/store/IRootState";
import { LibraryDetailService } from "../../../service/LibraryDetailService";
import Pager from "../../../common/Pager";
const libraryDetailService = LibraryDetailService.getInstance();
export const pkDetailed:Action<any,IRootState> = ({commit},inventoryDetails:[])=>{
    commit(LibraryType.PK_Detailed, inventoryDetails);
};    
 
export const getInventoryDetails:Action<any,IRootState> = ({commit})=>{
    const pager = new Pager();
    return libraryDetailService.getInventoryDetails(pager.getPage()).then(res=>{
        commit(LibraryType.PK_Detailed, res.data.data);
    });   
}