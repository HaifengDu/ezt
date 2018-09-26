
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import store from "../store"
import { IPagerData } from "../interface/IPagerData";
export class OrderGoodsService extends BaseService{
    private static _instance: OrderGoodsService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    getGoodList(status:string,pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST",
        //     "pagination": pager
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }    

    getGoodDetail(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    static createInstance() {
        OrderGoodsService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default OrderGoodsService;