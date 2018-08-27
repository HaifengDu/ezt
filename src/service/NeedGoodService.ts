import LoginService from "./LoginService";
import mixins from "../common/Mixin";
import { IUser } from "../interface/IUserModel";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import store from "../store"
import { IPagerData } from "../interface/IPagerData";
export class NeedGoodService extends BaseService{   

    private static _instance: NeedGoodService;
    private loginService:LoginService;
    private constructor() {   
        super(ERequestType.AppOrder)
        this.loginService = LoginService.getInstance();
    } 
    getPsList(pager:IPagerData){
        // const promise = Axios.post(`${this.reqUrl}/homepage/post`,{
        //     data: [], 
        //     "oper": "DC_STORES",
        //     "pagination": {"orderby":null,"asc":false,"pageno":1,"pagesize":20,"totalcount":0}
        // });
        const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/`)
        return promise;
    }
    static createInstance() {
        NeedGoodService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default NeedGoodService;