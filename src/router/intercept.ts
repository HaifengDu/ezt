import Router from "vue-router";
import store from "../store"
import { LoginService } from "../service/LoginService";
const service = LoginService.getInstance();
export function interceptRouter(router:Router):Router {
    router.beforeEach((to,form,next)=> {
        // 拦截点事情
        if (!to.matched.some(r => r.meta.noRequireAuth)&&!store.getters.user) {
            service.autoLogin().then(()=>{
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
    });
    return router;
}