import LoginService from "./LoginService";
import mixins from "../common/Mixin";
import { IUser } from "../interface/IUserModel";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import store from "../store"
import { IPagerData } from "../interface/IPagerData";
export class SupplierReturnService extends BaseService{

    private static _instance: SupplierReturnService;
    private loginService:LoginService;
    private constructor() {
        super(ERequestType.AppOrder)
        this.loginService = LoginService.getInstance();
    }
    getGoodList(pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{'bill_type': 'dc_out',
        //         "bill_status":"2"}],
        //     "oper": "RETURN_ORDER_LIST",
        //     "pagination": {"orderby":null,"asc":false,"pageno":1,"pagesize":20,"totalcount":0}
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
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