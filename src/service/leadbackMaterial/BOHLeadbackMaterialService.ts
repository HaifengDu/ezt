import { BaseService } from "../BaseService";
import { ILeadbackMaterialService } from "../../interface/service/ILeadbackMaterialService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'axios';

export class BOHLeadbackMaterialService extends BaseService implements ILeadbackMaterialService{   
    
    private static _instance: BOHLeadbackMaterialService;

    private constructor(){
        super(ERequestType.Boh)
    }

     /**
     * 列表
     * @param status 
     * @param pager 
     */
    getGoodList(status:string,pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST",
        //     "pagination": pager
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }    
    /**
     * 详情页
     */
    getGoodDetail(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }

    static createInstance(){
        BOHLeadbackMaterialService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this() );
    }
}

export default BOHLeadbackMaterialService;