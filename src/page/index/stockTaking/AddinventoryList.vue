<!--新增盘点单-->
<template>   
  <div> 
      <!-- saas版本 -->
      <div class="ezt-page-con addinventorylist" v-if="!InterfaceSysTypeBOH">
          <ezt-header :back="true" title='新增盘点单' @goBack="goBack" :isInfoGoback="true">
            <div slot="action">
            </div>   
          </ezt-header>    
          <div class="ezt-main">
            <div class="ezt-add-content">
              <ul class="ezt-title-search">
                <li>
                    <span class="title-search-name">门店名称：</span>
                    <input type="text" class="ezt-middle" disabled v-model="user.auth.store_name">
                </li>
                <li>
                    <span class="title-search-name">盘点日期：</span>
                    <input type="text" class="ezt-middle" disabled v-model="user.auth.busi_date">
                </li>
                <li>
                    <span class="title-search-name">盘点类型：</span>
                    <input type="text" class="ezt-middle" disabled v-model="addinventory.name">
                </li>
                <li class="select-list">
                    <span class="title-search-name is-required">仓库：</span>
                    <span class="title-select-name item-select">
                      <select placeholder="请选择仓库" class="ezt-select" v-model="addinventory.stock"
                      @change="handlerWarehouse('stock')" :class="[{'selectError':LibraryField[0].stock}]"> 
                        <option value="" style="display:none;" disabled="disabled" selected="selected">请选择盘点仓库</option>
                        <option :value="item.id" :key="index" v-for="(item,index) in warehouseType">{{item.text}}</option>
                      </select> 
                    </span>   
                </li>   
                <li class="select-list">
                  <span class="title-search-name is-required">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择未盘处理方式" class="ezt-select"  v-model="addinventory.treatment"
                    @change="handlerWarehouse('treatment')" :class="[{'selectError':LibraryField[1].treatment}]">
                      <option value="" style="display:none;" disabled="disabled" selected="selected">请选择未盘处理</option>
                      <option :value="mode.value" :key="index" v-for="(mode,index) in orderType">{{mode.name}}</option>
                    </select>
                  </span>  
                </li>
              </ul>
              <div class="method">
                    <p>盘点方式</p>        
                    <ul>
                      <li @click="manualproduction('manual')">手工制单</li>
                      <li @click="templateimport()">模板导入</li>
                      <li @click="inventorytype(pageType.InventoryType)">盘点类型导入</li>
                    </ul>
              </div>
            </div> 
          </div>      
        </div>
     <!-- boh版本 -->
     <div class="ezt-page-con addinventorylist" v-show="InterfaceSysTypeBOH">
          <ezt-header :back="true" title='新增盘点单' @goBack="goBack" :isInfoGoback="true">
            <div slot="action">
            </div>   
          </ezt-header>    
          <div class="ezt-main">
            <div class="ezt-add-content">
              <ul class="ezt-title-search">
                <li>
                    <span class="title-search-name">门店名称：</span>
                    <input type="text" class="ezt-middle" disabled v-model="user.auth.store_name">
                </li>
                <li>
                    <span class="title-search-name">盘点日期：</span>
                    <input type="text" class="ezt-middle" disabled v-model="user.auth.busi_date">
                </li>
                <li>
                    <span class="title-search-name">盘点类型：</span>
                    <input type="text" class="ezt-middle" disabled v-model="addinventory.name">
                </li>  
                <li>
                    <span class="title-search-name">盘点仓库：</span>     
                    <input type="text" class="ezt-middle" disabled v-model="addinventory.stock">
                </li>
                <li @click="BohMaterials()">
                  <span class="title-search-name is-required">选择货品：</span>
                  <span class="title-search-right">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
              <!-- 选择的物料明细 -->
              <ul>
                <li class="good-detail-content" v-for="(item,index) in InventoryList" :key="index">
                    <div class="ezt-detail-good" 
                        v-swipeleft="handlerSwipe.bind(this,item,true)"  
                        v-swiperight="handlerSwipe.bind(this,item,false)" 
                        :class="{'swipe-transform':item.active}"
                       >
                        <div class="good-detail-l">
                              <div>
                                  <span class="good-detail-name">
                                    <span class="good-detail-break">{{item.material_name}}</span> 
                                     <span class="good-detail-sort" v-if="item.material_model || ''">（{{item.material_model}}）</span> 
                                  </span>
                              </div>
                              <div class="good-detail-nobreak">
                                    <span class="good-detail-billno ">编码：{{item.material_num}}</span>
                                    <span class="good-detail-sort">单位：{{item.unitName}}</span>
                              </div> 
                              <div>
                                  <span class="title-search-name ezt-dense-box">账面数量：{{item.acc_qty}}</span>   
                                  <span class="title-search-name ezt-dense-box">实盘数：{{item.disperse_num || 0}}</span> 
                              </div>             
                        </div>
                       <div class="good-detail-r">
                            <div class="park-input" style="margin-top: 10px;"> 
                              <span class="title-search-name">备注：{{item.remark || item.memo}}</span>
                            </div>                    
                       </div>
                    </div>
                    <div class="ezt-detail-del" @click="delAction(item)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </div> 
                </li>
              </ul> 
            </div> 
            <ezt-footer>
              <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.InventoryList.length>0">合计：
                  <b>品项</b><span>{{this.InventoryList.length}}</span>，
                  <b>数量</b><span>{{Total.num || Total.disperse_num}}</span>，
                  <b>￥</b><span>{{Total.Amt.toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                  <a href="javascript:(0)" class="ezt-foot-sub" style="width:100%" @click="saveReceive">保存并提交</a>  
                </div>  
              </div>
            </ezt-footer>
        </div>      
    </div>
 </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import ObjectHelper from '../../../common/objectHelper'
import IUser from "../../../interface/IUserModel"
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import CACHE_KEY from '../../../constans/cacheKey'
import { PageType } from "../../../enum/EPageType"
import formData from '../../../dictory/formData'
@Component({
   components:{
   },    
   computed:{
     ...mapGetters({
        'user':'user',
        'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
        'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',//接口BOH
     })
   },
   methods:{
    ...mapActions({
      'setSelectedGood':'publicAddGood/setSelectedGood',
    })    
   }
})   
export default class StockTaking extends Vue{
    private user:IUser;
    private cache = CachePocily.getInstance();
    private InterfaceSysTypeBOH:boolean;
    private service:IStockTakingService;
    private bill_type:string; //弹层盘点类型
    private selectedGood:any[];//store中selectedGood的值  
    private setSelectedGood:INoopPromise//store中给selectedGood赋值
    private InventoryList:any[];//货品详情
    private pageType = PageType; //页面类型
    private warehouseType:any[] = [];  //动态加载仓库
    private addinventory:any={
      stock:'',
      treatment:'',
    };//新增盘库单
    private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
    private addBillInfo:any={
       editPrice:false
    }; 
    private orderType:any[] = [{
      name:"按照当前库存量处理",
      value:"is_quanlity"
    },{   
      name:"按照0库存量处理",
      value:"is_zero"
    }];
    private LibraryField=[
        {id:"stock",msg:"请选择仓库！",stock:false},
        {id:"treatment",msg:"请选择未盘处理方式！",treatment:false},
    ]

  created() { 
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createStockTaking();
    if(this.cache.getData(CACHE_KEY.INVENTORY_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INVENTORY_ADDINFO));   
    }
    if(this.cache.getData(CACHE_KEY.INVENTORY_ADDBEFOREINFO)){       
        this.addBeforeBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INVENTORY_ADDBEFOREINFO));
    }    
    if(this.cache.getData(CACHE_KEY.INVENTORY_TYPE)){
        const InventoryType = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_TYPE));
        this.addinventory.name = InventoryType.name 
        this.addinventory.bill_type = InventoryType.bill_type
    } 
    if(this.cache.getData(CACHE_KEY.ADDINVENTORY)){
        this.addinventory = JSON.parse(this.cache.getData(CACHE_KEY.ADDINVENTORY));
    }
    if(this.selectedGood&&this.selectedGood.length>0){
        formData.modifyParams(this.selectedGood,{//将选择物料中的字段转为当前模块后台想要的字段
          // num:"disperse_num",  //实盘数
          remark:'memo',  
          name:'material_name',
          price:"distributePrice1"    
        })
       
    }  
    this.InventoryList = ObjectHelper.serialize(this.selectedGood);
    (this.selectedGood||[]).forEach(item=>this.$set(item,'active',false));
    (this.InventoryList||[]).forEach((item:any)=> this.$set(item,'active',false));
    this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝 
    /**
     * BOH版本 获取仓库
     */
    if(this.cache.getData(CACHE_KEY.WAREHOUSE)){
        const warehouseName = JSON.parse(this.cache.getData(CACHE_KEY.WAREHOUSE));
        this.addinventory.id = warehouseName.warehouseList[0].id
        this.addinventory.stock = warehouseName.warehouseList[0].warehouseName
    }
    if(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS)){
        this.InventoryList  = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS));
    }
    /**
     * SAAS版本  动态加载仓库
     */
     if(!this.InterfaceSysTypeBOH){
       this.getWarehouseType();
     }
  }
  mounted(){ 
   
  }
  /**
   * 返回
   */
  private goBack() {
      let _this = this;   
      if((this.addinventory&&this.addinventory.stock)||this.InventoryList.length>0){
          this.$vux.confirm.show({
              // 组件除show外的属性
              onCancel () {
                  console.log(this)   // 非当前 vm
              },       
              onConfirm () {
                   _this.addBillInfo={};
                   _this.setSelectedGood([]);
                   _this.addBeforeBillInfo={};
                   _this.cache.clear();
                   _this.$router.push('/stocktaking');
              },
              content:"返回后，本次操作记录将丢失，请确认是否离开？"
          })
      }else{
          this.$router.push('/stocktaking');
      }
    }
   /**
     * 动态加载仓库
     */
    private getWarehouseType(){
      this.service.getWarehouse(this.addinventory.bill_type).then(res=>{ 
          this.warehouseType = res.data.data;
      },err=>{
          this.$toasted.show(err.message)
      })
    }

  /**
   * 左侧滑动
   */
  private handlerSwipe(item:any,active:boolean){ 
      debugger
      item.active = active;        
  }
  /**
   * 删除物料操作
   */
  private delAction(item:any){
    let _this = this;
    this.$vux.confirm.show({
      /**
       * 取消操作
       */
      onCancel () {
        let newIndex = _this.InventoryList.findIndex((info:any,index:any)=>{
              return item.id == info.id;
        })
        _this.InventoryList[newIndex].active = false;
      },
      /**
       * 确认操作
       */
      onConfirm () {
        let newIndex = _this.InventoryList.findIndex((info:any,index:any)=>{
            return item.id == info.id;
        })
        _this.InventoryList.splice(newIndex,1);
        _this.selectedGood.splice(newIndex,1);
      },
      content:'请确认是否删除该物料?'
    })
  }
   /**
     * SAAS版本 选择仓库 未盘处理方式
     */
    private handlerWarehouse(val:any){
      this.LibraryField.forEach(item=>{
        if(item.id == val){
           item[val]= false;
        }
      })      
    }
  /**
   * 
   * 物料总数量\总金额
   */
    private get Total(){
         return this.InventoryList.reduce((ori,item) => {
            if(item.disperse_num){
                ori.disperse_num = ori.disperse_num + Number(item.disperse_num);
                if(item.distributePrice1){
                    ori.Amt = ori.Amt + (Number(item.disperse_num) * Number(item.distributePrice1));
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.disperse_num = 0;
                }
                return ori;
           }else{
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
    },{num:0,Amt:0,distributePrice1:0,disperse_num:0});
  } 
  
  /**  
   *  BOH盘点单 保存并提交
   */
  private saveReceive(rows:Array<any>){
    	if(!this.selectedGood||this.selectedGood.length<=0){
        this.$toasted.show("当前货品数量为0，请添加货品！");
        return false;
      }
        var rows=[]; 
				this.InventoryList.forEach(item => {    
					let obj = {
              "memo":item.memo || '',
              "unitName": item.unitName,
              "unit_id":item.unit_id,
              "consume_qty":item.consume_qty,
              "thery_qty":item.thery_qty,
              "acc_amt":item.acc_amt,
              "stockChecked":item.stockChecked,
              "acc_qty":item.acc_qty,
              "material_num":item.material_num,
              "stockMode":item.stockMode,
              "material_id":item.material_id, 
              "material_name":item.material_name,
              "distributePrice1":item.distributePrice1,
              "disperse_num":item.disperse_num || 0,   //实盘数
            };
					rows.push(obj);
        });
        let billInfo={
          "bill_type" : this.addinventory.bill_type,
          "bill_type_name" : this.addinventory.name,
          "warehouse_id" : this.addinventory.id,
          "busi_date" : this.user.auth.busi_date,
          "details":rows
        }
				this.service.getAdditionalcheckList(billInfo).then(res=>{
					this.addBillInfo={};
					this.setSelectedGood([]);
          this.addBeforeBillInfo={};
          this.InventoryList=[];
					this.cache.clear();
					this.$toasted.success("提交成功！");
					this.$router.push("/stockTaking");
				},err=>{
          this.$toasted.show(err.message)
        })
      }
  /**
   *  BOH版本   选择物料
   */
  private BohMaterials(){     
        let goodTerm = {};
        let addinventory = {};
        goodTerm={
          billsPageType: 'stocktaking',   
        }  
        addinventory ={
          bill_type:this.addinventory.bill_type,
        }
        formData.modifyParams(this.InventoryList,{
          // "disperse_num":'num',  //实盘数
          'memo':'remark',  
          'material_name':'name'    
        }) 
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.INVENTORY_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.cache.save(CACHE_KEY.MATERIAL_PARAM,JSON.stringify(addinventory));
        this.setSelectedGood(this.InventoryList)
        this.$router.push({name:'PublicAddGood',query:{}}) 
  }


   /**
    * SAAS页面   手工制单
    */
   manualproduction(newType:any){
    if(this.addinventory){
      for(let i=0;i<this.LibraryField.length;i++){
        let item = this.LibraryField[i];
        if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
            this.$toasted.show(item.msg);
            item[item.id]=true;
            return false;
          }
      }
      let goodTerm = {};
      goodTerm={
        billsPageType: 'stocktaking',
      }   
      this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
      this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
      this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
      this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(this.addinventory));
      this.$router.push({name:'PublicAddGood',query:{newType:newType}})
    }
  }
  /**
   * SAAS页面 盘点类型导入
   */
  private inventorytype(types:PageType,item:any,type:any){
     if(this.addinventory){
         let templateName = {};
         let addinventory = {};
         const flag = this.addinventory.bill_type;
         const warehouse_id = this.addinventory.stock;
         for(let i=0;i<this.LibraryField.length;i++){
            let item = this.LibraryField[i];
            if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
             }
         }
        templateName = {templateName:"盘点类型导入"}
        addinventory = {
            name:this.addinventory.name,
            bill_type:this.addinventory.bill_type,
            stock:this.addinventory.stock,
            treatment:this.addinventory.treatment,
            // stock_count_mode:this.addinventory.treatment.value,
            // warehouse_id:this.addinventory.stock.id
        }
        this.service.getInventorytypeImport(flag,warehouse_id).then(res=>{ 
              this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(addinventory));
              this.cache.save(CACHE_KEY.TEMPLATE_NAME,JSON.stringify(templateName))
              this.$router.push({name:'LibraryDetails',query:{types:types.toString()}});
          },err=>{
              this.$toasted.show(err.message)
          })
        }   
     }

     /**
      * SAAS页面模板导入
      */
     private templateimport(){ 
       if(this.addinventory){
         let addinventory = {};
         const warehouse_id = this.addinventory.stock;
         for(let i=0;i<this.LibraryField.length;i++){
            let item = this.LibraryField[i];
            if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
             }    
         }
        addinventory = {
            name:this.addinventory.name,
            bill_type:this.addinventory.bill_type,
            stock:this.addinventory.stock,
            treatment:this.addinventory.treatment,
            // stock_count_mode:this.addinventory.treatment.value,
            // warehouse_id:this.addinventory.stock.id
        }
        this.service.getTemplateImport(warehouse_id).then(res=>{
              this.cache.save(CACHE_KEY.TEMPLATEIMPORT,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(addinventory));
              this.$router.push({name:'SelecttheTemplate'});
          },err=>{
              this.$toasted.show(err.message)
          })
        }
     }
}
</script>
<style lang="less" scoped>
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.title-select-name .ezt-select {
    max-width: 80%;
}
select{
  color: #888;
}
.ezt-add-content{
  .method{
    width: @width;
    display: flex;
    flex-direction: column;
  p{
    font-size: 13px;
    color: #95A7BA;
    margin-top: 10px;
  }
  ul{
      display: flex;
      margin-top: 20px;
      justify-content: space-around;
    li{
      width: auto;
      font-size: 13px;
      border-radius: @border-radius;
      color: #1188FC;
      background-color: @background-color;
      padding: 10px 15px;
      cursor: pointer;
    }
  }
}
}
.addinventorylist{
   background-color: #F1F6FF;
}
input{
  text-align: right;
}
input.ezt-smart{
  border: 1px solid #ccc;
}
.weui-cell:before{
  border:none;
}
 //物料信息
