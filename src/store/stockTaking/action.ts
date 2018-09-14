import { Action } from "vuex";
import RootType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { StockTakingService } from "../../service/StockTakingService";
import Pager from "../../common/Pager";
const stockTakingService = StockTakingService.getInstance();
export const setGoodList:Action<any,IRootState> = ({commit},inventoryList:[])=>{
    commit(RootType.PK_GOODLIST, inventoryList);
};   
export const setInventoryDetails:Action<any,IRootState> = ({commit},inventoryDetails:[])=>{
    commit(RootType.PK_Details, inventoryDetails);
};      
export const setQueryResult:Action<any,IRootState> = ({commit},queryResult:[])=>{
    commit(RootType.PK_QueryResult, queryResult);
};   
export const setAddinventory:Action<any,IRootState> = ({commit},addInventory:{})=>{
    commit(RootType.PK_AddInventory, addInventory);
};
export const setInventoryType:Action<any,IRootState> = ({commit},pkinventory:{})=>{
    commit(RootType.PK_InventoryType, pkinventory);
};
export const setPktemplateimport:Action<any,IRootState> = ({commit},pktemplateimport:[])=>{
    commit(RootType.PK_TemplateImport, pktemplateimport);
};   


 
  
// export const getInventoryList:Action<any,IRootState> = ({commit})=>{
//     const pager = new Pager();
//     return stockTakingService.getInventoryList(pager.getPage()).then(res=>{
//         commit(RootType.PK_GOODLIST, res.data.data);
//     });     
// }