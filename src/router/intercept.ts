import Router from "vue-router";
import store from "../store"
import { CachePocily } from "../common/Cache";
import { cacheKey } from "../config/cacheKey";
import { ECache } from "../enum/ECache";
import { LoginService } from "../service/LoginService";
import { BOHLoginService } from '../service/BOHLoginService';
import ObjectHelper from "../common/objectHelper";
const cache = CachePocily.getInstance(ECache.LocCache);
const service = LoginService.getInstance();
const BOHservice = BOHLoginService.getInstance();
let user = cache.getData(cacheKey.USER_MODEL);
    user = ObjectHelper.parseJSON(user);
export function interceptRouter(router:Router):Router {
    
    router.beforeEach((to,form,next)=> {
        // 拦截点事情
        if (!to.matched.some(r => r.meta.noRequireAuth)&&!store.getters.user) {
            if(user&&user.auth.interface_systype=='BOH'){
                //BOH的自动登录，必须要先退出再登录
                BOHservice.autoLogout();  
                setTimeout(()=>{
                    BOHservice.autoLogin().then(()=>{//BOH
                        next();
                    },err=>{
                        next({
                            path: "/login"
                        });
                    }).catch(()=>{
                        next({
                            path: "/login"
                        });
                    });
                },2000)
               
            }else{
                service.autoLogin().then(()=>{//SAAS
                    next();
                },err=>{
                    next({
                        path: "/login"
                    });
                }).catch(()=>{
                    next({
                        path: "/login"
                    });
                });
                
            }
           
        }else{
            next();
        }
    });
    return router;
}