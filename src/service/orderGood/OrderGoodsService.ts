
import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import Axios from "axios";
import { IPagerData } from "../../interface/IPagerData";
import { IOrderGoodsService } from "../../interface/service/IOrderGoodsService";
export class OrderGoodsService extends BaseService implements IOrderGoodsService{
    private static _instance: OrderGoodsService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    /**
     * 订货列表
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
    getGoodDetail(id:string){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
     /**
     * 删除待审核单据
     */
    getDeleteOrder(id:string){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
    /**
     * 高级查询明细
     * @param pager 
     */
    getGoodResult(pager:IPagerData){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }    
    /**
     * 审核要货单提交  提交并审核
     */
    getAuditorderlistyes(data:object){
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        return promise;
    }
     /**
     * 获取配送机构
     */
    getSupplierList(){
        return Promise.resolve([] as any);
    }
    /**
     * 订单新增 保存
     */
    saveOrder(){
        return Promise.resolve([] as any);
    }
    static createInstance() {
        OrderGoodsService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default OrderGoodsService;