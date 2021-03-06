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
import { ILoginService } from "../../interface/service/ILoginService";
import IUser from "../../interface/IUserModel";
export class BOHLoginService extends BaseService implements ILoginService{

    private cache = CachePocily.getInstance(ECache.LocCache);
    private static _instance: BOHLoginService;

    private constructor() {
        super(ERequestType.Boh)
    }
    private check(user:IUser){
        if(!user.loginname){
            return new ErrorMsg(false,"用户名不能为空");
        }
        if(!user.pwd){
            return new ErrorMsg(false,"密码不能为空");
        }
        return new ErrorMsg(true)
    }

    //登录 BOH
    login(user:IUser){
        const checkResult = this.check(user);
        if(!checkResult.success){
            return Promise.reject(checkResult);
        }
        // let hash = crypto.createHash("md5");
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        // user.encrypwd = hash.update((<string>user.pwd).trim()).digest('hex');
        return Axios.post(`${this.reqUrl}login`,{
            username:user.loginname,
            password:user.pwd,
            source:"H5UI" 
        },config).then(res=>{
            const auth = res.data.data[0];
            if(!auth){
                return Promise.reject(new ErrorMsg(false,"服务器内部错误"));
            }
            user.auth = auth;
            user.store_id = res.data.store_id;
            this.cache.save(cacheKey.USER_MODEL,JSON.stringify(user));
            store.commit(RootType.UPDATE_USER,user);
            store.commit(RootType.SET_INTERFACESYSTYPEBOH,auth.interface_systype=='BOH')
            console.log(store.getters.InterfaceSysTypeBOH,'后台接口为BOH')
            return Promise.resolve(res);
        });
        // const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        // return promise;
    }
    autoLogin(){
        let user = this.cache.getDataOnce(cacheKey.USER_MODEL);
        if(!user){
            return Promise.reject(new ErrorMsg(false,"未获取用户"));
        }
        user = ObjectHelper.parseJSON(user);        
        return this.autoLogout().then(() => this.login(user));      
    }
    /**
     * BOH 自动退出
     */
    private autoLogout(){
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }       
        return Axios.post(`${this.reqUrl}logout`,{
            source: 'H5UI'
        },config).then(res=>{
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    store.commit(RootType.DELETE_USER);
                    resolve(res);
                },2000);
            });
        });
    }
    /**
     * BOH 退出登录
     */
    logout(){
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}logout`,{
           source: 'H5UI'
        },config).then(res=>{
            this.cache.clear();
            setTimeout(()=>{
                store.commit(RootType.DELETE_USER);
            });
            return res;
        });
    }


    /**   
     * 个人信息
     */
    getPersonal(){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}/getUserInfo`,{
              
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
   
    /**
     * 日结
     * @param param 
     */
   /*  checkDay(date:string){
        const promise = Axios.post(`${this.reqUrl}operatedayend/post`,{
            data: [{"day_count":date}],
            "oper": "ORDER_SCHEDULE",
            "pagination": null
        });
        return promise;
    } */
    /**
     * 查询余额
     */
    /* checkBalance(){
        return Axios.post(`${this.reqUrl}operateorder/post`,{
            data: [{}],
            "oper": "BALANCE_AMOUNT",
        }).then(res=>{           
            return Promise.resolve(res);
        });
    } */
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
        BOHLoginService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default BOHLoginService;