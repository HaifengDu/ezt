import { BaseService } from "../BaseService";
import { IReceiveGoodService } from "../../interface/service/IReceiveGoodService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'Axios';

export class BOHReceiveGoodService extends BaseService implements IReceiveGoodService{
    
    private static _instance: BOHReceiveGoodService;

    private constructor(){
        super(ERequestType.Boh)
    }

      /**
     * 列表页接口
     * @param status 单据状态
     * @param pager  分页数据
     */
    getGoodList(submitType:string,status:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/receiveList`,{
            "receiveType" : submitType, 
            "auditStatus" : status, 
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
     * 查询 收货单
     * @param param 查询的条件
     * @param pager 分页信息
     */
    searchList(param:any,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/receiveList`,{
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            },...param
        },config).then(res=>{         
            return Promise.resolve(res);
        });
    }
    /**
     * 单据详情接口
     * @param receiveType 收货类型
     * @param id  单据id
     */
    getGoodDetail(submitType:string,id:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/findBillById`,{
            "receiveType" : submitType,
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
     * 收货
     */
    goReceive(submitType:string,param:Object){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/receive`,{
            receiveType:submitType,
            data : param
        },config).then(res=>{     
            return Promise.resolve(res);
        });
    }
    /**
     * 来货单位
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
     * 获取 仓库列表
     */
    getWarehouseList(){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findScmWarehouse`,{},config)
        .then(res=>{              
            return Promise.resolve(res);
        });
    }

    static createdInstance(){
        BOHReceiveGoodService.getInstance();
    }

    static getInstance(){
        return this._instance || (this._instance = new this());
    }
}

export default BOHReceiveGoodService;