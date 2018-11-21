import LoginService from "./LoginService";
import mixins from "../common/Mixin";
import { IUser } from "../interface/IUserModel";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg"; 
import Axios from "axios";
import store from "../store"  
import { IPagerData } from "../interface/IPagerData";
export class StockTakingService extends BaseService{   
    private static _instance: StockTakingService;
    private loginService:LoginService;  
    private constructor() {      
        super(ERequestType.AppOrder)
        this.loginService = LoginService.getInstance();
    }    
    /**
     * 盘库列表
     * @param status 
     * @param pager 
     */ 
    getInventoryList(status:string,pager:IPagerData){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"status":status}],
            "oper":"STOCK_LIST",
            "pagination":null
        }).then(res=>{              
            return Promise.resolve(res);
        });
        //const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=19`);
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/`)
    }       
    /**
     * 盘库详情  待提交状态下的提交按钮
     * @param id 
     * @param audit_status 
     */
    getLibraryDetails(id:number,audit_status:number){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"id":id,"audit_status":0}],   //audit_status单据状态
            "oper":"STOCK_DETAIL",
            "pagination":null
        }).then(res=>{   
            return Promise.resolve(res);
        });
    }
    /**
     * 查询盘库单
     * @param bill_no 
     * @param end_date 
     * @param begin_date 
     * @param warehouse_id 
     */
    getEnquiryList(bill_no:string,end_date:string,begin_date:string,warehouse_id:number){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "bill_no":bill_no,
                "end_date":end_date,  
                "begin_date":begin_date,
                "warehouse_id":warehouse_id,
            }],   
            "oper":"INVENTORY_QUERY",
            "pagination":[{"asc":false,"orderby":null,"pageno":1,"pagesize":20,"totalcount":0}]
        }).then(res=>{           
            return Promise.resolve(res);
        });
        
    }
    /**
     * 模板导入
     * @param warehouse_id 
     */
    getTemplateImport(warehouse_id:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"warehouse_id":warehouse_id}],
            "oper":"INVENTORY_TEMPLATE",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }
    /**
     * 模板详情
     * @param template_id 
     * @param flag 
     * @param warehouse_id 
     */
    getTemplateDetails(template_id:string,flag:string,warehouse_id:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "template_id":template_id,   //模板id
                "flag":flag,  //盘点类型
                "warehouse_id":warehouse_id  //仓库id
            }],
            "oper":"TEMPLATE_DETAIL",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }
    /**
     * 盘点批量类型导入（点击盘点类型导入） 新增盘点类型导入
     * @param flag 
     * @param warehouse_id 
     */
    getInventorytypeImport(flag:string,warehouse_id:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "flag":flag,  //盘点类型
                "warehouse_id":warehouse_id
            }],   
            "oper":"BATCH_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 新增盘点单   （盘点类型导入暂存提交接口）
     * @param material_id 
     * @param entry_name 
     * @param bill_status 
     * @param bill_type_name 
     * @param warehouse_id 
     * @param bill_type 
     * @param stock_count_mode_name 
     * @param busi_date 
     * @param organ_brief_code 
     * @param stock_count_mode 
     */
    getAdditionalcheckList(material_id:string,entry_name:string,bill_status:number,bill_type_name:string,warehouse_id:string,bill_type:string,stock_count_mode_name:string,busi_date:string,organ_brief_code:string,stock_count_mode:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{    
                "rows":[{"material_id":material_id}],//物料id
                "entry_name":entry_name,    //制单人姓名
                "bill_status":bill_status,       //单据状态   0是暂存   1是提交
                "bill_type_name":bill_type_name,   //单据盘点类型名称
                "warehouse_id":warehouse_id,      //仓库id
                "bill_type":bill_type,   //单据盘点类型
                "stock_count_mode_name":stock_count_mode_name,  //未盘处理方式
                "busi_date":busi_date,      //盘点日期
                "organ_brief_code":organ_brief_code,  //仓库简编码
                "stock_count_mode":stock_count_mode  //未盘处理方式编号
            }],
            "oper":"CREATE_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 审核盘点单 （不通过）
     * @param audit_name 
     * @param ids 
     * @param opinion 
     */
    getAuditchecklistno(audit_name:string,ids:string,opinion:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "audit_name":audit_name,  //审核人
                "id":ids,         //单据id
                "opinion":opinion,    //备注   
            }],
            "oper":"RETURN_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 审核盘点单（通过）
     * @param whole_num 
     * @param id 
     * @param consume_num 
     * @param disperse_num 
     * @param store_name 
     * @param warehouse_name 
     * @param audit_name 
     * @param ids 
     * @param stock_count_mode 
     * @param organ_brief_code 
     */
    getAuditchecklistyes(whole_num:string,id:number,consume_num:string,disperse_num:string,store_name:string,warehouse_name:string,audit_name:string,ids:string,stock_count_mode:string,organ_brief_code:string,){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            data:[{
                "list":[{
                    "whole_num":whole_num,   //单据包含总量
                    "id":id,     //物料id
                    "consume_num":consume_num,
                    "disperse_num":disperse_num
                }],
                "store_name":store_name,
                "warehouse_name":warehouse_name,
                "audit_name":audit_name,
                "id":ids,
                "stock_count_mode":stock_count_mode,
                "organ_brief_code":organ_brief_code,
            }],
            "oper":"REVIEW_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 数据整理
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
     * 日周月盘入口
     * @param bill_type 
     */
    getInventoryType(bill_type:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"bill_type":bill_type}],
            "oper":"CHECK_DAILYINVENTORY",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 动态加载仓库
     * @param inventory_type 
     */
    getWarehouse(inventory_type:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"inventory_type":inventory_type}],
            "oper":"INVENTORY_WAREHOUSE",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 实盘录入
     * @param whole_num 
     * @param id 
     * @param consume_num 
     * @param disperse_num 
     * @param ids 
     * @param is_stock_report 
     * @param stock_count_mode 
     */
    getRealdiscEntry(whole_num:string,id:number,consume_num:string,disperse_num:string,ids:string,is_stock_report:number,stock_count_mode:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "list":[{
                    "whole_num":whole_num,  //采购单位
                    "id":id,        //物料id
                    "consume_num":consume_num,  //消耗单位
                    "disperse_num":disperse_num,  //库存主单位
                  }],
                "id":ids,           //单据id
                "is_stock_report":is_stock_report,   //是否实盘录入
                "stock_count_mode":stock_count_mode  //未盘处理方式
            }],
            "oper":"ENTRY_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    /**
     * 新增手工制单（模糊搜索）
     */
    getManualProduction(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "key_word":"",  //关键字
                "flag":"daily_inventory",  //盘点类型
                "warehouse_id":"40"   //仓库id
            }],
            "oper":"INVENTORY_MATERIAL",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }
    static createInstance() {
        StockTakingService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
export default StockTakingService;