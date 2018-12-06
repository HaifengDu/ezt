import { BaseService } from "../BaseService";
import { IStoreAllotService } from "../../interface/service/IStoreAllotService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'axios';

export class BOHStoreAllotService extends BaseService implements IStoreAllotService{
    
    private static _instance: BOHStoreAllotService;

    private constructor(){
        super(ERequestType.Boh)
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

    static createInstance(){
        BOHStoreAllotService.getInstance();
    }
    
    static getInstance(){
        return this._instance || (this._instance = new this());
    }
}

export default BOHStoreAllotService;