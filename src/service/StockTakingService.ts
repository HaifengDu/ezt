import LoginService from "./LoginService";
import mixins from "../common/Mixin";
import { IUser } from "../interface/IUserModel";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import store from "../store"  
import { IPagerData } from "../interface/IPagerData";
export class StockTakingService extends BaseService{   
    private static _instance: StockTakingService;
    private loginService:LoginService;
    private constructor() {   
        super(ERequestType.AppOrder)
        this.loginService = LoginService.getInstance();
    } 
    getInventoryList(pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}inventory/post`,{
        //     data: [{"status":"0"}], 
        //     "oper": "STOCK_LIST",
        //     "pagination": {"orderby":null,"asc":false,"pageno":1,"pagesize":20,"totalcount":0}
        // })
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=19`);
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/`)
        return promise;
    }
    static createInstance() {
        StockTakingService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default StockTakingService;