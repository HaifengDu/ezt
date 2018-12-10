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
                "pagesize": 20, 
                "totalcount": 0
            }
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
    getEnquiryList(datails:object){
        let config = {
            headers: { 
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/findStockTakings`,{
            "details":datails,
            "pagination":{
                orderby:null,
                asc:false,
                pageno:1,
                pagesize:20,
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
            // "bill_type":bill_type,
            // "bill_type_name" :bill_type_name,
            // "warehouse_id": warehouse_id,
            // "busi_date": busi_date,
            "billInfo":billInfo,
            /*[{
                "unit_name": unit_name,
                "unit_id":unit_id,
                "consume_qty":consume_qty,
                "thery_qty":thery_qty,
                "acc_amt":acc_amt,
                "stockChecked":stockChecked,
                "acc_qty":acc_qty,
                "material_num":material_num,
                "stockMode":stockMode,
                "material_id":material_id,
                "material_name":material_name,
                "distributePrice1":distributePrice1
            }]*/
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
                // "id":id,
                // "bill_type":bill_type,
                // "bill_type_name" :bill_type_name,
                // "warehouse_id":warehouse_id,
                // "busi_date":busi_date,
                // "bill_status" : bill_status,     //SCM_AUDIT_YES  审核       SCM_AUDIT_NO 只是修改
                "billInfo" :billInfo, 
                //[
                //     {    
                //         "id" :ids,
                //         "stockChecked":stockChecked,    //PLATFORM_NO否   PLATFORM_YES是     标识该物品是否被盘到
                //         "acc_amt":acc_amt, 
                //         "consume_qty":consume_qty, 
                //         "stockMode": stockMode, 
                //         "material_num":material_num, 
                //         "material_id": material_id,     
                //         "unit_id":unit_id, 
                //         "thery_qty":thery_qty, 
                //         "unit_name":unit_name, 
                //         "material_name":material_name, 
                //         "acc_qty":acc_qty, 
                //         "distributePrice1":distributePrice1,
                //         "disperse_num":disperse_num
                //     }
                // ]
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
    
  /*   *
     * BOH版本   编制盘点单新增物品  （按分类检索）
     * @param bill_type 
     */
   /*  getBohClassifiedSearch(bill_type:string){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/chooseStockTakingGoods`,{
            "bill_type": bill_type, 
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    } */

   /*  *
     * BOH版本  盘点选择货品（切换物品类别）
     * @param bill_type 
     * @param goodsSortId 
     */
   /*  getBohItemCategory(bill_type:string,goodsSortId:number){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/chooseStockTakingGoods`,{
            "bill_type":bill_type, 
            "goodsSortId":goodsSortId,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    } */





    static createInstance(){
        BOHStockTakingService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this() );
    }
}

export default BOHStockTakingService;
