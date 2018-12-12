import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface IPublicAddGoodService{
    getGoodClass(param:any,pager:IPagerData):AxiosPromise<any>;//查询分类
    getGoodList(param:any,pager:IPagerData):AxiosPromise<any>;//查询物品
}