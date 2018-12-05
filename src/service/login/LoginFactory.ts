import store from "../store"
import BOHLoginService from "./BOHLoginService";
import LoginService from "./LoginService";
import { ILoginService } from "../../interface/service/ILoginService";
export class LoginFactory {

    private static _instance: LoginFactory;

    private constructor() {
    }

    public createService(): ILoginService{
        const isBOH = store.getters.InterfaceSysTypeBOH;
        if(isBOH){
            return BOHLoginService.getInstance();
        }
        return LoginService.getInstance();
    }

    static createInstance() {
        LoginFactory.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default LoginFactory;