import { CachePocily } from "../common/Cache";
import { cacheKey } from "../config/cacheKey";
import { ECache } from "../enum/ECache";
let cache = CachePocily.getInstance(ECache.LocCache);
let user = cache.getData(cacheKey.USER_MODEL);
export enum EGoodType{
    InterfaceSysTypeBOH=user.interface_systype,//后台接口是SAAS还是BOH
}