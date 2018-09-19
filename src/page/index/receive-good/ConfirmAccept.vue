<!--收货修改页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货' @goBack="goBack">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main">       
      <div class="ezt-add-content">
         <ul class="ezt-title-search">
          <li>
            <span class="title-search-name">源单号：</span>
            <input type="text" class="ezt-middle">
          </li>
          <li>
            <span class="title-search-name">来货单位：</span>
            <input type="text" class="ezt-middle">
          </li>
          <li class="select-list">
            <span class="title-search-name ">仓库：</span>
            <span class="title-select-name item-select">
              <select name="" id="" placeholder="请选择" class="ezt-select" @change="handlerWarehouse" v-model="addInfo.warehouse">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
          <li class="input-list">
            <span class="title-search-name">备注：</span>
            <input type="text" class="ezt-middle">
          </li>         
        </ul>
        <div class="detail-acount-title">
          物料明细
        </div> 
        <ul>               
          <li class="good-detail-content" v-for="(item,index) in goodList" :key="index"> 
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
                          <span class="good-detail-name">{{item.name}}
                              <span class="good-detail-sort">（规格）</span>
                          </span>                         
                      </div>
                      <div>
                          <span class="good-detail-billno">编码：003222</span>
                          <span class="good-detail-sort">￥360.001</span>
                          <span class="title-search-name ezt-dense-box">
                            收：<input type="text" placeholder="10000" v-model="item.num" class="ezt-smart">
                            <!-- 收：{{item.num}} -->
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r">
                    <span class="icon-dail" @click="handlerDirect(item)">拨</span>
                    <div class="park-input">
                      <span class="title-search-name">备注：{{item.remark}}</span>
                      <!-- <input type="text" class="ezt-middle"> -->
                    </div>
                    
                  </div>                 
              </div> 
              <div class="ezt-detail-del" @click="deleteSection(item)">删除</div>                              
            <!-- </mt-cell-swipe> -->
             <div>
              <x-dialog v-model="isDirect" class="dialog-demo">
                <div class="ezt-dialog-header">
                  <span class="header-name">
                    直拨
                  </span>
                  <span class="ezt-close" @click="isDirect=false">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="ezt-dialog-title">
                  <span>可直拨：<span class="num">{{(activeRound.roundValue&&activeRound.roundValue.num)||0}}</span></span>
                  <span>已直拨：<span class="num">{{DirectedNum}}</span></span>
                </div>
                <div class="warehouse-list">
                    <ul class="warehouse-isDefault">
                        <li v-for="(item,index) in ((activeRound.roundValue&&activeRound.roundValue.list)||[])" :key="index">
                          <span>{{item.name}}</span>
                          <x-number v-model="item.num"  @on-change="changeDirect(item)" button-style="round" :min="0"></x-number>
                        </li>
                    </ul>
                </div> 
                <div class="mine-bot-btn">
                  <span class="ezt-lone-btn" @click="submitDerict">提交</span>
                </div>           
              </x-dialog>
            </div> 
          </li>                   
        </ul>
      </div> 
      <ezt-footer>
         <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-total">合计：
            <b>品项</b><span>{{this.goodList.length}}</span>，
            <b>数量</b><span>{{TotalNum}}</span>，
            <b>￥</b><span>{{TotalAmt}}</span>
          </div>
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive"> 提交</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
          </div>  
        </div>     
      </ezt-footer>
      <!-- 切换仓库时校验 是否有以下物料 -->
      <confirm v-model="isWarehouse" @on-cancel="onWarehouseCancel" :show-confirm-button="false">
        <p style="text-align:center;"> 物料a、物料b、物料c、物料...的物料关系未分配至仓库**，请重新选择仓库。</p>
      </confirm>
    </div>
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
declare var mobiscroll:any;
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
      //  'goodList':'receiveGood/goodList'
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class ReceiveGood extends Vue{
    private beforeWarehouse:string="";//切换仓库校验物品失败的时候，还原之前的仓库值
    private addInfo:any={
      warehouse:"01"
    };
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    private hideMask:()=>void;
    private showMask:()=>void;
    // private updateUser:INoop;
    private list:any[] = [];
    private DirectedNum:number=0;//已直拨的数量
    private restActiveRound:any={};
    private activeRound:any={};
    private goodList:any[] = [{
            id:21,
            name:'牛肉',
            price:'15',
            utilname:'KG',
            num:2,
            roundValue:{//可直拨的数据
              num: 10,
              numed:0,
              list:[{
                name:'仓库一号',
                num:0
              },{
                name:'仓库二号',
                num:0
              }]
            }
        },{
            id:2,
            name:'白菜',
            price:'1.5',
            utilname:'KG',
            num:3,
            roundValue:{//可直拨的数据
              num: 10,
              numed:0,
              list:[{
                name:'仓库一号',
                num:0
              },{
                name:'仓库二号',
                num:0
              }]
            }
        }];

    private tabList:TabList = new TabList();
    private isDirect:boolean = false; //是否可直拨弹框
    private isWarehouse:boolean = false;//切换仓库校验物料
    private orderType:any=[{
      name:'仓库1',
      type:'01',     
    },{
      name:'仓库2',
      type:'02',      
    }]
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
       this.beforeWarehouse = this.addInfo.warehouse;
       this.goodList.forEach(item=> this.$set(item,'active',false));
    }

    mounted(){  
    }

 /**
   * computed demo
   * 物料总数量
   */
    private get TotalNum(){
      return this.goodList.reduce((ori,item)=>{
        return Number(ori)+Number(item.num);       
      },0);
    }
  /**
   * 物料总金额
   */
  private get TotalAmt(){
    return this.goodList.reduce((ori,item)=>{
      return ori+(item.num*item.price);       
    },0).toFixed(2);
  }

  private handlerLeft(item:any){     
    item.active = true;
  }
  private handlerRight(item:any){
    item.active = false;
  }
   /**
   * 改变直拨的 数量
   */
  private changeDirect(item:any){  
    if(!this.activeRound.roundValue.list){
       this.DirectedNum = 0;
    }
    this.DirectedNum = this.activeRound.roundValue.list.filter((item:any)=>item.num).reduce((ori:number,item:any)=>ori+=item.num,0);
    if(this.DirectedNum<=this.activeRound.roundValue.num){
      item.oldNum = item.num;
    }else{
      item.num = item.oldNum;
    }
  }  
    /**
     * 确认收货
     */
    private confirmReceive(){
      this.$toasted.success("审核成功！")
      this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}});     
    }
    /**
     * 提交收货
     */
    private saveReceive(){
      this.$toasted.success("提交成功！");
      this.$router.push("/receiveGood");
    }
    /**
    *可直拨
     */
    private handlerDirect(item:any){
      this.restActiveRound = item;
      this.activeRound=ObjectHelper.serialize(this.restActiveRound);//深拷贝
      this.isDirect = true;
    }
    // 修改直拨提交
    private submitDerict(){
      ObjectHelper.merge(this.restActiveRound,this.activeRound,true);
      this.isDirect=false;
    }
    /**
     * 左滑删除某一项
     */
    private deleteSection(item:any){
      let newIndex = this.goodList.findIndex((info:any,index:any)=>{
        return item.id == info.id;
      })
      this.goodList.splice(newIndex,1);
    }
    /**
     * 切换仓库校验
     */
    private handlerWarehouse(){
      this.service.checkWarehouse().then(res=>{
        if(res.data.errcode==0){
          this.isWarehouse= true;
        }
      })
    }
    /**
     * 仓库切换校验 失败 返回
     */
    private onWarehouseCancel(){
      this.addInfo.warehouse = this.beforeWarehouse;
    }
    // 返回
    private goBack(){
      this.$router.push('/receiveGood');
    }
   
}
</script>

<style lang="less" scoped>
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
.warehouse-isDefault li{
  display:flex;
  flex-direction: row;
  align-items: center;
  flex:1;
  span{
    flex:1;
  }
}    
.ezt-dialog-header{
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  // background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
  // color: #fff;
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
  padding: 5px 0px;
}
.weui-cell:before{
  border:none;
}
 .detail-acount-title{
      font-size: 12px;
      color: #95A7BA;
      letter-spacing: 0;
      text-align: left;
      margin-left: 10px;
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
    }
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
       display:flex;
       flex-direction: row;
       align-items: center;
    }
    .good-detail-l>div>span{
       flex:1;
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
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
        display: flex;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
    }
    .good-detail-billno{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
        margin: 12px 0px;
    }
    .ezt-detail-good{
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
      // margin: 8px 10px;
      // padding: 12px 10px 12px 15px;
      transition: transform .5s;
      background: #fff;
      z-index: 2;
    }
    //物料明细结束 
    .ezt-detail-good input{
      // width: 50px;
    }
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
    .title-search-name.ezt-dense-box input{
      border: 1px solid #ccc;
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
    // 结束 
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
</style>
