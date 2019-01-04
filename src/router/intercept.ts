import Router from "vue-router";
import store from "../store"
import { FactoryService } from "../factory/FactoryService";
const factory = FactoryService.getInstance().createFactory();

export function interceptRouter(router:Router):Router {
    
    router.beforeEach((to,form,next)=> {  
        // 拦截点事情
        if (!to.matched.some(r => r.meta.noRequireAuth)&&!store.getters.user) {
            const service = factory.createLogin();
            service.autoLogin().then(()=>{//BOH
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
           
        }else{
            next();
        }

        //禁止浏览器使用回退键
        let allowBack = true  
        if (to.meta.allowBack !== undefined) {
            allowBack = to.meta.allowBack
        }
        if (!allowBack) {
            history.pushState(null, null, location.href)
           
        }    
    });
    return router;
}