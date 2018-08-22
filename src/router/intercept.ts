import Router from "vue-router";

export function interceptRouter(router:Router):Router {
    router.beforeEach((to,form,next)=> {
        // 拦截点事情
        if (!to.matched.some(r => r.meta.noRequireAuth)) {
           //
        }
        next();
    });
    return router;
}