.good-detail-content{
    position: relative;
    overflow: hidden;
    text-align: left;
    margin: 8px 10px;
    padding: 12px 10px 12px 15px;
    background: #FFFFFF;
    border: 1px solid #DDECFD;
    box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
    display: flex;
    flex: row;
    flex-direction: column;
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
      display:flex;
      flex-direction: row;
    }
    .good-detail-l>div>span{
      align-items: baseline;
      flex: 1;
    }
    .good-detail-r{
        display: inline-block;
        display:flex;
    }
    .good-detail-num{
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #FF885E;
        letter-spacing: 0;
        line-height: 3;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
        display: flex;
        line-height: 16px;
    }
    .good-detail-sort{
      font-size: 13px;
      color: #5F7B9A;
      letter-spacing: 0;
      display: flex;
      flex-direction: row;
    }
    .good-detail-nobreak{
      display:flex;
      flex:1;
      padding: 6px 0px 6px 0px;      
    }
    .ezt-dense-box{
      align-items: center;
      flex: 1 !important;
        input{
          text-align: left;
        }
    }
    .good-detail-billno{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
        padding: 0px 0px 5px;
    }
    .ezt-detail-good{    
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
    //物料明细结束 
    .park-input{
      display: flex;
      flex:1;
    }
    .park-input span{
      flex:2;
    }
    .title-search-right{
      flex: 2;
      text-align: right;
    } 
</style>
