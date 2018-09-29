<!--收货新增页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='添加采购入库单' @goBack="goBack">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main">
      <div class="ezt-add-content">
         <ul class="ezt-title-search">
          <li class="select-list">
            <span class="title-search-name ">单据类型：</span>
            <span class="title-select-name item-select">
              <select name="" id="" placeholder="请选择" class="ezt-select" v-model="addBillInfo.billType" 
                @change="handlerBillType">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
          <li class="select-list">
            <span class="title-search-name ">供应商：</span>
            <span class="title-select-name item-select">
              <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.supplier"
              @change="handlerSupplier">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
          <li class="select-list">
            <span class="title-search-name ">仓库：</span>
            <span class="title-select-name item-select">
              <select name="" id="" placeholder="请选择" class="ezt-select" v-model="addBillInfo.warehouse"
              @change="handlerWarehouse">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
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
        </ul>
        <ul>
           <li class="good-detail-content" :class="{'':item.active}" v-for="(item,index) in selectedGood" :key="index">
              <!-- <mt-cell-swipe
              :right="[
                  {
                  content: '删除',
                  style: { background: '#ccc', color: '#000' },
                  handler: () => {deleteSection(item)}
                  }
              ]"
              > -->
                <div class="ezt-detail-good" v-swipeleft="handlerLeft.bind(this,item)" 
                v-swiperight="handlerRight.bind(this,item)" :class="{'swipe-transform':item.active}">
                    <div class="good-detail-l">
                        <div>
                            <span class="good-detail-name">
                              <span class="good-detail-break">{{item.name}}</span> 
                              <span class="good-detail-sort">（规格）</span>
                            </span>
                        </div>
                        <div class="good-detail-nobreak">
                            <span class="good-detail-billno ">编码：003222</span>
                            <span class="good-detail-sort">￥{{item.price}}/{{item.utilname}}</span>
                            <span class="title-search-name ezt-dense-box">收：{{item.num}}</span>                         
                        </div>                     
                    </div>
                    <div class="good-detail-r">
                      <!-- <span class="icon-dail" @click="handlerDirect(item)">拨</span> -->
                      <div class="park-input"> 
                        <span class="title-search-name">备注：{{item.remark}}</span>
                        <!-- <input type="text" class="ezt-middle" v-model="item.remark"> -->
                      </div>                    
                    </div>
                </div> 
                <div class="ezt-detail-del" @click="deleteSection(item)">删除</div>
              <!-- </mt-cell-swipe>              -->
           </li>
        </ul> 
         <div>
            <x-dialog v-model="isDirect" class="dialog-demo">
                           
            </x-dialog>
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
    </div>
    <!-- 返回时提示保存信息 -->
    <confirm v-model="isSave" @on-confirm="onConfirm">
      <p style="text-align:center;"> 返回后，本次操作记录将丢失，请确认是否离开？</p>
    </confirm>
    <!-- 当有物料 单据类型发生变化时校验 -->
    <confirm v-model="isBillType" @on-cancel="onBillTypeCancel('billType')" @on-confirm="onBillTypeConfirm('billType')">
      <p style="text-align:center;"> 您已维护物料信息，如调整单据类型，须重新选择物料。</p>
    </confirm>
    <!-- 当有物料 供应商发生变化时校验 -->
    <confirm v-model="isSupplier" @on-cancel="onBillTypeCancel('supplier')" @on-confirm="onBillTypeConfirm('supplier')">
      <p style="text-align:center;"> 您已维护物料信息，如调整供应商，须重新选择物料。</p>
    </confirm>
    <!-- 当有物料 仓库发生变化时校验 -->
    <confirm v-model="isWarehouse" @on-cancel="onBillTypeCancel('warehouse')" @on-confirm="onBillTypeConfirm('warehouse')">
      <p style="text-align:center;"> 您已维护物料信息，如调整仓库，须重新选择物料。</p>
    </confirm>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { TabList } from '../../../common/ITab';
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
declare var mobiscroll:any;
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
       'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
      //  'addBillInfo':'publicAddGood/addBillInfo',//添加采购入库单的单据信息
      //  'addBeforeBillInfo':'publicAddGood/addBeforeBillInfo',//当改变单据信息的时候，取消时还原之前的值
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
export default class ReceiveGood extends Vue{
  private cache = CachePocily.getInstance(ECache.LocCache);
  private isSave:boolean=false;//确认不保存？
  private isBillType:boolean=false;//有物料，单据类型发生变化之后校验
  private isSupplier:boolean=false;//有物料，供应商发生变化 之后校验
  private isWarehouse:boolean=false;//有物料，仓库发生变化 之后校验
  private service: ReceiveGoodService;
  private pager:Pager;
  // private getGoodList:INoopPromise //调用store中的请求接口
  private hideMask:()=>void;
  private showMask:()=>void;
  // private updateUser:INoop;
  private list:any[] = [];
  private goodList:any[] = [];
  private DirectedNum:number=0;//已直拨的数量

