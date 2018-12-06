import { AxiosPromise } from 'axios';

export interface IPublicAddGoodService{
    getBohItemCategory?:(bill_type:string,goodsSortId:number)=>AxiosPromise<any>;//boh盘点单选择物品
    getGoodList?:()=>AxiosPromise<any>;//saast选择物品
}