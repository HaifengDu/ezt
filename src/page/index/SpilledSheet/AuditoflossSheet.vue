<!--审核损溢单-->
<template>
  <div class="ezt-page-con AuditoflossSheet">
    <ezt-header :back="true" title='审核损溢单' @goBack="goBack" :isInfoGoback="true">
       <div slot="action">
       </div>   
    </ezt-header>    
    <div class="ezt-main">
      <div class="ezt-add-content">
         <ul class="ezt-title-search">
          <li>
              <span class="title-search-name">单号：</span>
              <input type="text" class="ezt-middle" disabled v-model="addBillInfo.billno">
          </li>
           <li>
              <span class="title-search-name">仓库：</span>
              <input type="text" class="ezt-middle" disabled v-model="addBillInfo.warehouse">
          </li>
           <li>
              <span class="title-search-name">单据类型：</span>
              <input type="text" class="ezt-middle" disabled v-model="addBillInfo.billType">
          </li>
           <li>
              <span class="title-search-name">损溢原因：</span>
              <input type="text" class="ezt-middle" disabled v-model="addBillInfo.causeofloss">
          </li>
          <li>
            <x-input title="备注：" v-model="addBillInfo.remark"></x-input>
          </li>
          <li>
            <span class="title-search-name is-required">选择物料：</span>
            <span class="title-search-right" @click="selectMaterials()">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </li>
        </ul>
        <ul>
           <li class="good-detail-content" :class="{'':item.active}" v-for="(item,index) in selectedGood" :key="index">    
                <div class="ezt-detail-good" v-swipeleft="handleSwipe.bind(this,item,true)" 
                v-swiperight="handleSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
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
      <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
            <b>品项</b><span>{{this.selectedGood.length}}</span>，
            <b>数量</b><span>{{Total.num}}</span>，
            <b>￥</b><span>{{Total.Amt.toFixed(2)}}</span>
          </div>
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive">提交</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 审核</a>   
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
import { SpilledSheetService } from '../../../service/SpilledSheetService'
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
        'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
     })
   },
   methods:{
    ...mapActions({
      'setSelectedGood':'publicAddGood/setSelectedGood',
    })    
   }
})
export default class SpilledSheet extends Vue{
  private cache = CachePocily.getInstance();
  private service: SpilledSheetService;
  private selectedGood:any[];//store中selectedGood的值
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
  private addBillInfo:any={};
  private orderType:any[] = [{//单据类型下拉数据    
    name:"报损",
    type:"q"
  },{
    name:"盘点损溢",
    type:"m"
  }];
  
  created() {  
    this.service = SpilledSheetService.getInstance();
    if(this.cache.getData(CACHE_KEY.SPILLEDSHEET_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getData(CACHE_KEY.SPILLEDSHEET_ADDINFO));
    }
    this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
    (this.selectedGood||[]).forEach(item=>item.active = false);
  }

  mounted(){ 
   
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
      return this.selectedGood.reduce((ori,item)=>{
        ori.num = ori.num+Number(item.num);       
        ori.Amt = ori.Amt + (Number(item.num) * Number(item.price));
        return ori;
      },{num:0,Amt:0});
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
        let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
          return item.id == info.id;
        })
        _this.selectedGood[newIndex].active = false;
      },
      /**
       * 确认操作
       */
      onConfirm () {
        let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
          return item.id == info.id;
        })
        _this.selectedGood.splice(newIndex,1);
      },
      content:'请确认是否删除该物料?'
    })
  }
  /**
   *  损溢单 提交
   */
  private saveReceive(){
    if(!this.selectedGood||this.selectedGood.length<=0){
      this.$toasted.show("请添加物料！");
      return false;
    } 
    this.addBillInfo={},
    this.setSelectedGood([]);
    this.addBeforeBillInfo={};
    this.$toasted.success("提交成功！");
    this.$router.push("/spilledSheet");
  }
  /**
   * 损溢单 审核
   */
  private confirmReceive(){
    let _this = this;
    if(!this.selectedGood||this.selectedGood.length<=0){
      this.$toasted.show("请添加物料！");
      return false;
    }
    this.$vux.confirm.show({
      /**
       * 审核不通过
       */
      onCancel () {
        _this.addBillInfo={},
        _this.setSelectedGood([]);
        _this.addBeforeBillInfo={};
        _this.$router.push({name:'SpilledSheet',params:{'purStatus':'已完成'}}); 
      },
      /**
       * 审核通过
       */
      onConfirm () {
        _this.addBillInfo={},
        _this.setSelectedGood([]);
        _this.addBeforeBillInfo={};
        _this.$toasted.success("审核成功！");
        _this.$router.push({name:'SpilledSheet',params:{'purStatus':'已完成'}}); 
      },
      content:'确认审核该单据？',
      confirmText:"审核通过",
      cancelText:"审核不通过",
      hideOnBlur:true
    })
  }    
  /**
   * 选择物料
   */
  private selectMaterials(){
    let goodTerm = {};
    if(this.addBillInfo){
      goodTerm={
        billsPageType: 'spilledSheet',
      }  
      this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
      this.cache.save(CACHE_KEY.SPILLEDSHEET_ADDINFO,JSON.stringify(this.addBillInfo));
      this.cache.save(CACHE_KEY.SPILLED_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
      this.$router.push({name:'PublicAddGood',params:{}});
    }      
  }
  /**
   * 选择单据类型 仓库  损溢原因
   */
  private handlerBillType(val:any,title:any){
    let _this = this;
    if(this.selectedGood.length>0){
       this.$vux.confirm.show({
        /**
         * 取消操作
         */
        onCancel () {
          _this.addBillInfo[val] = _this.addBeforeBillInfo[val];
        },
        /**
         * 确认操作
         */
        onConfirm () {
          _this.setSelectedGood([]);
          _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
        },
        content:title
      })
    }else{
      _this.addBeforeBillInfo[val]=_this.addBillInfo[val];  
    }
  }
  /**
   * 返回
   */
  private goBack(){
    let _this = this;
    if((this.addBillInfo&&this.addBillInfo.billType)||this.selectedGood.length>0){
      this.$vux.confirm.show({
        /**
         * 取消操作
         */
        onCancel () {
          console.log(this) 
        },
        /**
         * 确认操作
         */
        onConfirm () {
          _this.addBillInfo={},
          _this.setSelectedGood([]);
          _this.addBeforeBillInfo={};
          _this.$router.push('/spilledSheet');
        },
        content:"返回后，本次操作记录将丢失，请确认是否离开？"
      })
    }else{
      this.$router.push('/spilledSheet');
    }
  } 
}
</script>
<style lang="less" scoped>
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
      right: 10px;
      top: 30px;
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 25px;
    }
</style>
