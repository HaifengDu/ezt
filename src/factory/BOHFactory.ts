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
import { ISupplierReturnService } from "../interface/service/ISupplierReturnService";
import BOHSupplierReturnService from "../service/supplierReturn/BOHSupplierReturnService";
import { IStoreAllotService } from "../interface/service/IStoreAllotService";
import BOHStoreAllotService from "../service/storeAllot/BOHStoreAllotService";
import { IOrderGoodsService } from "../interface/service/IOrderGoodsService";
import BOHOrderGoodsService from "../service/orderGood/BOHOrderGoodsService";
import { IPublicAddGoodService } from "../interface/service/IPublicAddGoodService";
import BOHPublicAddGoodService from "../service/publicAddGood/BOHPublicAddGoodService";
import { IStockTakingService } from "../interface/service/IStockTakingService";
import BOHStockTakingService from "../service/stockTaking/BOHStockTakingService";
import { ILeadbackMaterialService } from "../interface/service/ILeadbackMaterialService";
import BOHLeadbackMaterialService from "../service/leadbackMaterial/BOHLeadbackMaterialService";
import { ISpilledSheetService } from "../interface/service/ISpilledSheetService";
import BOHSpilledSheetService from "../service/spilledSheet/BOHSpilledSheetService";


export class BOHFactroyService implements IFactory {   

    public createLogin(): ILoginService{ //BOH登录
        return BOHLoginService.getInstance();
    }

    public createIndex(): IIndexService{ //boh首页操作功能
        return BOHIndexService.getInstance();
    }

    public createInitStock(): IInitStockService{ //boh库存初始化
        return BOHInitStockService.getInstance();
    }

    public createInStoreAllot(): IInStoreAllotService{//boh店内调拨
        return BOHInStoreAllotService.getInstance();
    }

    public createReceiveGood(): IReceiveGoodService{ //boh收货
        return BOHReceiveGoodService.getInstance();
    }

    public createSupplierReturn(): ISupplierReturnService{ //boh退货
        return BOHSupplierReturnService.getInstance();
    }

    public createStoreAllot(): IStoreAllotService{ //boh 店间平调
        return BOHStoreAllotService.getInstance();
    }
    
    public createOrderGood(): IOrderGoodsService{ //订货
        return BOHOrderGoodsService.getInstance();
    }

    public createPublicGood(): IPublicAddGoodService{//boh选择物料
        return BOHPublicAddGoodService.getInstance();
    }

    public createStockTaking(): IStockTakingService{  //盘库
        return BOHStockTakingService.getInstance();
    }

    public createLeadbackMaterial(): ILeadbackMaterialService{  //领退料
        return BOHLeadbackMaterialService.getInstance();
    }

    public createSpilledSheet(): ISpilledSheetService{  //损溢单
        return BOHSpilledSheetService.getInstance();
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