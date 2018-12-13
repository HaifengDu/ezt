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
    getGoodList(status:string,pager:IPagerData){
        // let config = {
        //     headers: {
        //         'X-Requested-With': 'XMLHttpRequest'
        //     }
        // }
        return Axios.post(`${this.reqUrl}mobile/stock/receive/receiveList`,{
            "receiveType" : "SCM_RECEIVE_TYPE_INVOICE", 
            "auditStatus" : status, 
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            }
        }).then(res=>{         
            return Promise.resolve(res);
        });
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        // return promise;
    }
    /**
     * 单据详情接口
     * @param receiveType 收货类型
     * @param id  单据id
     */
    getGoodDetail(id:string,pager:IPagerData){
        return Axios.post(`${this.reqUrl}mobile/stock/receive/findBillById`,{
            "receiveType" : "SCM_RECEIVE_TYPE_INVOICE",
            "id" : 228,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            }
        }).then(res=>{        
            return Promise.resolve(res);
        });
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        // return promise;
    }

    static createdInstance(){
        BOHReceiveGoodService.getInstance();
    }

    static getInstance(){
        return this._instance || (this._instance = new this());
    }
}

export default BOHReceiveGoodService;