import { IPagerData } from "../IPagerData";
import { AxiosPromise } from 'axios';

export interface ISupplierReturnService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
    getGoodDetail(id:string,type:string):AxiosPromise<any>;
    getSourceBillList:()=> AxiosPromise<any>;
}