  private tabList:TabList = new TabList();
  private isDirect:boolean = false; //是否可直拨弹框
  private selectedGood:any[];//store中selectedGood的值
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
  // private setAddBeforeBillInfo:INoopPromise;
  private addBillInfo:any={
    billType:"",
    supplier:"",
    warehouse:"",
    remark: "",
    editPrice:false
  };//store中
  // private setAddBillInfo:INoopPromise//store中给addBillInfo赋值
  private activeRound:any={};//深拷贝存储的值
  private restActiveRound:any={};//编辑时绑定的值
  private moveX:number=0; //滑动删除的位置
  private slideEffect:string="";//滑动删除改变 样式
  // private roundValue:any={//可直拨的数据
  //   num: 10,
  //   numed:3,
  //   list:[{
  //     name:'仓库一号',
  //     num:2
  //   },{
  //     name:'仓库二号',
  //     num:6
  //   },{
  //     name:'仓库三号',
  //     num:6
  //   },{
  //     name:'仓库四号',
  //     num:6
  //   },{
  //     name:'仓库五号',
  //     num:6
  //   },{
  //     name:'仓库六号',
  //     num:6
  //   }]
  // };
  private orderType:any[] = [{//单据类型下拉数据    
    name:"合同采购单",
    type:"q"
  },{
    name:"采购单",
    type:"m"
  }];
  created() {  
      this.pager = new Pager()
      this.service = ReceiveGoodService.getInstance();
      this.goodList = []; 
    if(this.cache.getData(CACHE_KEY.RECEIVE_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDINFO));
    }
    if(this.cache.getData(CACHE_KEY.RECEIVE_ADDBEFOREINFO)){
        this.addBeforeBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDBEFOREINFO));
    }
    //  this.getGoodList();
    (this.selectedGood||[]).forEach(item=>item.active = false);
  }

  mounted(){ 
    // if(!this.addBeforeBillInfo.billType){
    //   this.addBillInfo.billType="";
    //   this.addBillInfo.supplier="";
    //   this.addBillInfo.warehouse="";
    // }
  }

  private handlerLeft(item:any){ 
    item.active=true;
    
  }
  private handlerRight(item:any){
    item.active=false;
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
   * 左滑删除某一项
   */
  private deleteSection(item:any){
      let newIndex = this.selectedGood.findIndex((info:any,index:any)=>{
      return item.id == info.id;
      })
      this.selectedGood.splice(newIndex,1);
  }
    /**
     * 收货 提交
     */
    private saveReceive(){
      if(!this.addBillInfo.billType&&this.addBillInfo.billType==""){
        this.$toasted.show("请选择单据类型！");
        return false;
      }
      if(!this.addBillInfo.supplier&&this.addBillInfo.supplier==""){
        this.$toasted.show("请选择供应商！");
        return false;
      }
      if(!this.addBillInfo.warehouse&&this.addBillInfo.warehouse==""){
        this.$toasted.show("请选择仓库！");
        return false;
      }   
      if(!this.selectedGood||this.selectedGood.length<=0){
        this.$toasted.show("请添加物料！");
        return false;
      } 
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$toasted.success("提交成功！");
      this.$router.push("/receiveGood");
    }
    /**
     * 收货 提交并审核
     */
    private confirmReceive(){
      if(!this.addBillInfo.billType&&this.addBillInfo.billType==""){
        this.$toasted.show("请选择单据类型！");
        return false;
      }
      if(!this.addBillInfo.supplier&&this.addBillInfo.supplier==""){
        this.$toasted.show("请选择供应商！");
        return false;
      }
      if(!this.addBillInfo.warehouse&&this.addBillInfo.warehouse==""){
        this.$toasted.show("请选择仓库！");
        return false;
      }
      if(!this.selectedGood||this.selectedGood.length<=0){
        this.$toasted.show("请添加物料！");
        return false;
      }
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$toasted.success("审核成功！");
       this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}});     
    }    
     //选择物料
    private renderUrl(info:string){
      if(this.addBillInfo){
        if(!this.addBillInfo.billType&&this.addBillInfo.billType==""){
          this.$toasted.show("请选择单据类型！");
          return false;
        }
        if(!this.addBillInfo.supplier&&this.addBillInfo.supplier==""){
          this.$toasted.show("请选择供应商！");
          return false;
        }
        if(!this.addBillInfo.warehouse&&this.addBillInfo.warehouse==""){
          this.$toasted.show("请选择仓库！");
          return false;
        }
        this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push(info);
      }      
    }
    private checkEmpty(errorMsg:any){
      
     
    }
    /**
     * 选择单据类型
     */
    private handlerBillType(item:any){
      if(this.selectedGood.length>0){
        this.isBillType=true;
      }else{
        this.addBeforeBillInfo.billType=this.addBillInfo.billType;            
      }
    }
     /**
     * 选择供应商
     */
    private handlerSupplier(item:any){
      if(this.selectedGood.length>0){
        this.isSupplier=true;
      }else{
        this.addBeforeBillInfo.supplier=this.addBillInfo.supplier;            
      }
    }
     /**
     * 选择仓库
     */
    private handlerWarehouse(item:any){
      if(this.selectedGood.length>0){
        this.isWarehouse=true;
      }else{
        this.addBeforeBillInfo.warehouse=this.addBillInfo.warehouse;            
      }
    }
    /**
     * 有物料时 单据类型、供应商、仓库 变化 确认校验
     */
    private onBillTypeConfirm(val:any){
      this.setSelectedGood([]);
      this.addBeforeBillInfo[val]=this.addBillInfo[val];
    }
    /**
     * 有物料时 单据类型变化、供应商、仓库变化  取消校验
     */
    private onBillTypeCancel(val:any){
      this.addBillInfo[val] = this.addBeforeBillInfo[val];
    }



    /**
     * 返回
     */
    private goBack(){
      if((this.addBillInfo&&this.addBillInfo.billType)||this.selectedGood.length>0){
        this.isSave=true;
      }else{
        this.$router.push('/receiveGood');
      }
    }
    private onConfirm(){//确认离开，清空store中的物料和单据信息
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$router.push('/receiveGood');
    }
    // private getGoodList(){
    //     this.service.getGoodList(this.pager.getPage()).then(res=>{
    //        this.list = res.data.data;
    //        this.pager.setNext();
    //     },err=>{
    //         this.$toasted.show(err.message);
    //     });

    //     this.pager.setLimit(20);
    // }
   
}
</script>

