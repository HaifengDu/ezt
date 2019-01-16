import { IPagerData } from "../IPagerData";
import { AxiosPromise } from 'axios';

export interface ISupplierReturnService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
    getGoodDetail(id:string,pager:IPagerData):AxiosPromise<any>;
    getSourceBillList:()=> AxiosPromise<any>;
    getGoodResult:(billType:string,busiDateBegin:string,busiDateEnd:string,supplierId:string,query:string,pager:IPagerData)=> AxiosPromise<any>;
    getReturnType:(billType:string)=> AxiosPromise<any>;
}   