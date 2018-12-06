import { BaseService } from "../BaseService";
import { IInStoreAllotService } from "../../interface/service/IInStoreAllotService";
import ERequestType from "../../enum/ERequestType";
import { IPagerData } from "../../interface/IPagerData";
import Axios from 'Axios';

export class BOHInStoreAllotService extends BaseService implements IInStoreAllotService{

    private static _instance: BOHInStoreAllotService;

    private constructor() {
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
        BOHInStoreAllotService.getInstance();
    }

    static getInstance(){
        return this._instance || (this._instance = new this());
    }
}

export default BOHInStoreAllotService;