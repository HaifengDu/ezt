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
    getGoodList(audit_status:string,pager:IPagerData){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/getOrders`,{
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
     * 详情页
     */
    getGoodDetail(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }

    static createInstance(){
        BOHOrderGoodsService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this() );
    }
}

export default BOHOrderGoodsService;