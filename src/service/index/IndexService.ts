import Axios from "axios";
import { BaseService } from "../BaseService";
import { ERequestType } from "../../enum/ERequestType";
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import { IIndexService } from "../../interface/service/IIndexService";
export class IndexService extends BaseService implements IIndexService{

    private cache = CachePocily.getInstance(ECache.LocCache);
    private static _instance: IndexService;

    private constructor() {
        super(ERequestType.AppOrder)
    }
    /**
     * 日结
     * @param param 
     */
    checkDay(date:string){
        const promise = Axios.post(`${this.reqUrl}operatedayend/post`,{
            data: [{"day_count":date}],
            "oper": "ORDER_SCHEDULE",
            "pagination": null
        });
        return promise;
    }
    /**
     * 查询余额
     */
    checkBalance(){
        return Axios.post(`${this.reqUrl}operateorder/post`,{
            data: [{}],
            "oper": "BALANCE_AMOUNT",
        }).then(res=>{           
            return Promise.resolve(res);
        });
    }

    static createInstance() {
        IndexService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default IndexService;