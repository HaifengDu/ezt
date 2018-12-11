import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface IOrderGoodsService{
    getGoodList(auditStatus:string,pager:IPagerData):AxiosPromise<any>;//获取订货列表页
    getDeleteOrder(id:string):AxiosPromise<any>;//删除未审核单据
    getAuditorderlistyes(data:object):AxiosPromise<any>;//审核要货单  提交  提交并审核
    getGoodResult?:(pager:IPagerData)=>AxiosPromise<any>;
    getGoodDetail(id:string):AxiosPromise<any>;
   
}