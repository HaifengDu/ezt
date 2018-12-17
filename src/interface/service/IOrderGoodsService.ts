import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface IOrderGoodsService{
    getGoodList(auditStatus:string,pager:IPagerData):AxiosPromise<any>;//获取订货列表页
    getDeleteOrder(id:string):AxiosPromise<any>;//删除未审核单据
    getAuditorderlistyes(data:object):AxiosPromise<any>;//审核要货单  提交  提交并审核
    getGoodResult?:(supplierId:string,query:string,busiDateBegin:string,busiDateEnd:string,pager:IPagerData)=>AxiosPromise<any>; //高级查询条件
    getGoodDetail(id:string):AxiosPromise<any>;  //订单详情
    getSupplyOrganization():AxiosPromise<any>;//获取供货机构
    getSupplierList():AxiosPromise<any>;//获取配送机构
    saveOrder(param:object):AxiosPromise<any>;//订单新增保存
}