import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';
export interface IStockTakingService{ 
    getInventoryList?: (status:string,pager:IPagerData) =>AxiosPromise<any>;  //盘库列表
    getLibraryDetails?: (id:number,audit_status:number) =>AxiosPromise<any>; //盘库详情
    getEnquiryList?: (begin_date:string,bill_no:string,end_date:string,warehouse_id:string) =>AxiosPromise<any>;  //查询盘库单 
    getTemplateImport?: (warehouse_id:string) =>AxiosPromise<any>;  //模板导入
    getTemplateDetails?: (template_id:string,flag:string,warehouse_id:string) =>AxiosPromise<any>;  //模板详情
    getInventorytypeImport?: (flag:string,warehouse_id:string) =>AxiosPromise<any>;//盘点类型批量导入
    getAdditionalcheckList?: (billInfo:object) =>AxiosPromise<any>;//新增盘点单      
    getAuditchecklistno?: (audit_name:string,ids:string,opinion:string) =>AxiosPromise<any>;//审核盘点单（不通过）
    getAuditchecklistyes?: (billInfo:object) =>AxiosPromise<any>;//审核盘点单（通过）
    getDataSorting():AxiosPromise<any>;//数据整理
    getInventoryType?: (bill_type:string) =>AxiosPromise<any>;//盘点类型入口
    getWarehouse?: (inventory_type:string) =>AxiosPromise<any>;//动态加载仓库
    getRealdiscEntry?: (list:Array<any>,content:object) =>AxiosPromise<any>;//实盘录入
    getDeleteStock:(id:string) =>AxiosPromise<any>;//待审核单据 删除

}