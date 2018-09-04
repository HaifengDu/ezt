import { IUser } from "../interface/IUserModel";
import ErrorMsg from "../model/ErrorMsg";
import Axios from "axios";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";
import crypto from "crypto-browserify";
import { CachePocily } from "../common/Cache";
import { cacheKey } from "../config/cacheKey";
import { ECache } from "../enum/ECache";
import store from "../store"
import RootType from "../store/mutation-types";
import ObjectHelper from "../common/objectHelper";
export class LoginService extends BaseService{

    private cache = CachePocily.getInstance(ECache.LocCache);
    private user:IUser;
    private static _instance: LoginService;

    private constructor() {
        super(ERequestType.AppOrder)
    }
    
    private check(user:IUser){
        if(!user.shopname){
            return new ErrorMsg(false,"商户名不能为空");
        }
        if(!user.loginname){
            return new ErrorMsg(false,"用户名不能为空");
        }
        if(!user.pwd){
            return new ErrorMsg(false,"密码不能为空");
        }
        return new ErrorMsg(true)
    }

    public getUser(){
        return this.user;
    }
    //登录
    login(user:IUser){
        const checkResult = this.check(user);
        if(!checkResult.success){
            return Promise.reject(checkResult);
        }
        let hash = crypto.createHash("md5");
        user.encrypwd = hash.update((<string>user.pwd).trim()).digest('hex');
        return Axios.post(`${this.reqUrl}login/post`,{
            data: [{
                username:user.loginname,
                password:(<string>user.encrypwd).toString(),
                push_token:1
            }],
            "oper": "SIGN_IN",
            "pagination": null,
            "store_id": null,
            "tenancy_id": user.shopname,
            "timestamp": 0 
        }).then(res=>{
            const auth = res.data.data[0];
            if(!auth){
                return Promise.reject(new ErrorMsg(false,"服务器内部错误"));
            }
            user.auth = auth;
            user.store_id = res.data.store_id;
            this.cache.save(cacheKey.USER_MODEL,JSON.stringify(user));
            store.commit(RootType.UPDATE_USER,user);
            this.user = user;
            return Promise.resolve(res);
        });
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        // return promise;
    }
    
    autoLogin(){
        let user = this.cache.getData(cacheKey.USER_MODEL);
        if(!user){
            return Promise.reject(new ErrorMsg(false,"未获取用户"));
        }
        user = ObjectHelper.parseJSON(user);
        return this.login(user);
    }
    /**
     * 退出登录
     */
    logout(){
        return Axios.post(`${this.reqUrl}login/post`,{
            data: [{}],
            "oper": "SIGN_OUT",
            "pagination": null,
        }).then(res=>{
            this.cache.clear();
        });
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

    static createInstance() {
        LoginService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default LoginService;