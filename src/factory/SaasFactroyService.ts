import { IFactory } from "../interface/IFactory";
import { ILoginService } from "../interface/service/ILoginService";
import LoginService from "../service/login/LoginService";
import { IIndexService } from "../interface/service/IIndexService";
import IndexService from "../service/index/IndexService";
import { IInitStockService } from "../interface/service/IInitStockService";
import InitStockService from "../service/initStock/InitStockService";
import { IInStoreAllotService } from "../interface/service/IInStoreAllotService";
import InStoreAllotService from "../service/inStoreAllot/InStoreAllotService";
import { IReceiveGoodService } from "../interface/service/IReceiveGoodService";
import ReceiveGoodService from "../service/receiveGood/ReceiveGoodService";

export class SaasFactroyService implements IFactory { 

    public createLogin(): ILoginService{
        return LoginService.getInstance();
    }

    public createIndex(): IIndexService{
        return IndexService.getInstance();
    }

    public createInitStock(): IInitStockService{
        return InitStockService.getInstance();
    }

    public createInStoreAllot(): IInStoreAllotService{
        return InStoreAllotService.getInstance();
    }

    public createReceiveGood(): IReceiveGoodService{
        return ReceiveGoodService.getInstance();
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