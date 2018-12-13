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
    getGoodList(param:any,pager:IPagerData){
        let config = { 
            headers: { 
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/receiveList`,{
            "receiveType":param.receiveType,
            "auditStatus":param.auditStatus,
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
     * 单据详情接口
     * @param receiveType 收货类型
     * @param id  单据id
     */
    getGoodDetail(param:any,pager:IPagerData){
        let config = { 
            headers: { 
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/findBillById`,{
            "receiveType":param.receiveType,
            "id":param.id,
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

    static createdInstance(){
        BOHReceiveGoodService.getInstance();
    }

    static getInstance(){
        return this._instance || (this._instance = new this());
    }
}

export default BOHReceiveGoodService;