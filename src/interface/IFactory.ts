import { IIndexService } from './service/IIndexService';
import { ILoginService } from "./service/ILoginService";
import { IInitStockService } from "./service/IInitStockService";
import { IInStoreAllotService } from './service/IInStoreAllotService';
import { IReceiveGoodService } from './service/IReceiveGoodService';
import { ISupplierReturnService } from './service/ISupplierReturnService';
import { IStoreAllotService } from './service/IStoreAllotService';
import { IOrderGoodsService } from './service/IOrderGoodsService';
import { IPublicAddGoodService } from './service/IPublicAddGoodService';


export interface IFactory{
    createLogin(): ILoginService;//登录
    createInitStock(): IInitStockService;//库存初始化
    createIndex(): IIndexService;//首页操作
    createInStoreAllot(): IInStoreAllotService;//店内调拨
    createReceiveGood(): IReceiveGoodService;//收货
    createSupplierReturn(): ISupplierReturnService;//退货
    createStoreAllot(): IStoreAllotService;//店间平调
    createOrderGood(): IOrderGoodsService; //订货
    createPublicGood(): IPublicAddGoodService;//《公共》 的选择物料
}