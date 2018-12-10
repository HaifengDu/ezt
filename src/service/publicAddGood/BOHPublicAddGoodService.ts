import { BaseService } from "../BaseService";
import ERequestType from "../../enum/ERequestType";
import { CachePocily } from "../../common/Cache";
import CACHE_KEY from '../../constans/cacheKey'
import Axios from 'axios';
import { IPublicAddGoodService } from "../../interface/service/IPublicAddGoodService";
import ErrorMsg from "../../model/ErrorMsg";
import ObjectHelper from "../../common/objectHelper";
import { AxiosPromise } from 'axios';
import { promises } from "fs";
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
     * BOH版本  盘点选择货品（查物品）
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
     * 订货  查询分类
     * @param param 
     */
    getBohOrderClass(param:any):AxiosPromise<any>{
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/chooseOrderGoods`,{
            "id": 121,
            "supplierId": 21,
            "orderType" : "SCM_ORDER_TYPE_RULE",
            "warehouse_id": 618,
            "orderDate": "2018-11-26",
            "categoryId ": 12,
            "goodsSortId": "11",
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0   
            }          
        },config).then(res=>{ 
            let bb = res;
            bb.data.sortList = bb.data.categoryList;     
            bb.data.sortList.forEach((newitem:any)=>{
                    newitem.cdata = newitem.childs;
                    newitem.name = newitem.categoryName;
                    newitem.cdata.forEach((cdataItem:any)=>{
                        if(cdataItem.id ==0){
                            cdataItem.id = -1;
                        }
                        cdataItem.name = cdataItem.sortName
                    })
            })      
            return Promise.resolve(bb);
        });
    }
    /**
     * 订单  查物品
     * @param param 
     */
    getBohOrderGoods(param:any):AxiosPromise<any>{
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/queryOrderGoodsbyGoodsName`,{
            "supplierId": 21,
            "orderType" : "SCM_ORDER_TYPE_RULE",
            "warehouse_id": 618,
            "orderDate": "2018-11-24",
            "goodsName":"鸡翅",
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": 1, 
                "pagesize": 20, 
                "totalcount": 0
            }
        },config).then(res=>{              
            let bb = res;
            bb.data.goodsList.forEach((newitem:any)=>{
                newitem.material_id = newitem.goodsId;
                newitem.name = newitem.goodsName;
                newitem.num = newitem.currentQty;
            })      
            return Promise.resolve(bb);
        });
    }

    //==================================== 公共的查 分类、物品====================
    /**
     * 获取分类
     */
    getGoodClass(param:any):AxiosPromise<any>{
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        // if(!materialLimit){
        //     return Promise.reject(new ErrorMsg(false,"没有物品"));
        // }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询分类
            return this.getBohClassifiedSearch(param).then(res=>{//TODO:参数现在是写死的，需要自己传过来????
                return Promise.resolve(res);
            })
        }else if(materialLimit && materialLimit.billsPageType == 'orderGood'){
            debugger
            return this.getBohOrderClass(param).then(res=>{
                return Promise.resolve(res);
            })
        }else{//默认查询不到为空
            return Promise.resolve(null);
        }      
    }    
    /**
     * 获取分类对应的物品
     */
    getGoodList(param:any):AxiosPromise<any>{
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        // if(!materialLimit){
        //     return Promise.reject(new ErrorMsg(false,"没有物品"));
        // }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询物品
            return this.getBohItemCategory(param).then(res=>{//TODO:参数现在是写死的，需要自己传过来????
                return Promise.resolve(res);
            })
        }else if(materialLimit && materialLimit.billsPageType == 'orderGood'){//boh订单 查询物品
            debugger
            return this.getBohOrderGoods(param).then(res=>{
                return Promise.resolve(res);
            })
        }else{//默认查询不到为空
            return Promise.resolve(null);
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