import LoginService from "./LoginService";
import mixins from "../common/Mixin";
import { BaseService } from "./BaseService";
import { ERequestType } from "../enum/ERequestType";

import Axios from "axios";
export class ReceiveGoodService extends BaseService{

    private static _instance: ReceiveGoodService;
    private loginService:LoginService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    
    static createInstance() {
        ReceiveGoodService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default ReceiveGoodService;