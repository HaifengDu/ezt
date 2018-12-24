import { BaseService } from "../BaseService";
import { IOrderGoodsService } from "../../interface/service/IOrderGoodsService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'axios';
export class BOHOrderGoodsService extends BaseService implements IOrderGoodsService{   
    private static _instance: BOHOrderGoodsService;
    private constructor(){
        super(ERequestType.Boh)
    }

     /**
     * 订货列表
     * @param status 
     * @param pager     
     */
    getGoodList(auditStatus:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/getOrders`,{
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
     * 订货 待审核状态删除
     * @param id 
     */
    getDeleteOrder(id:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/delOrders`,{
            "id":id,  //订单id
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }  

    /**
     * 订货详情  
     * @param id 
     */
    getGoodDetail(id:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/findOrderbyId`,{
            "id":id,  //订单id
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }  


    /**
     * 审核要货单  提交  提交并审核
     * @param data 
     */
    getAuditorderlistyes(data:object){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/updateOrder`,{
                "data" :data, 
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
    /**
     * 高级查询明细
     * @param pager 
     */
    getGoodResult(supplierId:string,query:string,busiDateBegin:string,busiDateEnd:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/getOrders`,{
            "supplierId":supplierId,     //配送中心id
            "query": query,    //名称
            "busiDateBegin": busiDateBegin,
            "busiDateEnd": busiDateEnd,
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
     * 获取供货机构
     */
    getSupplyOrganization(){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/findDistributeList`,{
                
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
        
    /*
     * 获取配送机构
     */
    getSupplierList(){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/findDistributeList`,{},config)
        .then(res=>{              
            return Promise.resolve(res);
        });
    }
    /**
     * 订单新增保存
     */
    saveOrder(param:object){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/saveOrder`,{
            data:{
                "orderType": "SCM_ORDER_TYPE_RULE", 
                ...param
            }
        },config)
        .then(res=>{              
            return Promise.resolve(res);
        });
    }










    static createInstance(){
        BOHOrderGoodsService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this() );
    }
}

export default BOHOrderGoodsService;