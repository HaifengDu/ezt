import { BaseService } from "./BaseService";//接口请求的地址
import { ERequestType } from "../enum/ERequestType";//遍历请求接口的几个前缀
import Axios from "axios";
export class PublicAddGood extends BaseService{

    private static _instance: PublicAddGood;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    getGoodList(status:string,){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST",
        //     "pagination": pager
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    static createInstance() {
        PublicAddGood.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default PublicAddGood;