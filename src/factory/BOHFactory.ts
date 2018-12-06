import { IFactory } from "../interface/IFactory";
import BOHIndexService from '../service/index/BOHIndexService';
import BOHLoginService from '../service/login/BOHLoginService';
import { ILoginService } from "../interface/service/ILoginService";
import { IIndexService } from "../interface/service/IIndexService";
import { IInitStockService } from "../interface/service/IInitStockService";
import BOHInitStockService from "../service/initStock/BOHInitStockService";
import { IInStoreAllotService } from "../interface/service/IInStoreAllotService";
import BOHInStoreAllotService from "../service/inStoreAllot/BOHInStoreAllotService";
import { IReceiveGoodService } from "../interface/service/IReceiveGoodService";
import BOHReceiveGoodService from "../service/receiveGood/BOHReceiveGoodService";


export class BOHFactroyService implements IFactory {   

    public createLogin(): ILoginService{
        return BOHLoginService.getInstance();
    }

    public createIndex(): IIndexService{
        return BOHIndexService.getInstance();
    }

    public createInitStock(): IInitStockService{
        return BOHInitStockService.getInstance();
    }

    public createInStoreAllot(): IInStoreAllotService{
        return BOHInStoreAllotService.getInstance();
    }

    public createReceiveGood(): IReceiveGoodService{
        return BOHReceiveGoodService.getInstance();
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