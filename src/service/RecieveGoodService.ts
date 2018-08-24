import LoginService from "./LoginService";
import mixins from "../common/Mixin";

class RecieveGoodService {

    private static _instance: RecieveGoodService;
    loginService:LoginService;

    private constructor() {
        this.loginService = LoginService.getInstance();
    }

    test(){
        this.loginService.login
    }

    static createInstance() {
        RecieveGoodService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

mixins(RecieveGoodService,LoginService)