<style lang="less" scoped>
input.ezt-smart{
  border: 1px solid #ccc;
}
.mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 20px;
        .ezt-lone-btn{
        display: inline-block;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        padding: 8px 90px;
        margin-bottom: 10px;
        border-radius: 40px;
        background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
        background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
        -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
        box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
  }
.ezt-dialog-header{
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  .header-name{
    flex:1;
    margin-right: -20px;
  }
  .ezt-close{
    margin-right:20px;
  }
}
.ezt-dialog-title{
  padding: 10px 0px;
  background: #FFF8DD;
  display:flex;
  flex-direction: row;
  span.num{
    font-size: 15px;
    color:red;
  }
}
.ezt-dialog-title>span{
  flex:1;
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
      // padding: 5px 0px;
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
    .icon-dail{
      flex: .1;
      background: pink;
      display: inline-block;
      height: 20px;
      border: 1px solid #ccc;
      // width: 20px;
      text-align: center;
    }
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
    //直拨仓库   
    .warehouse-list{
        flex: 1;
        text-align: center;
        margin-left: 10px;
        max-height: 240px;
        overflow-x: auto;
        .warehouse-isDefault{           
          display: inline-block;               
            
        }   
    }
    .warehouse-title-num{
      display: flex;
      flex-direction: column;
      background: #ccc;
    }
    .good-warehouse-num{
      margin-left: 10px;
      color: #95A7BA;
      letter-spacing: 0;
    }
    .remark-area{
      flex: .8;
    }  
    .title-search-right{
      flex: 2;
      text-align: right;
    }
    .warehouse-isDefault li{
      display:flex;
      flex-direction: row;
      align-items: center;
      flex:1;
      span{
        flex:1;
      }
    }    
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
      text-align: center;
      line-height: 50px;
    }
</style>
