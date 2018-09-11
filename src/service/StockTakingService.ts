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
    // 盘库首页 
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
    //盘库详情
    getLibraryDetails(id:number,audit_status:number){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"id":id,"audit_status":0}],   //audit_status单据状态
            "oper":"STOCK_DETAIL",
            "pagination":null
        }).then(res=>{   
            return Promise.resolve(res);
        });
    }

    //查询盘库单
    getEnquiryList(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "bill_no":"11",
                "end_date":"2018-08-27",
                "begin_date":"2018-08-27",
                "warehouse_id":""
            }],
            "oper":"INVENTORY_QUERY",
            "pagination":[{"asc":false,"orderby":null,"pageno":1,"pagesize":20,"totalcount":0}]
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    //模板导入
    getTemplateImport(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"warehouse_id":"44"}],
            "oper":"INVENTORY_TEMPLATE",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    //模板详情
    getTemplateDetails(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "template_id":"25",   //模板id
                "flag":"week_inventory",  //盘点类型
                "warehouse_id":"39"  //仓库id
            }],
            "oper":"TEMPLATE_DETAIL",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    //盘点批量类型导入（点击盘点类型导入）  新增盘点类型导入
    getInventorytypeImport(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "flag":"week_inventory",  //盘点类型
                "warehouse_id":"44"
            }],   
            "oper":"BATCH_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    //新增盘点
    getAdditionalcheckList(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "rows":[{"material_id":"10"}],//物料id
                "entry_name":"zyl",    //制单人姓名
                "bill_status":1,       //单据状态
                "bill_type_name":"周盘",   //单据盘点类型名称
                "warehouse_id":"45",      //仓库id
                "bill_type":"week_inventory",   //单据盘点类型
                "stock_count_mode_name":"按照当前库存量处理",  //未盘处理方式
                "busi_date":"2018-08-16",      //盘点日期
                "organ_brief_code":"CN0007",  //仓库简编码
                "stock_count_mode":"is_quanlity"  //未盘处理方式编号
            }],
            "oper":"CREATE_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    //审核盘点单（不通过）
    getAuditchecklistno(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "audit_name":"zyl",  //审核人
                "id":144,         //单据id
                "opinion":" ",    //备注   
            }],
            "oper":"REVIEW_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    //审核盘点单（通过）
    getAuditchecklistyes(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            data:[{
                "store_name":"测试专用_测试门店8",
                "warehouse_name":"测试门店8仓库11",
                "audit_name":"zyl",
                "id":"144",
                "stock_count_mode":"is_quanlity",
                "organ_brief_code":"CN0007",
                "list":[{
                    "whole_num":"10",   //单据包含总量
                    "id":"905",     //物料id
                    "consume_num":"0",
                    "disperse_num":"0"
                }]
            }],
            "oper":"REVIEW_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }


    // 数据整理
    getDataSorting(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[],
            "oper":"ORGANIZE_DATA",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }
    
    //日盘周盘月盘入口
    getInventoryType(bill_type:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"bill_type":bill_type}],
            "oper":"CHECK_DAILYINVENTORY",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    // 动态加载仓库
    getWarehouse(inventory_type:string){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{"inventory_type":inventory_type}],
            "oper":"INVENTORY_WAREHOUSE",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    // 实盘录入
    getRealdiscEntry(){
        return Axios.post(`${this.reqUrl}inventory/post`,{
            "data":[{
                "list":[{
                    "whole_num":"10",  //采购单位
                    "id":"905",        //物料id
                    "consume_num":"0",  //消耗单位
                    "disperse_num":"0",  //库存主单位
                  }],
                "id":144,           //单据id
                "is_stock_report":1,   //是否实盘录入
                "stock_count_mode":"is_quanlity"  //未盘处理方式
            }],
            "oper":"ENTRY_STOCK",
            "pagination":null
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    //新增手工制单（模糊搜索）
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