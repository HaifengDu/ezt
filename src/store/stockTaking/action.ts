import { Action } from "vuex";
import InventoryType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { StockTakingService } from "../../service/stockTaking/StockTakingService";
const stockTakingService = StockTakingService.getInstance();
export const setAddinventory:Action<any,IRootState> = ({commit},addinventory:{})=>{
    commit(InventoryType.PK_AddInventory, addinventory);
};  
// export const setGoodList:Action<any,IRootState> = ({commit},inventoryList:[])=>{
//     commit(RootType.PK_GOODLIST, inventoryList);
// };   
// export const setInventoryDetails:Action<any,IRootState> = ({commit},inventoryDetails:[])=>{
//     commit(RootType.PK_Details, inventoryDetails);
// };      
// export const setQueryResult:Action<any,IRootState> = ({commit},queryResult:[])=>{
//     commit(RootType.PK_QueryResult, queryResult);
// };   
// export const setAddBeforeInventory:Action<any,IRootState> = ({commit},addBeforeInventory:{})=>{
//     commit(RootType.PK_AddBeforeInventory, addBeforeInventory);
// }
// export const setInventoryType:Action<any,IRootState> = ({commit},pkinventory:{})=>{
//     commit(RootType.PK_InventoryType, pkinventory);
// };
// export const setPktemplateimport:Action<any,IRootState> = ({commit},pktemplateimport:[])=>{
//     commit(RootType.PK_TemplateImport, pktemplateimport);
// };   
    
