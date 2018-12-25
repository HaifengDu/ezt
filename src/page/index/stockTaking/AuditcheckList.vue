<!--审核盘点单-->
<template>
   <div class="ezt-page-con addinventorylist">
    <ezt-header :back="true" title='审核盘点单' @goBack="goBack" :isInfoGoback="true">
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
              <input type="text" class="ezt-middle" disabled v-model="detail.bill_type_name">
          </li>
          <li>   
              <span class="title-search-name">仓库：</span>
              <input type="text" class="ezt-middle" disabled v-model="detail.warehouse_name">
          </li>
          <li  v-if="!InterfaceSysTypeBOH">
              <span class="title-search-name">未盘处理：</span>
              <input type="text" class="ezt-middle" disabled v-model="detail.stock_count_mode_name">
          </li>
          <li v-if="InterfaceSysTypeBOH">
            <span class="title-search-name is-required">选择货品：</span>
            <span class="title-search-right" @click="selectMaterials()">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </li>   
        </ul>
        <ul>
           <li class="good-detail-content" :class="{'':item.active}" v-for="(item,index) in InventoryList" :key="index">    
                <div class="ezt-detail-good" v-swipeleft="handleSwipe.bind(this,item,true)" 
                v-swiperight="handleSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                    <div class="good-detail-l">
                        <div>
                            <span class="good-detail-name">    
                              <span class="good-detail-break">{{item.material_name}}</span> 
                              <span class="good-detail-sort" v-if="item.material_model || ''">（{{item.material_model}}）</span> 
                            </span>
                        </div>
                        <div class="good-detail-nobreak">
                              <span class="good-detail-billno">编码：{{item.material_num}}</span>
                              <span class="good-detail-sort">单位：{{item.unitName}}</span> 
                        </div> 
                        <div>
                            <span class="title-search-name ezt-dense-box">账面数量：{{item.acc_qty}}</span>   
                            <span class="title-search-name ezt-dense-box">实盘数：{{item.disperse_num}}</span> 
                        </div> 
                    </div>
                    <div class="good-detail-r">
                      <div class="park-input" style="margin-top:10px;"> 
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
          <div class="ezt-foot-button" v-if="InterfaceSysTypeBOH">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive()">提交</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
          </div>  
        </div>
      </ezt-footer>
    </div>      
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../helper/methods'
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import ObjectHelper from '../../../common/objectHelper'
import IUser from "../../../interface/IUserModel"
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import CACHE_KEY from '../../../constans/cacheKey'
import { constants } from 'http2'
import formData from '../../../dictory/formData'
@Component({
   components:{
   },
   mixins:[maskMixin],
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
    private detail:any={};//盘库表头信息
    private warehouseType:any[] = [];  //动态加载仓库
    private addinventory:any={};//新增盘库单
    private InventoryList:any[] = [];   
    private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
    private addBillInfo:any={
       editPrice:false
    }; 
    private InventoryType:any; 
  created() {  
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createStockTaking();
    if(this.cache.getData(CACHE_KEY.INVENTORY_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INVENTORY_ADDINFO));
    } 
    if(this.cache.getData(CACHE_KEY.INVENTORY_LIST)){
        this.detail = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_LIST));
    }
    if(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS)){
        this.InventoryList  = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS));
        this.InventoryList = this.InventoryList['details']
    }
    if(this.selectedGood&&this.selectedGood.length>0){
      formData.modifyParams(this.selectedGood,{//将选择物料中的字段转为当前模块后台想要的字段
          num:"disperse_num",  //实盘数
          remark:'memo',  
          name:'material_name',
          price:"distributePrice1"       
      })
      this.InventoryList = ObjectHelper.serialize(this.selectedGood);
    }  
    (this.InventoryList||[]).forEach((item:any)=> this.$set(item,'active',false));
    this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
  }

  mounted(){ 
      
  }
  /**
   * 返回
   */
  private goBack() {     
      let _this = this;   
      if(this.addinventory ||this.addinventory.length>0 || this.InventoryList.length>0){
          this.$vux.confirm.show({
              onCancel () {
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
   * 左侧滑动
   */
  private handleSwipe(item:any,active:boolean){ 
    item.active=active;
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
      },
      content:'请确认是否删除该货品?'
    })
  } 
  /**
   *  审核盘点单 提交
   */
  private saveReceive(rows:Array<any>){
        var rows =[];
        this.InventoryList.forEach((item:any) => {
					let obj = {
              id: item.id,
              stockChecked: item.stockChecked,
              acc_amt: item.acc_amt,
              consume_qty: item.consume_qty,
              stockMode: item.stockMode,
              material_num: item.material_num,
              material_id: item.material_id,
              unit_id: item.unit_id,
              thery_qty: item.thery_qty,
              unitName: item.unitName,
              material_name: item.material_name,
              acc_qty:item.acc_qty,
              distributePrice1:item.distributePrice1,
              disperse_num:item.disperse_num,
              memo:item.memo
            };
					rows.push(obj);    
        });  
        let billInfo={   
          "id": this.detail.id,
          "bill_type":this.detail.bill_type,
          "bill_type_name":this.detail.bill_type_name,
          "warehouse_id":this.detail.warehouse_id,
          "busi_date":this.user.auth.busi_date, 
          "bill_status":'SCM_AUDIT_NO', // SCM_AUDIT_NO 是修改      SCM_AUDIT_YES 提交并审核
          "details":rows
        }  
      this.service.getAuditchecklistyes(billInfo).then(res=>{ 
        if(!this.InventoryList||this.InventoryList.length<=0){
            this.$toasted.show("当前货品数量为0，请添加货品！");
            return false;
          } 
          this.addBillInfo={};
          this.setSelectedGood([]);
          this.addBeforeBillInfo={};
          this.cache.clear();
          this.$toasted.success("提交成功！");
          this.$router.push("/stockTaking");
      },err=>{
          this.$toasted.show(err.message)
      })
     }
  /**
   * 审核盘点单 提交并审核
   */
  private confirmReceive(index:any){
    let _this = this;
    if(!this.InventoryList||this.InventoryList.length<=0){
      this.$toasted.show("当前货品数量为0，请添加货品！");
      return false;
    }
    this.$vux.confirm.show({
      /**
       * 审核不通过
       */
      onCancel () {
        
      },
      /**
       * 审核通过
       */
      onConfirm (rows:Array<any>) {
            var rows=[];
           	_this.InventoryList.forEach((item:any) => {
              let obj = {
                  id: item.id,
                  stockChecked: item.stockChecked,
                  acc_amt: item.acc_amt,
                  consume_qty: item.consume_qty,
                  stockMode: item.stockMode,
                  material_num: item.material_num,
                  material_id: item.material_id,
                  unit_id: item.unit_id,
                  thery_qty: item.thery_qty,
                  unitName: item.unitName,
                  material_name: item.material_name,
                  acc_qty:item.acc_qty,
                  distributePrice1:item.distributePrice1,
                  disperse_num:item.disperse_num,
                  memo:item.memo,
                };
              rows.push(obj);
            });
            let billInfo={
              "id": _this.detail.id,
              "bill_type":_this.detail.bill_type,
              "bill_type_name":_this.detail.bill_type_name,
              "warehouse_id":_this.detail.warehouse_id,
              "busi_date":_this.user.auth.busi_date, 
              "bill_status":'SCM_AUDIT_YES', // SCM_AUDIT_NO 是修改      SCM_AUDIT_YES 提交并审核
              "details":rows
            }
            _this.service.getAuditchecklistyes(billInfo).then(res=>{ 
                _this.addBillInfo={};
                _this.setSelectedGood([]);
                _this.addBeforeBillInfo={};
                _this.cache.clear();
                _this.$toasted.success("审核成功！");
                _this.$router.push({name:'StockTaking',params:{'purStatus':'已审核'}}); 
            },err=>{
              _this.$toasted.show(err.message)
            })
      },
      content:'确认审核该单据？',
      confirmText:"审核通过",
      cancelText:"审核不通过",
      showCancelButton:!_this.InterfaceSysTypeBOH,
      hideOnBlur:true
    }) 
  }    
  /**
   * 选择货品
   */
  private selectMaterials(){ 
      let goodTerm = {};
      goodTerm={
        billsPageType: 'stocktaking',
      }   
      formData.modifyParams(this.InventoryList,{
          "disperse_num":'num',  //实盘数
          'memo':'remark',  
          'material_name':'name'    
      }) 
      this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
      this.cache.save(CACHE_KEY.INVENTORY_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
      this.cache.save(CACHE_KEY.MATERIAL_PARAM,JSON.stringify(this.detail));
      this.setSelectedGood(this.InventoryList)
      this.$router.push({name:'PublicAddGood',query:{}}) 
    }
  }
</script>
<style lang="less" scoped>
@width:100%;
@height:100%;
@background-color:#fff; 
@border-radius:3px;
.ezt-dense-box input{
  text-align: left;
}
.ezt-page-footer{
  background: none;
  box-shadow: none;
} 
.title-select-name .ezt-select {
    max-width: 80%;
}
select{
  color: #888;
}
.demo3-slot{
  text-align: center;
  padding: 8px 0;
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
      padding: 6px 0 0 0;      
    }
    .ezt-dense-box{
      align-items: center;
      flex: 1 !important;
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
    //物料明细结束 
    .park-input{
      display: flex;
      flex:1;
    }
    .park-input span{
      flex:2;
    }
    .title-search-name.remark{
      margin-left: 10px;
    }
    .title-search-right{
      flex: 2;
      text-align: right;
    }
    .swipe-transform{
      transform: translateX(-50px);
    }
    .ezt-detail-del{
      position: absolute;
      right: -9px;
      top: 0;
      width: 50px;
      height: 125px;
      text-align: center;
      line-height: 125px;
      font-size: 25px;
      display: flex;
      align-items: center;
    }
</style>
