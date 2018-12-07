import { BaseService } from "../BaseService";
import ERequestType from "../../enum/ERequestType";
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import CACHE_KEY from '../../constans/cacheKey'
import Axios from 'axios';
import { IPublicAddGoodService } from "../../interface/service/IPublicAddGoodService";
import ErrorMsg from "../../model/ErrorMsg";
import ObjectHelper from "../../common/objectHelper";
const _this = this;
export class BOHPublicAddGoodService extends BaseService implements IPublicAddGoodService{

    private cache = CachePocily.getInstance();
    private static _instance: BOHPublicAddGoodService;    
    
    // if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
    // materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
    // } 

    private constructor(){
        super(ERequestType.Boh)
    }
     /**
     * BOH版本   编制盘点单新增物品  （按分类检索）
     * @param bill_type 
     */
    getBohClassifiedSearch(param:any){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/chooseStockTakingGoods`,{
            "bill_type": param.bill_type, 
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }

     /**
     * BOH版本  盘点选择货品（切换物品类别）
     * @param bill_type 
     * @param goodsSortId 
     */
    getBohItemCategory(param:any){
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/chooseStockTakingGoods`,{
            "bill_type":param.bill_type, 
            "goodsSortId":param.goodsSortId,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0
            }
        },config).then(res=>{              
            return Promise.resolve(res);
        });
    }
    /**
     * 获取分类
     */
    getGoodClass(param:any){
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        if(!materialLimit){
            return Promise.reject(new ErrorMsg(false,"没有物品"));
        }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询分类
            debugger
            return this.getBohClassifiedSearch(param).then(res=>{//TODO:参数现在是写死的，需要自己传过来????
                return Promise.resolve(res);
            })
        }      
    }
    /**
     * 获取分类对应的物品
     */
    getGoodList(param:any){
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        if(!materialLimit){
            return Promise.reject(new ErrorMsg(false,"没有物品"));
        }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询分类
            debugger
            return this.getBohItemCategory(param).then(res=>{//TODO:参数现在是写死的，需要自己传过来????
                return Promise.resolve(res);
            })
        }     
    }
    
     
    static createInstance(){
        BOHPublicAddGoodService.getInstance();
    }
    
    static getInstance(){
        return this._instance || ( this._instance = new this());
    }
}

export default BOHPublicAddGoodService;