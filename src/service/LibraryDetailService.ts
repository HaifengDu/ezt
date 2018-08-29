import LoginService from "./LoginService";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import Axios from "axios";
import { IPagerData } from "../interface/IPagerData";
export class LibraryDetailService extends BaseService{   
    private static _instance: LibraryDetailService;
    private loginService:LoginService;
    private constructor() {   
        super(ERequestType.AppOrder)
        this.loginService = LoginService.getInstance();
    } 
    getInventoryDetails(pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}inventory/post`,{
        //     data: [{"status":"0"}], 
        //     "oper": "STOCK_LIST",
        //     "pagination": {"orderby":null,"asc":false,"pageno":1,"pagesize":20,"totalcount":0}
        // })
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=20`);
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/`)
        return promise;
    }
    static createInstance() {
        LibraryDetailService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default LibraryDetailService;