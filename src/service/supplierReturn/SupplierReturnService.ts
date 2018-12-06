import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import Axios from "axios";
import { ISupplierReturnService } from "../../interface/service/ISupplierReturnService";
import { IPagerData } from "../../interface/IPagerData";
export class SupplierReturnService extends BaseService implements ISupplierReturnService{

    private static _instance: SupplierReturnService;
    private constructor() {
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
    /**
     * 单据详情接口
     * @param id 单据id
     * @param type  单据类型
     */
    getGoodDetail(id:string,type:string){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise;
    }
    /**
     * 获取源单号
     * @param id 单据id
     */
    getSourceBillList(){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=55`);
        return promise;
    }
    static createInstance() {
        SupplierReturnService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default SupplierReturnService;