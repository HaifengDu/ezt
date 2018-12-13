import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import Axios from "axios";
import { IPagerData } from "../../interface/IPagerData";
import { IReceiveGoodService } from "../../interface/service/IReceiveGoodService";
export class ReceiveGoodService extends BaseService implements IReceiveGoodService{

    private static _instance: ReceiveGoodService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    /**
     * 列表页接口
     * @param status 单据状态
     * @param pager  分页数据
     */
    getGoodList(param:any,pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST", 
        //     "pagination": pager
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    /**
     * 单据详情接口
     * @param receiveType 
     * @param id 
     * @param pager 
     */
    getGoodDetail(id:string,pager:IPagerData){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    /**
     * 校验仓库物品是否存在
     */
    checkWarehouse(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    static createInstance() {
        ReceiveGoodService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default ReceiveGoodService;