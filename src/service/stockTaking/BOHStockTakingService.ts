import { BaseService } from "../BaseService";
import { IStockTakingService } from "../../interface/service/IStockTakingService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'axios';
export class BOHStockTakingService extends BaseService implements IStockTakingService{   
    
    private static _instance: BOHStockTakingService;

    private constructor(){
        super(ERequestType.Boh)
    }
    
    /**
     * 这个接口SAAS需要   BOH不需要   要是不加的话报错   必须BOH跟SAAS接口名称一样并且都的有
     */
    getDataSorting(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[],
            "oper":"ORGANIZE_DATA",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }  


    /**
     * 加载仓库
     * 
     */
    getWarehouse(){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findScmWarehouse`,{
            
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }  
    /**
     * BOH版本  盘库列表页
     * @param audit_status   
     */
    getInventoryList(audit_status:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findStockTakings`,{
            "audit_status":audit_status,
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
     * 待审核单据 删除 
     * @param id 
     */
    getDeleteStock(id:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/deleteStockTaking`,{
            "id":id,
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }  

    /**
     * BOH版本 高级查询    查询盘库单
     * @param audit_status 
     * @param begin_date 
     * @param bill_no 
     * @param end_date 
     */
    getEnquiryList(begin_date:string,bill_no:string,end_date:string,warehouse_id:string){
        let config = {
            headers: { 
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findStockTakings`,{
            "begin_date":begin_date,
            "bill_no":bill_no,
            "end_date":end_date,
            "warehouse_id":warehouse_id,
            "pagination":{
                orderby:null,
                asc:false,
                pageno:1,
                pagesize:10,
                totalcount:0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    } 

    /**
     * BOH版本  按状态查询盘点单   盘点类型
     * @param bill_type 
     */
    getInventoryType(bill_type:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/toCreate`,{
            "bill_type":bill_type, 
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }   

     /**
     * BOH版本新增盘点单时      盘点物品查询     盘点类型导入
     * @param bill_type 
     */
    getBohInventoryItems(bill_type:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findStockTakingGoodsByType`,{
            "bill_type":bill_type
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    } 

    /**
     * BOH版本新增盘点单保存   确认盘点单的页面保存新编制盘点单   新增盘点单保存
     * @param bill_type 
     * @param bill_type_name 
     * @param warehouse_id 
     * @param busi_date 
     * @param details 
     */
    getAdditionalcheckList(billInfo:object){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        } 
        return Axios.post(`${this.reqUrl}mobile/stock/taking/addStockTaking`,{
            "billInfo":billInfo,
        },config).then(res=>{
            return Promise.resolve(res);
        });
    }
   /**
    * BOH版本  实盘  审核   查看详情 页面返回的数据
    * @param id 
    */
   getLibraryDetails(id:number){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findStockTakingById`,{
            "id":id
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }

    /**
     * BOH版本   盘点单修改  对应实盘录入 审核操作    盘点单修改
     * @param id 
     * @param bill_type 
     * @param bill_type_name 
     * @param warehouse_id 
     * @param busi_date 
     * @param bill_status 
     * @param details 
     */
    getAuditchecklistyes(billInfo:object){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/updateStockTaking`,{
                // "bill_status" : bill_status,     //SCM_AUDIT_YES  审核       SCM_AUDIT_NO 只是修改
                "billInfo" :billInfo, 
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
    

    static createInstance(){
        BOHStockTakingService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this() );
    }
}

export default BOHStockTakingService;
