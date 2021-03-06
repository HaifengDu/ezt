import { BaseService } from "../BaseService";
import ERequestType from "../../enum/ERequestType";
import { CachePocily } from "../../common/Cache";
import CACHE_KEY from '../../constans/cacheKey'
import Axios from 'axios';
import { IPublicAddGoodService } from "../../interface/service/IPublicAddGoodService";
import ObjectHelper from "../../common/objectHelper";
import { AxiosPromise } from 'axios';
import { IPagerData } from "../../interface/IPagerData";
import formData from '../../dictory/formData';
export class BOHPublicAddGoodService extends BaseService implements IPublicAddGoodService{
    private cache = CachePocily.getInstance();   
    private static _instance: BOHPublicAddGoodService;  
    
    private constructor(){
        super(ERequestType.Boh)   
    }
     /** 
     * BOH版本   编制盘点单新增物品  （按分类检索）
     * @param bill_type      
     */
    getBohClassifiedSearch(param:any,pager:IPagerData):AxiosPromise<any>{
        let firstIds = {};
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        if(param.stockGoodsSortId ==-1 || (param.stockGoodsSortId==0 && !isNaN(param.stockGoodsSortId))){
            firstIds = {
                "goodsSortId": param.categoryId,
            }
        }else{
            firstIds = {
                "goodsSortId": param.goodsSortId,
            }    
        }
        var p = {
            "bill_type": param.bill_type, 
            "id": -1, 
            "pagination": {
                "orderby": "",    
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            },...firstIds
        }
        if(param.id){
            p.id = param.id;
        }
        return Axios.post(`${this.reqUrl}mobile/stock/taking/chooseStockTakingGoods`,p,config).then(res=>{    
            let bb = res; 
            if(bb.data.sortList&&bb.data.sortList.length>=0){//既查分类，也查物品
                bb.data.sortList.forEach((item:any)=>{
                    if(item.cdata&&item.cdata[0].goodsList&&item.cdata[0].goodsList.length>=0){
                        /**
                         * 转一下 publicGood里面页面显示字段
                         */
                        formData.modifyParams( item.cdata[0].goodsList, {
                            distributePrice1:'price',
                            unit_name:'unitName',
                            material_name:'name',
                            // disperse_num:'num',
                        }); 
                    }
                })               
            }
            formData.modifyParams(bb.data.goodsList,{
                distributePrice1:'price',
                unit_name:'unitName',
                material_name:'name',
                // disperse_num:'num',
            })

           return Promise.resolve(bb);
        });
    }

