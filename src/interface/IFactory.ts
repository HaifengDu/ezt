import { IIndexService } from './service/IIndexService';
import { ILoginService } from "./service/ILoginService";
import { IInitStockService } from "./service/IInitStockService";


export interface IFactory{
    createLogin():ILoginService;//登录
    createInitStock():IInitStockService;//库存初始化
    createIndex():IIndexService;//首页操作
}