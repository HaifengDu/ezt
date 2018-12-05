import { IFactory } from "../interface/IFactory";
import { ILoginService } from "../interface/service/ILoginService";
import LoginService from "../service/login/LoginService";
import { IIndexService } from "../interface/service/IIndexService";
import IndexService from "../service/index/IndexService";

export class SaasFactroyService implements IFactory {
    createInitStock(): import("f:/wamp/www/ezt-h5web/ezt/src/interface/service/IInitStockService").IInitStockService {
        throw new Error("Method not implemented.");
    }

    public createLogin(): ILoginService{
        return LoginService.getInstance();
    }

    public createIndex(): IIndexService{
        return IndexService.getInstance();
    }

    private static _instance: SaasFactroyService;

    private constructor() {
    }

    static createInstance() {
        SaasFactroyService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}