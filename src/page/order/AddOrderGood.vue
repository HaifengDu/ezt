<!--新增订货-->
<template>
    <div class="ezt-page-con">
        <ezt-header title="添加要货单" :back="true" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name is-required">配送机构：</span>
                        <span class="title-select-name item-select">
                        <select placeholder="请选择" class="ezt-select" v-model="addBillInfo.supplierId" 
                            @change="handlerStoreId('supplierId','您已维护物料信息，如调整配送机构，须重新选择配送方式及物料。')" :class="[{'selectError':billFiles[0].storeId}]">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.id" :key="index" v-for="(item,index) in supplierLists">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <!-- boh版本要货日期 页面中不限制 -->
                    <li class="select-list" v-if="InterfaceSysTypeBOH">
                        <span class="title-search-name is-required">要货日期：</span>
                        <span>
                            <ezt-canlendar ref="orderDate" v-model="addBillInfo.orderDate" placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" 
                            class="input-canlendar" @change="selectOrderChange" :defaultValue="addBillInfo.orderDate"></ezt-canlendar>                            
                        </span>
                    </li>
                    <!-- saas版本要货日期 页面中限制 -->
                    <li class="select-list" v-if="!InterfaceSysTypeBOH">
                        <span class="title-search-name is-required">要货日期：</span>
                        <span>
                            <ezt-canlendar ref="orderDate" v-model="addBillInfo.orderDate" placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" 
                            :max="addBillInfo.arriveDate" class="input-canlendar" :defaultValue="addBillInfo.orderDate"></ezt-canlendar>                            
                        </span>
                    </li>
                    <li class="select-list" v-if="!InterfaceSysTypeBOH">
                        <span class="title-search-name is-required">到货日期：</span>
                        <span>
                            <ezt-canlendar ref="arriveDate" v-model="addBillInfo.arriveDate" placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" :min="addBillInfo.orderDate"
                             class="input-canlendar" :defaultValue="addBillInfo.arriveDate" @change="selectArriveChange"></ezt-canlendar>                                                       
                        </span>
                        <!--BOH不支持 时分-->
                        <span v-if="!InterfaceSysTypeBOH">
                            <span class="title-select-name item-select select-time">
                                <select class="ezt-select" v-model="containTime.newHour" @change="handlerNewHour">
                                    <option :value="item" :key="item" v-for="(item) in hours">{{item}}</option>
                                </select>
                           </span>：
                           <span class="title-select-name item-select select-time">
                                <select class="ezt-select" v-model="containTime.newMinut" @change="handlerNewHour">
                                    <option :value="item" :key="item" v-for="(item) in minutes">{{item}}</option>
                                </select>
                           </span>
                        </span>
                    </li>
                    <!--SAAS环境 并且不是再来一单-->
                    <li v-if="!isShowObj.isorderType&&!InterfaceSysTypeBOH">
                        <span class="title-search-name is-required">要货方式：</span>

                         <button-tab v-model="addBillInfo.orderType" >
                            <button-tab-item @on-item-click="handlerStoreId('orderType','您已维护物料信息，如调整要货方式，须重新选择物料。')">手工要货</button-tab-item>
                            <button-tab-item @on-item-click="handlerStoreId('orderType','您已维护物料信息，如调整要货方式，须重新选择物料。')">模板导入</button-tab-item>
                            <button-tab-item @on-item-click="handlerStoreId('orderType','您已维护物料信息，如调整要货方式，须重新选择物料。')">预估要货</button-tab-item>
                        </button-tab>
                    </li>
                    <div v-if="!addBillInfo.orderType||addBillInfo.orderType==0||(addBillInfo.orderType==1&&templateList.length>0)||(addBillInfo.orderType==2&&estimateGoods.length>0)">
                        <li>
                            <span class="title-search-name">备注：</span>
                            <input type="text" class="ezt-middle" v-model="addBillInfo.remark">
                        </li>
                        <li>
                            <!-- <span class="title-search-name">选择物料：</span> -->
                            <span class="title-search-name is-required">选择物料：</span>
                            <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                            </span>
                            
                        </li>
                    </div>
                    
                </ul>
                <div>
                    <x-dialog v-model="isShowObj.isTemplate" class="dialog-demo">
                        <ul v-if="templateList.length>0" class="template-list">
                            <li v-for="(item,id) in templateList" :key="id">
                                <span class="template-list-name">{{item.storeName}}</span>
                                <span class="template-list-btn" @click="handlerTemplateOrder(item)">订货</span>
                            </li>
                        </ul>                       
                    </x-dialog>
                </div>
                <div v-if="(addBillInfo.orderType==2&&this.estimateGoods.length==0)" class="template-list-one title-search-name">
                    <span>{{doneInfo}}</span>
                </div>
                <div v-if="(addBillInfo.orderType==2&&this.estimateGoods.length>0)" class="estimate-list-one title-search-name">
                    <span>预估单：112222</span>
                    <span>预估物料计算中...</span>
                </div> 
                <div v-if="(addBillInfo.orderType==1&&this.templateList.length==0)" class="template-list-one title-search-name">
                    <span>{{doneInfo}}</span>
                </div> 
              
                <!-- 选择的物料明细 -->
                 <ul>
                    <li class="good-detail-content" v-for="(item,index) in goodData" :key="index">
                        <div class="ezt-detail-good" v-swipeleft="handlerSwipe.bind(this,item,true)" 
                        v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <!-- <span class="good-detail-sort">（规格）</span> -->
                                    </span>
                                    <!-- <span @click="editStatus(item)">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                                    </span>                                    -->
                                </div>
                                <div>
                                    <span class="good-detail-billno">{{item.goodsCode||""}}</span>
                                    <span class="good-detail-sort" v-if="materialSetting.show_order_price||InterfaceSysTypeBOH">￥{{item.price}}/{{item.utilname||item.unitName}}
                                    </span>
                                    <span class="good-detail-sort">数量：{{item.num||item.finalOrderQty}}</span>
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                    <span class="title-search-name">备注：{{item.remark}}</span>
                                </div>                 
                            </div>
                        </div>
                        <div class="ezt-detail-del" @click="delAction(item)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </div> 
                    </li>
                </ul>   
            </div>
        </div>
        <ezt-footer>
            <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.goodData.length>0">合计：
                    <b>品项</b><span>{{this.goodData.length}}</span>，
                    <b>数量</b><span>{{Total.num||Total.finalOrderQty}}</span>，
                    <b v-if="materialSetting.show_order_price||InterfaceSysTypeBOH">￥</b>
                    <span v-if="materialSetting.show_order_price||InterfaceSysTypeBOH">{{Total.Amt.toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive"> 提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
                </div>  
            </div>
        </ezt-footer>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import IUser from "../../interface/IUserModel"
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../helper/methods';
import { FactoryService } from '../../factory/FactoryService';
import { IOrderGoodsService } from '../../interface/service/IOrderGoodsService';
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import ObjectHelper from '../../common/objectHelper'
import CACHE_KEY from '../../constans/cacheKey'
import commonService from '../../service/commonService.js';
import {EGoodType} from '../../enum/EGoodType';
import formData from '../../dictory/formData';
@Component({
    computed:{
        ...mapGetters({
            'user' : 'user',
            'selectedGood' : 'publicAddGood/selectedGood',//已经选择好的物料
            'systemParamSetting' : "systemParamSetting",//系统设置
            InterfaceSysTypeBOH : 'InterfaceSysTypeBOH',//后台接口是否为BOH
            materialSetting : 'materialSetting',//物流设置
        })
    },
    methods:{
        ...mapActions({
            'setSelectedGood':'publicAddGood/setSelectedGood',
        })
    }
})
export default class Order extends Vue{
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();
    private user:IUser;
    private service: IOrderGoodsService;
    private selectedGood:any[];//store中selectedGood的值
    private setSelectedGood:INoopPromise//store中给selectedGood赋值
    private systemParamSetting:any;
    private EGoodType = EGoodType;//添加物料限制 
    private addBeforeBillInfo:any={
    };
    /**
    保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
     */
    private addBillInfo:any={
        orderType:''
    };//store中
    private isShowObj={
        isTemplate:false,//模板导入列表提示框
        isorderType:false,//再来一单 跳转的手工制作显示/隐藏
    }
    private doneInfo:string="";
    private supplierLists:any=[{
        name:'配送中心1',
        id:'01'
    },{
        name:'配送中心2',
        id:'02'
    }];
    private containTime:any={
        newHour:0,
        newMinut:0,
    };
    private estimateGoods:any=[
        {
            billno:'0000ddff',
            storeName:'配送中心A01',
            goodList:[//可用导入模板中物品
                {
                    id:2,
                    name:'牛肉',
                    price:'9',
                    num:1,
                    utilname:'KG',
                    unit:'箱',
                    roundValue:{//可直拨的数据
                        num: 10,
                        numed:3,
                        list:[]
                    }
                }
            ]
        }
    ];
    private goodData:any=[];
    private materialSetting: any;
    private templateList:any=[//可用导入模板
        {
            id:1,
            storeName:'配送中心A01',
            goodList:[//可用导入模板中物品
                {
                    id:2,
                    name:'海参',
                    price:'9',
                    num:1,
                    utilname:'KG',
                    unit:'箱',
                    roundValue:{//可直拨的数据
                        num: 10,
                        numed:3,
                        list:[]
                    }
                }
            ]
        }
    ];
    private hours:any[]=[];
    private minutes:any[]=[];
    /**
   * 枚举 表单字段
   */
    private billFiles=[
        {id:"supplierId",msg:"请选择配送机构",supplierId:false},
        {id:"orderDate",msg:"请选择要货日期",orderDate:false},
        {id:"arriveDate",msg:"请选择到货日期",arriveDate:false}];
    mounted(){
        this.hours = commonService.getHours();
        this.minutes = commonService.getMinutes();
    }   
    created() {
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createOrderGood();
         this.getSupplierList();  //配送机构下拉列表
       
        //默认值       
        this.addBillInfo.orderDate = this.user.auth.busi_date;
        if(!this.InterfaceSysTypeBOH){//saas有的字段，boh没有            
            this.addBillInfo.orderType = 0;
            let dateNew = new Date(this.user.auth.busi_date);
            this.addBillInfo.arriveDate = new Date(dateNew.setDate(dateNew.getDate()+1)).format("yyyy-MM-dd");
        }
       

        if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){//单据信息
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDINFO));
            if(this.addBillInfo.billTypes=="handlers"){//假如从再来一单跳过来的单据
                this.isShowObj.isorderType = true;
            }
        } 
        if(this.selectedGood&&this.selectedGood.length>0){
            formData.modifyParams(this.selectedGood,{//将选择物料中的字段转为当前模块后台想要的字段
                num:"finalOrderQty",                
            })
        }
        this.goodData = ObjectHelper.serialize(this.selectedGood);
       
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        if(this.cache.getData(CACHE_KEY.ORDER_CONTAINTIME)){//要货日期 的时间（）
            this.containTime = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_CONTAINTIME));
        }
        // if(this.systemParamSetting.isContain=='3'){//要货方式是预估要货
        //     //系统设置里面有没有设置 是否包含到货当天量
        //     if(this.systemParamSetting&&this.systemParamSetting.containTime&&(this.addBillInfo.containTime=="0:0"||!this.addBillInfo.containTime)){
        //         let str = this.systemParamSetting.containTime;
        //         this.containTime.newHour=Number(str.substring(0,str.indexOf(":")));
        //         this.containTime.newMinut=Number(str.substring(str.indexOf(":")+1,str.length));
        //         //有设置 到货日期为系统设置值 
        //         this.addBillInfo.containTime = this.containTime.newHour+":"+this.containTime.newMinut;
        //         this.addBeforeBillInfo.containTime = this.containTime.newHour+":"+this.containTime.newMinut;
        //     }else{
        //         if(!this.addBillInfo.containTime){//初次打开新增页面并未有值，系统设置也未设置，默认值为0；
        //             this.$set(this.systemParamSetting,'containTime',"0:0");
        //             this.addBillInfo.containTime ="0:0";
        //             this.addBeforeBillInfo.containTime = "0:0";
        //         }
        //     }           
        // }else{
        if(!this.addBillInfo.containTime){//要货方式不是预估要货
            this.addBillInfo.containTime = "0:0";
            this.addBeforeBillInfo.containTime = "0:0";
        }
        // }
        (this.selectedGood||[]).forEach(item=>this.$set(item,'active',false));
    }
    private getSupplierList(){
        this.service.getSupplierList().then(res=>{
            this.supplierLists = res.data.organList;
            if(!this.addBillInfo.supplierId){
                //默认值
                this.addBillInfo.supplierId = this.supplierLists[0].id;
                this.addBillInfo.supplierName = this.supplierLists[0].name; 
            }
                     
        })
    }
    /**
     * 到货日期 小时\分钟
     */
    private handlerNewHour(){
        let _this = this;
        this.addBillInfo.containTime=this.containTime.newHour+":"+this.containTime.newMinut;
        if(this.addBillInfo.containTime != this.addBeforeBillInfo.containTime){
            if(this.addBillInfo.orderType == 2&&this.goodData.length>0){
                this.$vux.confirm.show({
                    // 组件除show外的属性
                    onCancel () {
                        _this.arriveCancel();
                    },
                    onConfirm () {
                        _this.arriveConfirm();
                    },
                    content:'您已选择物料，调整到货日期，须重新加载预估单及物料。'
                })
                return false;
            }
        }
        this.addBeforeBillInfo.containTime = this.addBillInfo.containTime;
    }
    /**
     * 改变 到货日期     到货日期  》  要货日期    到货日期（的最小值   要货日期）
     *                  要货日期  《   到货日期   要货日期（最大值      到货日期）
     */
    private selectArriveChange(val:any){
        let _this = this;
        if(val != this.addBeforeBillInfo.arriveDate){
            if(this.addBillInfo.orderType == 2&&this.goodData.length>0){
                this.$vux.confirm.show({
                    // 组件除show外的属性
                    onCancel () {
                        _this.arriveCancel();
                    },
                    onConfirm () {
                        _this.arriveConfirm();
                    },
                    content:'您已选择物料，调整到货日期，须重新加载预估单及物料。'
                })
                return false;
            }
            this.addBeforeBillInfo.arriveDate = val;
            (<any>this.$refs.arriveDate).setMin(new Date(val));
            (<any>this.$refs.orderDate).setMax(new Date(val));
        }
    }
    /**
     * 改变 要货日期
     */
    private selectOrderChange(val:any){
        (<any>this.$refs.orderDate).setMax(new Date(val));
        (<any>this.$refs.arriveDate).setMin(new Date(val));
    }
    /**
     * 确认调整 到货日期
     */
    private arriveConfirm(){
        this.goodData=[];
        this.checkNone();
        this.addBeforeBillInfo.arriveDate = this.addBillInfo.arriveDate;
        this.addBeforeBillInfo.containTime = this.addBillInfo.containTime;
        let str = this.addBillInfo.containTime;
        this.containTime.newHour=Number(str.substring(0,str.indexOf(":")));
        this.containTime.newMinut=Number(str.substring(str.indexOf(":")+1,str.length));
    }
    /**
     * 放弃调整 到货日期
     */
    private arriveCancel(){
        this.addBillInfo.arriveDate = this.addBeforeBillInfo.arriveDate;
        this.addBillInfo.containTime = this.addBeforeBillInfo.containTime;
        (<any>this.$refs.arriveDate).setDefaultVal(new Date(this.addBeforeBillInfo.arriveDate));//设置默认显示值 
        let str = this.addBillInfo.containTime;
        this.containTime.newHour=Number(str.substring(0,str.indexOf(":")));
        this.containTime.newMinut=Number(str.substring(str.indexOf(":")+1,str.length));
    }
    /**
     * 模板导入订货操作
     */
    private handlerTemplateOrder(item:any){ 
        item.goodList.forEach((info:any)=>{
            this.$set(info,'active',false);
        })
        this.goodData = ObjectHelper.serialize(item.goodList);//深拷贝
        this.isShowObj.isTemplate=false;
    }
    /**
     * 删除物料操作
     */
    private delAction(item:any){
       let _this = this;
        this.$vux.confirm.show({
        // 组件除show外的属性
        onCancel () {
            let newIndex = _this.goodData.findIndex((info:any,index:any)=>{
                 return item.id == info.id;
            })
            _this.goodData[newIndex].active = false;
        },
        onConfirm () {
            let newIndex = _this.goodData.findIndex((info:any,index:any)=>{
                return item.id == info.id;
            })
            _this.goodData.splice(newIndex,1);
        },
        content:'请确认是否删除该物料。'
        })
    }
    // 左侧滑动删除
    private handlerSwipe(item:any,active:boolean){     
        item.active = active;
    }
    //选择物料
    private renderUrl(info: string) {
        let _this = this;
        let goodTerm = {};
        let material_param ={};
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if((!this.addBillInfo[item.id]||this.addBillInfo[item.id]=="")){
                if(item.id == 'arriveDate' && this.InterfaceSysTypeBOH){
                    continue;
                }
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
            }
        }
        goodTerm={//区分公共物料里的哪些显示/隐藏权限
            billsPageType: 'orderGood',
            showPrice: !this.materialSetting.show_order_price
        }
        material_param={//查询物料时所用的参数
            supplierId : this.addBillInfo.supplierId,
            orderDate : this.addBillInfo.orderDate,
            orderType : 'SCM_ORDER_TYPE_RULE'
        }
        formData.modifyParams(this.goodData,{
            finalOrderQty:"num"//将当前模块后台想要的字段转换为选择物料所显示的公共字段
        })
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.ORDER_CONTAINTIME,JSON.stringify(this.containTime));
        this.cache.save(CACHE_KEY.MATERIAL_PARAM,JSON.stringify(material_param))
        this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.setSelectedGood(this.goodData);
        this.$router.push(info);
        // this.$router.push({name:'PublicAddGood',params:{'GoodPriceIsEdit':this.addBillInfo.GoodPriceIsEdit}});
    }
    /**
     * 校验要货方式没有时；
     */
    private checkNone(){
        if(this.addBillInfo.orderType=='1'){
            if(this.templateList.length>0){
                this.isShowObj.isTemplate=true;
            }else{
                this.doneInfo="未查到可用模板，请选择其它方式要货。"
            }                
        }
        if(this.addBillInfo.orderType=='2'){
            if(this.estimateGoods.length>0){

            }else{
                this.doneInfo="未查到可用预估单，请选择其它方式要货。"
            }
        }  
    }

    /**
     * 选择配送机构
     */
    private handlerStoreId(val:any,title:any){      
         let _this = this;
        if(this.goodData.length>0){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                    _this.addBillInfo[val] = _this.addBeforeBillInfo[val];
                },
                onConfirm () {
                    _this.goodData=[];
                    _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
                    _this.checkNone();    
                },
                content:title
            })
        }else{
            _this.addBeforeBillInfo[val]=_this.addBillInfo[val];  
            this.billFiles.forEach(item=>{
                if(item.id == val){
                item[val]= false;
                }
            }) 
            this.checkNone();        
        }
    }
     /**
     * 切换要货方式
     */
    // private handlerChangeType(item:any){
    //     if(this.goodData.length>0){           
    //         this.isOrderType=true;
    //     }else{
    //         this.addBeforeBillInfo.orderType=this.addBillInfo.orderType;
    //         this.checkNone();
    //     }
    // }
    
   /**
   * 
   * 物料总数量\总金额
   */
    private get Total(){
      return this.selectedGood.reduce((ori,item)=>{
        if(item.finalOrderQty){
                //boh版的数量，金额
                ori.finalOrderQty = ori.finalOrderQty + Number(item.finalOrderQty);
                if(1){
                    ori.Amt = ori.Amt + (item.finalOrderQty * 1);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.finalOrderQty = 0;
                }
                return ori;
            }else{
                //saas版的数量，金额
                ori.num = ori.num+Number(item.num); 
                if(item.price){
                    ori.Amt = ori.Amt + (item.num * item.price);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.num = 0;
                } 
                return ori;
            }
      },{num:0,Amt:0,finalOrderQty:0});
    }
    /**
     * 提交并审核
     */
    private confirmReceive(){
        let _this = this;
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                if(item.id == 'arriveDate' && this.InterfaceSysTypeBOH){
                    continue;
                }
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
            }
        }
        if(!this.goodData||this.goodData.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
        this.addBillInfo.containTime=this.containTime.newHour+":"+this.containTime.newMinut;
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {//审核不通过
                _this.setSelectedGood([]);
                _this.$toasted.success("审核成功！");
                _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}}); 
            },
            onConfirm () {//审核通过
                _this.setSelectedGood([]);
                _this.$toasted.success("审核成功！");
                if(!_this.InterfaceSysTypeBOH){
                    _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}}); 
                }else{
                     _this.$router.push({name:'OrderGood',params:{'purStatus':'已完成'}}); 
                }
               
            },
            content:'确认审核该单据？',
            confirmText:"审核通过",
            cancelText:"审核不通过",
            showCancelButton:!_this.InterfaceSysTypeBOH,
            hideOnBlur:true
        })
        
    }

    /**
     * 提交
     */
    private saveReceive(){
        let _this = this;
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                if(item.id == 'arriveDate' && this.InterfaceSysTypeBOH){
                    continue;
                }
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
            }
        }
        if(!this.goodData||this.goodData.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
        this.addBillInfo.containTime=this.containTime.newHour+":"+this.containTime.newMinut;
        let param ={            
            detailList:this.goodData,
            totalAmt:this.Total.Amt
        }         
        this.service.saveOrder((Object.assign(param,this.addBeforeBillInfo))).then(res=>{
            this.addBillInfo={},
            this.goodData=[];
            this.setSelectedGood([]);
            this.addBeforeBillInfo={};
            this.$toasted.success("保存成功！");
            this.$router.push('/orderGood')
        })
      
    }
    /**
     * 返回
     */
    private goBack(){
        let _this = this;
         if((this.addBillInfo&&this.addBillInfo.storeId)||this.goodData.length>0){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                console.log(this) // 非当前 vm
                },
                onConfirm () {
                    _this.addBillInfo={},
                    _this.goodData=[];
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$router.push('/orderGood')
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
        }else{
            this.$router.push('/orderGood')
        }       
    }
}
</script>
<style lang="less" scoped>
.costType-info a.active {
  color: #1674fc;
}
.vux-button-group a{
    height: inherit;
    padding: 2px 6px;
}

