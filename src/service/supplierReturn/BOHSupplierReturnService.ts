import { BaseService } from "../BaseService";
import { ISupplierReturnService } from "../../interface/service/ISupplierReturnService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'Axios';

export class BOHSupplierReturnService extends BaseService implements ISupplierReturnService{

    private static _instance: BOHSupplierReturnService;

    private constructor(){
        super(ERequestType.Boh)
    }

      /**  
     * 列表页接口
     * @param status 单据状态
     * @param pager  分页数据    
     */
    getGoodList(auditStatus:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }   
        return Axios.post(`${this.reqUrl}mobile/purchase/return/queryScmReturns`,{
            "auditStatus":auditStatus,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 10, 
                "totalcount": 0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }  
    /**
     * 单据详情接口
     * @param id 单据id
     * @param type  单据类型
     */
    getGoodDetail(id:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/return/findScmReturnById`,{
            "id" : id,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            }
        },config).then(res=>{        
            return Promise.resolve(res);
        });
    }
    /**
     * 获取源单号
     * @param id 单据id
     */
    getSourceBillList(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=55`);
        return promise;
    }



    /**
     * 退货高级查询
     */
    getGoodResult(billType:string,busiDateBegin:string,busiDateEnd:string,supplierId:string,query:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/return/queryScmReturns`,{
            "billType":billType,  //退货类型
            "busiDateBegin":busiDateBegin,  //业务开始日期
            "busiDateEnd":busiDateEnd,  // 业务结束日期
            "supplierId":supplierId, //供应商id  配送中心id
            "query":query,  //名称
            "pagination": {
                "orderby": "", 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 10, 
                "totalcount": 0
            } 
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }   

    /**
     * 根据退货类型显示供应商货配送中心
     */
    getReturnType(billType:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/return/querySupplieOrgans`,{
            "billType":billType,  //退货类型
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }   


    static createInstance(){
        BOHSupplierReturnService.getInstance();
    }

    static getInstance(){
        return this._instance || (this._instance = new this())
    }
}

export default BOHSupplierReturnService;