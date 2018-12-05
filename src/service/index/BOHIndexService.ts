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
    /**
     * 修改密码
     * @param user 
     */
  /*   modifyPassword(oldPasswd:string,newPasswd:string){
        let user = this.cache.getData(cacheKey.USER_MODEL);
        let userName = JSON.parse(user);
        let oldhash = crypto.createHash("md5");
        let newhash = crypto.createHash("md5");
        let enoldPasswd = oldhash.update((<string>oldPasswd).trim()).digest('hex');
        let ennewPasswd = newhash.update((<string>newPasswd).trim()).digest('hex');
        return Axios.post(`${this.reqUrl}login/post`,{
            data: [{
                user_name:userName.loginname,
                old_passwd:(<string>enoldPasswd).toString(),
                new_passwd:(<string>ennewPasswd).toString()
            }],
            "oper": "MODIFY_PASSWORD",
            "pagination": null,
        }).then(res=>{
            return this.logout().then(()=>res);
        });
    } */

    static createInstance() {
        BOHIndexService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default BOHIndexService;