//物料信息
.good-detail-content {
  position: relative;
  overflow: hidden;
  text-align: left;
  margin: 8px 10px;
  padding: 12px 10px 12px 15px;
  background: #ffffff;
  border: 1px solid #ddecfd;
  box-shadow: 0 0 20px 0 rgba(71, 66, 227, 0.07);
  display: flex;
  flex: row;
  flex-direction: column;
  .good-detail-l {
    display: inline-block;
    flex: 0.8;
  }
  .good-detail-l > div {
    display: flex;
    flex-direction: row;
  }
  .good-detail-l > div > span {
    padding: 5px 0px;
    align-items: baseline;
    flex: 1;
  }
  .good-detail-r {
    display: inline-block;
    display: flex;
    .park-input {
      flex: 1;
    }
  }
  .good-detail-num {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: #ff885e;
    letter-spacing: 0;
    line-height: 3;
  }
  .good-detail-name {
    font-size: 14px;
    color: #395778;
    letter-spacing: 0;
    display: flex;
    flex: 1;
  }
  .good-detail-sort {
    font-size: 13px;
    color: #5f7b9a;
    letter-spacing: 0;
    display: flex;
    flex-direction: row;
  }
  .good-detail-billno,
  .good-num-t {
    font-size: 10px;
    color: #a3b3c2;
    letter-spacing: 0;
    flex: 1;
  }
  .good-num-t {
    display: inline-block;
    text-align: center;
    width: 100%;
  }
  .ezt-detail-good {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    transition: transform .5s;
    background: #fff;
    z-index: 2;
  }
}
// 左侧滑动删除
.swipe-transform{
    transform: translateX(-50px);
}
.ezt-detail-del{
    position: absolute;
    right: 10px;
    top: 30px;
    width: 50px;
    height: 50px;
    text-align: center;
    margin: 10px 0px;
    font-size: 22px;
}
.orderType-list span.active{
    background: #1674fc;
}
.template-list{
    background: #fff;
    text-align: left;
    padding: 10px;
    display:flex;
    flex-direction: column;
    li{
        display: flex;
        padding: 10px;
        border-bottom: 1px solid #E0EBF9;
    }
    .template-list-name{
        flex:1;
    }
    .template-list-btn{
        border: 1px solid #1188FC;
        padding: 2px 10px;
        border-radius: 6px;
        font-size: 12px;
        color: #1188FC;
    }
}
    .template-list-one{
        background: #fff;
        padding: 10px;
    }
    .item-select.select-time{
        width: 40px;
        position: relative;
        border:1px solid #ccc;
        display:inline-block
    }
    .select-time.item-select::after{
        right: 8px;
    }
    .estimate-list-one{
        background: #fff;
        // text-align: left;
        padding: 10px;
        display:flex;
        flex-direction: column;
    }

</style>


