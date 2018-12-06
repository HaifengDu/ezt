import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import Axios from 'axios';
import { IStoreAllotService } from "../../interface/service/IStoreAllotService";
import { IPagerData } from "../../interface/IPagerData";
export class StoreAllotService extends BaseService implements IStoreAllotService{
    private static _instance:StoreAllotService;
    private constructor(){
        super(ERequestType.AppOrder)
    }

     /**
     * 列表页接口
     * @param status 单据状态
     * @param pager  分页数据
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
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
export default StoreAllotService;