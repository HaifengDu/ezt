import {AxiosPromise} from 'Axios';
import { IPagerData } from '../IPagerData';

export interface IReceiveGoodService{
    getGoodList(submitType:string,param:any,pager:IPagerData):AxiosPromise<any>;
    checkWarehouse?:() => AxiosPromise<any>;
    getGoodDetail(submitType:string,id:string,pager:IPagerData):AxiosPromise<any>;
    searchList(param:any,pager:IPagerData):AxiosPromise<any>;
    goReceive(submitType:string,param:Object):AxiosPromise<any>;
    getSupplierList:() => AxiosPromise<any>;
    getWarehouseList:() => AxiosPromise<any>;
    
}
