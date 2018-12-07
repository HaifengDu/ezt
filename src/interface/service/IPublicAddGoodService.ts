import { AxiosPromise } from 'axios';

export interface IPublicAddGoodService{
    getBohItemCategory?:(bill_type:string,goodsSortId:number)=>AxiosPromise<any>;//boh盘点单选择物品
    getGoodClass(param:any):AxiosPromise<any>;//查询分类
    getGoodList(param:any):AxiosPromise<any>;//查询物品
}