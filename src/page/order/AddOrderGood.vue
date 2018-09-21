<!--新增订货-->
<template>
    <div class="ezt-page-con">
        <ezt-header title="添加要货单" :back="true" @goBack="goBack"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name ">配送机构：</span>
                        <span class="title-select-name item-select">
                        <select name="" id="" placeholder="请选择" class="ezt-select" v-model="addBillInfo.storeId" 
                            @change="handlerStoreId">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name">要货日期：</span>
                        <span>
                            <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="addBillInfo.orderDate"></ezt-canlendar>                            
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name">到货日期：</span>
                        <span>
                            <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="addBillInfo.arriveDate"></ezt-canlendar>                            
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">要货方式：</span>

                         <button-tab v-model="addBillInfo.orderType" >
                            <button-tab-item @on-item-click="handlerChangeType()">手工要货</button-tab-item>
                            <button-tab-item @on-item-click="handlerChangeType()">模板导入</button-tab-item>
                            <button-tab-item @on-item-click="handlerChangeType()">预估要货</button-tab-item>
                        </button-tab>
                    </li>
                    <div v-if="addBillInfo.orderType==0||(addBillInfo.orderType==1&&templateList.length>0)||(addBillInfo.orderType==2&&estimateGoods.length>0)">
                        <li>
                            <span class="title-search-name">备注：</span>
                            <input type="text" class="ezt-middle" v-model="addBillInfo.remark">
                        </li>
                        <li>
                            <!-- <span class="title-search-name">选择物料：</span> -->
                            <span class="title-search-name">选择物料：</span>
                            <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                            </span>
                            
                        </li>
                    </div>
                    
                </ul>
                <div>
                    <x-dialog v-model="isTemplate" class="dialog-demo">
                        <ul v-if="templateList.length>0" class="template-list">
                            <li v-for="(item,id) in templateList" :key="id">
                                <span class="template-list-name">{{item.storeName}}</span>
                                <span class="template-list-btn" @click="handlerTemplateOrder(item)">订货</span>
                            </li>
                        </ul>                       
                    </x-dialog>
                </div>
                 <div v-if="(templateList.length<=0&&addBillInfo.orderType==1)||(estimateGoods.length<=0&&addBillInfo.orderType==2)" class="template-list-one">
                    <span>{{doneInfo}}</span>
                </div>  
              
                <!-- 选择的物料明细 -->
                 <ul>
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good" v-swipeleft="handlerLeft.bind(this,item)" 
                        v-swiperight="handlerRight.bind(this,item)" :class="{'swipe-transform':item.active}" >
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（规格）</span>
                                    </span>
                                    <!-- <span @click="editStatus(item)">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                                    </span>                                    -->
                                </div>
                                <div>
                                    <span class="good-detail-billno">编码：003222</span>
                                    <span class="good-detail-sort">￥{{item.price}}/{{item.utilname}}
                                    </span>
                                    <span class="good-detail-sort">数量：{{item.num}}</span>
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                    <span class="title-search-name">备注：{{item.remark}}</span>
                                </div>                 
                            </div>
                        </div>
                        <div class="ezt-detail-del" @click="deleteSection(item)">删除</div> 
                    </li>
                </ul>   
            </div>
        </div>
        <ezt-footer>
            <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                    <b>品项</b><span>{{this.selectedGood.length}}</span>，
                    <b>数量</b><span>{{TotalNum}}</span>，
                    <b>￥</b><span>{{TotalAmt}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive"> 提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
                </div>  
            </div>
        </ezt-footer>
           <!-- 返回时提示保存信息 -->
        <confirm v-model="isSave" @on-confirm="onConfirm">
            <p style="text-align:center;"> 返回后，本次操作记录将丢失，请确认是否离开？</p>
        </confirm>
        <!-- 当有物料 仓库发生变化时校验 -->
        <confirm v-model="isStore" @on-cancel="onStoreCancel('store')" @on-confirm="onStoreConfirm('store')">
            <p style="text-align:center;">您已维护物料信息，如调整配送机构，须重新选择配送方式及物料。</p>
        </confirm>
        <!-- 当有物料 要货方式发生变化时校验 -->
        <confirm v-model="isOrderType" @on-cancel="onStoreCancel('orderType')" @on-confirm="onStoreConfirm('orderType')">
            <p style="text-align:center;">您已维护物料信息，如调整要货方式，须重新选择物料。</p>
        </confirm>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../helper/methods';
import {OrderGoodsService} from '../../service/OrderGoodsService';
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import CACHE_KEY from '../../constans/cacheKey'
@Component({
    computed:{
        ...mapGetters({
            'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
            // 'addBillInfo':'publicAddGood/addBillInfo',//添加采购入库单的单据信息
            // 'addBeforeBillInfo':'publicAddGood/addBeforeBillInfo',//当改变单据信息的时候，取消时还原之前的值
        })
    },
    methods:{
        ...mapActions({
            // 'setAddBillInfo':"publicAddGood/setAddBillInfo",
            'setSelectedGood':'publicAddGood/setSelectedGood',
            // "setAddBeforeBillInfo":"publicAddGood/setAddBeforeBillInfo",
        })
    }
})
export default class Order extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    private service: OrderGoodsService;
    private selectedGood:any[];//store中selectedGood的值
    private setSelectedGood:INoopPromise//store中给selectedGood赋值
    private addBeforeBillInfo:any={
        orderType:0
    };//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
    // private setAddBeforeBillInfo:INoopPromise;
    private addBillInfo:any={
        orderType:0,
        orderDate:new Date().format('yyyy-MM-dd'),
        arriveDate:new Date().format('yyyy-MM-dd'),
    };//store中
    // private setAddBillInfo:INoopPromise//store中给addBillInfo赋值
    private isStore:boolean=false;
    private isOrderType:boolean=false;
    private isSave:boolean=false;
    private isTemplate:boolean=false;
    private doneInfo:string="";
    private orderType:any=[{
      name:'配送中心1',
      id:'01'
    }];
    private estimateGoods:any=[];
    private templateList:any=[//可用导入模板
        {
            id:1,
            storeName:'配送中心A01',
            goodList:[//可用导入模板中物品
                {
                    id:2,
                    name:'海参',
                    price:'9',
                    num:0,
                    utilname:'KG',
                    unit:'箱',
                    roundValue:{//可直拨的数据
                        num: 10,
                        numed:3,
                        list:[]
                    }
                }
            ]
        },
        {
            id:2,
            storeName:'配送中心B02',
            goodList:[]
        }
    ];
   
    created() {
        this.service = OrderGoodsService.getInstance();
        this.addBillInfo.storeId = this.orderType[0].type;
        this.addBeforeBillInfo.storeId = this.orderType[0].type;
        (this.selectedGood||[]).forEach(item=>item.active = false);
        if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDINFO));
        }
        if(this.cache.getData(CACHE_KEY.ORDER_ADDBEFOREINFO)){
            this.addBeforeBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDBEFOREINFO));
        }
    }
    /**
     * 模板导入订货操作
     */
    private handlerTemplateOrder(item:any){ 
        item.goodList.forEach((info:any)=>{info.active=false})
        this.setSelectedGood(item.goodList);
        this.isTemplate=false;
    }
      /**
     * 左滑删除某一项
     */
    private deleteSection(item:any){
        let newIndex = this.selectedGood.findIndex((info:any,index:any)=>{
        return item.id == info.id;
        })
        this.selectedGood.splice(newIndex,1);
    }
    // 向左滑动
    private handlerLeft(item:any){     
        item.active = true;
    }
    private handlerRight(item:any){
        item.active = false;
    }

    //选择物料
    private renderUrl(info: string) {
        this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        // this.setAddBillInfo(this.addBillInfo); //将选择的单据信息保存在store中
        this.$router.push(info);
    }
     /**
     * 有物料时 机构、要货方式变化 确认校验
     */
    private onStoreConfirm(val:any){
      this.setSelectedGood([]);
      this.addBeforeBillInfo[val]=this.addBillInfo[val];
    }
    /**
     * 有物料时 机构、要货方式变化  取消校验
     */
    private onStoreCancel(val:any){
      this.addBillInfo[val] = this.addBeforeBillInfo[val];
    }

    /**
     * 选择配送机构
     */
    private handlerStoreId(item:any){      
      if(this.selectedGood.length>0){
        this.isStore=true;
      }else{
        this.addBeforeBillInfo.storeId=this.addBillInfo.storeId;            
      }
    }
     /**
     * 切换要货方式
     */
    private handlerChangeType(item:any){
        if(this.selectedGood.length>0){
            this.isOrderType=true;
        }else{
            this.addBeforeBillInfo.orderType=this.addBillInfo.orderType;
            if(this.addBillInfo.orderType=='1'){
                if(this.templateList.length>0){
                    this.isTemplate=true;
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
    }
    
    /**
   * computed demo
   * 物料总数量
   */
    private get TotalNum(){
      return this.selectedGood.reduce((ori,item)=>{
        return Number(ori)+Number(item.num);       
      },0);
    }
    /**
     * 物料总金额
     */
    private get TotalAmt(){
        return this.selectedGood.reduce((ori,item)=>{
        return ori+(item.num*item.price);       
        },0).toFixed(2);
    }
    /**
     * 提交并审核
     */
    private confirmReceive(){
        this.$toasted.success("审核成功！");
    }

    /**
     * 提交
     */
    private saveReceive(){
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        } 
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$toasted.success("保存成功！");
    }

    //离开确认
    private onConfirm(){//确认离开，清空store中的物料和单据信息
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$router.push('/orderGood')
    }

    /**
     * 返回
     */
    private goBack(){
         if((this.addBillInfo&&this.addBillInfo.storeId)||this.selectedGood.length>0){
            this.isSave=true;
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
    background: pink;
    width: 50px;
    height: 50px;
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

</style>


