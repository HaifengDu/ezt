
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import store from "../store"
import { IPagerData } from "../interface/IPagerData";
export class SpilledSheetService extends BaseService{
    private static _instance: SpilledSheetService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    /**
     * 损溢单列表页
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
     * 损溢单详情页
     */
    getGoodDetail(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
    /**
     * 损溢单高级查询结果页
     * @param pager 
     */
    getGoodResult(pager:IPagerData){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
    static createInstance() {
        SpilledSheetService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default SpilledSheetService;