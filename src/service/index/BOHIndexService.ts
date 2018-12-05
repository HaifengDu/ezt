import ErrorMsg from "../../model/ErrorMsg";
import Axios from "axios";
import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import { CachePocily } from "../../common/Cache";
import { cacheKey } from "../../config/cacheKey";
import { ECache } from "../../enum/ECache";
import store from "../../store"
import RootType from "../../store/mutation-types";
import ObjectHelper from "../../common/objectHelper";
import { IIndexService } from "../../interface/service/IIndexService";
import { AxiosPromise } from "axios";
import IUser from "../../interface/IUserModel";
export class BOHIndexService extends BaseService implements IIndexService{

    private cache = CachePocily.getInstance(ECache.LocCache);
    private static _instance: BOHIndexService;

    private constructor() {
        super(ERequestType.Boh)
    }
    /**
     * 日结
     * @param param 
     */
    checkDay(date:string): AxiosPromise<any>{
        return null;
        // return Promise.resolve({} as any);
      /*   const promise = Axios.post(`${this.reqUrl}operatedayend/post`,{
            data: [{"day_count":date}],
            "oper": "ORDER_SCHEDULE",
            "pagination": null
        });
        return promise; */
    }
    /**
     * 查询余额
     */
    checkBalance(){
        return Promise.resolve({} as any);
       /*  return Axios.post(`${this.reqUrl}operateorder/post`,{
            data: [{}],
            "oper": "BALANCE_AMOUNT",
        }).then(res=>{           
            return Promise.resolve(res);
        }); */
    }
    static createInstance() {
        BOHIndexService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default BOHIndexService;