     /**
     * BOH版本  盘点选择货品（查物品）
     * @param bill_type 
     * @param goodsSortId 
     */
    getBohItemCategory(param:any,pager:IPagerData):AxiosPromise<any>{
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
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            }
        },config).then(res=>{  
            let bb = res;
            if(bb.data.sortList&&bb.data.sortList.length>=0){
                bb.data.sortList.forEach((item:any)=>{
                    if(item.cdata&&item.cdata[0].goodsList&&item.cdata[0].goodsList.length>=0){
                        /**
                         * 转一下 publicGood里面页面显示字段
                         */
                        formData.modifyParams( item.cdata[0].goodsList, {
                            distributePrice1:'price',
                            unit_name:'unitName',
                            material_name:'name',
                            // disperse_num:'num',
                        }); 
                    }
                })               
            }  
            formData.modifyParams(bb.data.goodsList,{
                distributePrice1:'price',
                unit_name:'unitName',
                material_name:'name',
                // disperse_num:'num',
            })
            return Promise.resolve(bb);
        });
    }
    /**
     * 订货  查询分类
     * @param param 
     * @pager 分页
     */
    getBohOrderClass(param:any,pager:IPagerData):AxiosPromise<any>{  //既查分类，也查物品
        let firstIds = {};
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }   
        if(param.stockGoodsSortId ==-1 || (param.stockGoodsSortId==0 && !isNaN(param.stockGoodsSortId))){
            firstIds = {
                "categoryId": param.categoryId,
            }
        }else{
            firstIds = {
                "categoryId": param.categoryId,
                "goodsSortId": param.stockGoodsSortId,
                // "goodsName":param.orderGoodsName,   
            }
            // if(param['goodsName']){
            //     firstIds['goodsName'] = param['goodsName'];
            // }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/chooseOrderGoods`,{
            "id": param.id || '',
            "supplierId": param.supplierId,//21
            "orderType" : param.orderType,
            "orderDate": param.orderDate,//"2018-11-24"
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0   
            },...firstIds         
        },config).then(res=>{ 
            let bb = res;
            /**
             * 转一下 publicGood里面页面显示字段
             */
            formData.modifyParams( bb.data, {
                categoryList:'sortList',
                categoryName:'name',
                categoryId:'id',
                childs:'cdata',   
                sortName:'name', 
                memo:'remark',
            });
            formData.modifyParams( bb.data.goodsList, {
                memo:'remark',
                goodsName:'name',
                distributePrice1:'price',
                goodsId:'material_id',
                finalOrderQty:'num'

            });
            return Promise.resolve(bb);
        });
    } 
    /**
     * 订单  查物品
     * @param param //接口所传的参数
     * @param pager //分页
     */
    getBohOrderGoods(param:any,pager:IPagerData):AxiosPromise<any>{
        let firstIds = {};
        if(param.stockGoodsSortId ==-1 || (param.stockGoodsSortId==0 && !isNaN(param.stockGoodsSortId))){
            firstIds = {}
        }else{
            firstIds = {
                "categoryId": param.categoryId,
                "goodsSortId": param.stockGoodsSortId,
                "goodsName":param.orderGoodsName,
            }
            if(param['goodsName']){
                firstIds['goodsName'] = param['goodsName'];
            }
        }
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/queryOrderGoodsbyGoodsName`,{
            "supplierId": param.supplierId,//21,
            "orderType" : param.orderType,
            "orderDate": param.orderDate,//"2018-11-24",           
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            },...firstIds
        },config).then(res=>{ 
            let bb = res;  
             /**
             * 转一下 publicGood里面页面显示字段
             */
            formData.modifyParams( bb.data.goodsList, {
                goodsId:'material_id',
                goodsName:'name',
                finalOrderQty:'num',
                distributePrice1:'price',
                memo:'remark',
            });  
            return Promise.resolve(bb);
        });
    }

    /**
     * BOH版本  退货 分类  物品
     * @param bill_type 
     * @param goodsSortId 
     */
    getBohReturnGoods(param:any,pager:IPagerData):AxiosPromise<any>{
        let firstIds = {};
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        if(param.stockGoodsSortId ==-1 || (param.stockGoodsSortId==0 && !isNaN(param.stockGoodsSortId))){
            firstIds = {
                "goodsSortId": param.categoryId,
            }
        }else{
            firstIds = {
                "goodsSortId": param.goodsSortId,
            }    
        }
        var p = {
            "billType": param.billType, 
            "busiDate": param.busiDate,
            "id":-1, 
            "pagination": {
                "orderby": "",    
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            },...firstIds
        }   
        if(param.id){
            p.id = param.id;
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/return/chooseScmReturnGoods`,p,config).then(res=>{  
            let bb = res;  
            if(bb.data.sortList&&bb.data.sortList.length>=0){   //既查分类，也查物品
                bb.data.sortList.forEach((item:any)=>{
                    if(item.cdata&&item.cdata[0].goodsList&&item.cdata[0].goodsList.length>=0){
                        /**
                         * 转一下 publicGood里面页面显示字段
                         */  
                        formData.modifyParams( item.cdata[0].goodsList, {
                            goodsName:'name',
                            wareQty:'stock',
                            memo:'remark',
                        }); 
                    }
                })               
            }
            formData.modifyParams(bb.data.goodsList,{
                memo:'remark',
                goodsName:'name',
                wareQty:'stock',
                goodsId:'material_id',
            })
           return Promise.resolve(bb);   
        });
    }

 

    /**
     * 退货  搜索获取物品信息
     * @param param 
     * @param pager 
     */
    getItemCategoryGoods(param:any,pager:IPagerData):AxiosPromise<any>{
        let firstIds = {};
        if(param.stockGoodsSortId ==-1 || (param.stockGoodsSortId==0 && !isNaN(param.stockGoodsSortId))){
            firstIds = {}
        }else{
            firstIds = {
                "categoryId": param.categoryId,
                "goodsSortId": param.stockGoodsSortId,
                "goodsName":param.orderGoodsName,
            }
            if(param['goodsName']){
                firstIds['goodsName'] = param['goodsName'];
            }
        }
        let config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return Axios.post(`${this.reqUrl}mobile/purchase/return/queryReturnGoods`,{
            "billType": param.billType,   
            "busiDate": param.busiDate,
            "pagination": {
                "orderby": null, 
                "asc": false, 
                "pageno": pager.page, 
                "pagesize": pager.limit, 
                "totalcount": 0
            },...firstIds
        },config).then(res=>{     
            let bb = res;
            formData.modifyParams(bb.data.goodsList,{
                id:'material_id',
                memo:'remark',
                goodsName:'name',
                wareQty:'stock',
            })
            return Promise.resolve(bb);
        });
    }

    //==================================== 公共的查 分类、物品====================
    /**
     * 获取分类
     */
    getGoodClass(param:any,pager:IPagerData):AxiosPromise<any>{
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询分类
            return this.getBohClassifiedSearch(param,pager).then(res=>{
                return Promise.resolve(res);
            })
        }else if(materialLimit && materialLimit.billsPageType == 'orderGood'){   //订货  查询分类
            return this.getBohOrderClass(param,pager).then(res=>{
                return Promise.resolve(res);
            })
        }else if(materialLimit && materialLimit.billsPageType == 'supplierReturn'){   //退货  查询分类  
            return this.getBohReturnGoods(param,pager).then(res=>{
                return Promise.resolve(res);
            })
        }else{//默认查询不到为空
            return Promise.resolve(null);
        }      
    }    
    /**
     * 获取分类对应的物品     
     */
    getGoodList(param:any,pager:IPagerData):AxiosPromise<any>{
        let materialLimit = { billsPageType:'' };
        if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
            materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
        }
        materialLimit = ObjectHelper.parseJSON(materialLimit);
        if(materialLimit && materialLimit.billsPageType == 'stocktaking'){//boh盘点单的 查询物品
            return this.getBohItemCategory(param,pager).then(res=>{
                return Promise.resolve(res);
            })
        }else if(materialLimit && materialLimit.billsPageType == 'orderGood'){//boh订单 查询物品
            return this.getBohOrderGoods(param,pager).then(res=>{
                return Promise.resolve(res);
            })       
        }else if(materialLimit && materialLimit.billsPageType == 'supplierReturn'){//boh退货 查询物品
            return this.getItemCategoryGoods(param,pager).then(res=>{
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