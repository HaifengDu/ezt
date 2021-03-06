import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import Axios from "axios";
import { IPagerData } from "../../interface/IPagerData";
import { ILeadbackMaterialService } from "../../interface/service/ILeadbackMaterialService";
export class LeadbackMaterialService extends BaseService implements ILeadbackMaterialService{
    private static _instance: LeadbackMaterialService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
     
    /**
     * 列表页接口
     * @param status  
     * @param pager 
     */
    getGoodList(status:string,pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST",
        //     "pagination": pager
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }    
    /**
     *详情页
     * @param pager 
     */
    getGoodDetail(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
    /**
     * 高级查询结果页
     * @param pager 
     */
    getGoodResult(pager:IPagerData){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
    



    static createInstance() {
        LeadbackMaterialService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default LeadbackMaterialService;