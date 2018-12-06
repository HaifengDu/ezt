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
import { ISupplierReturnService } from "../interface/service/ISupplierReturnService";
import SupplierReturnService from "../service/supplierReturn/SupplierReturnService";
import { IStoreAllotService } from "../interface/service/IStoreAllotService";
import StoreAllotService from "../service/storeAllot/StoreAllotService";

export class SaasFactroyService implements IFactory { 

    public createLogin(): ILoginService{//saas登录
        return LoginService.getInstance();
    }

    public createIndex(): IIndexService{//saas首页操作
        return IndexService.getInstance();
    }

    public createInitStock(): IInitStockService{//saas库存初始化
        return InitStockService.getInstance();
    }

    public createInStoreAllot(): IInStoreAllotService{//saas店内调拨
        return InStoreAllotService.getInstance();
    }

    public createReceiveGood(): IReceiveGoodService{//saas收货
        return ReceiveGoodService.getInstance();
    }

    public createSupplierReturn(): ISupplierReturnService{//saas退货
        return SupplierReturnService.getInstance();
    }

    public createStoreAllot(): IStoreAllotService{//saas店间平调
        return StoreAllotService.getInstance();
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