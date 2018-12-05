import { IFactory } from "../interface/IFactory";
import BOHIndexService from '../service/index/BOHIndexService';
import BOHLoginService from '../service/login/BOHLoginService';
import { ILoginService } from "../interface/service/ILoginService";
import { IIndexService } from "../interface/service/IIndexService";


export class BOHFactroyService implements IFactory {
    createInitStock(): import("f:/wamp/www/ezt-h5web/ezt/src/interface/service/IInitStockService").IInitStockService {
        throw new Error("Method not implemented.");
    }

    public createLogin(): ILoginService{
        return BOHLoginService.getInstance();
    }

    public createIndex(): IIndexService{
        return BOHIndexService.getInstance();
    }

    private static _instance: BOHFactroyService;

    private constructor() {
    }

    static createInstance() {
        BOHFactroyService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}