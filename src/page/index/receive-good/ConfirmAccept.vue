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
            <span class="title-search-name">单号：</span>
            <!-- <input type="text" class="ezt-middle"> -->
            {{addBillInfo.bill_no}}
          </li>
          <li class="select-list" v-if="receive_billtype.cai">
            <span class="title-search-name">单据类型：</span>
            <span>
             {{addBillInfo.billType}}
            </span>
          </li>
          <li>
            <span class="title-search-name">来货单位：</span>
            <input type="text" class="ezt-middle">
          </li>
          <li class="select-list">
            <span class="title-search-name is-required">仓库：</span>
            <span class="title-select-name item-select" v-if="!receive_billtype.cai">
              <select name="" id="" placeholder="请选择" class="ezt-select" @change="handlerWarehouse"
               v-model="addBillInfo.warehouse" :class="[{'selectError':errWarehouse}]">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
            <span v-if="receive_billtype.cai">
              {{addBillInfo.warehouse}}
            </span>
          </li>
          <li class="input-list">
            <span class="title-search-name">备注：</span>
            <input type="text" class="ezt-middle" v-model="addBillInfo.remark">
          </li>  
          <li v-if="receive_billtype.cai">
            <!-- <span class="title-search-name">选择物料：</span> -->
            <span class="title-search-name">选择物料：</span>
            <span class="title-search-right" @click="renderUrl('/publicAddGood')">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </span>
            
          </li>       
        </ul>
        <div class="detail-acount-title">
          物料明细
        </div> 
        <!-- 可编辑  配送收货、直配收货-->
        <ul v-if="receive_billtype.shou">               
          <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index"> 
              <div class="ezt-detail-good">
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
                            收：<input type="text" @change="numChange(item,'num')" placeholder="10000" v-model="item.num" class="ezt-smart">
                            <!-- 收：{{item.num}} -->
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r" v-if="receive_billtype.shou">
                    <span class="icon-dail" @click="handlerDirect(item)">拨</span>
                    <div class="park-input">
                      备注：<input v-model="item.remark" class="ezt-middle" placeholder="请输入备注" type="text"/>
                    </div>                    
                  </div>  
                  <div class="good-detail-r" v-if="receive_billtype.cai">
                    <!-- <span class="icon-dail" @click="handlerDirect(item)">拨</span> -->
                    <div class="park-input">
                      <span class="title-search-name">备注：{{item.remark}}</span>
                    </div>                    
                  </div>               
              </div> 
              <div class="ezt-detail-del" @click="delAction(item)">删除</div> 
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
        <!-- 不可编辑    采购入库  允许删除物料-->
        <ul v-if="!receive_billtype.shou&&!receive_billtype.diao">               
          <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index"> 
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
                            <!-- 收：<input type="text" placeholder="10000" v-model="item.num" class="ezt-smart"> -->
                            收：{{item.num}}
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r">
                    <!-- <span class="icon-dail" @click="handlerDirect(item)">拨</span> -->
                    <div class="park-input">
                      <span class="title-search-name">备注：{{item.remark}}</span>
                    </div>
                    
                  </div>                 
              </div> 
              <div class="ezt-detail-del" @click="delAction(item)">删除</div> 
          </li>                   
        </ul>

         <!-- 不可编辑    平调入库  不允许删除物料-->
        <ul v-if="receive_billtype.diao">               
          <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index"> 
              <div class="ezt-detail-good" :class="{'swipe-transform':item.active}">
                  <div class="good-detail-l">
                      <div>
                          <span class="good-detail-name">{{item.name}}
                              <span class="good-detail-sort">(/{{item.utilname}})</span>
                          </span>                         
                      </div>
                      <div>
                          <span class="good-detail-billno">编码：003222</span>
                          <span class="good-detail-sort">￥360.001</span>
                          <span class="title-search-name ezt-dense-box">
                            <!-- 收：<input type="text" placeholder="10000" v-model="item.num" class="ezt-smart"> -->
                            收：{{item.num}}
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r">
                    <!-- <span class="icon-dail" @click="handlerDirect(item)">拨</span> -->
                    <div class="park-input">
                      <span class="title-search-name">备注：{{item.remark}}</span>
                    </div>
                    
                  </div>                 
              </div> 
              <div class="ezt-detail-del" @click="deleteSection(item)">删除</div> 
          </li>                   
        </ul>
      </div> 
      <ezt-footer>
         <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-total">合计：
            <b>品项</b><span>{{this.selectedGood.length}}</span>，
            <b>数量</b><span>{{TotalNum}}</span>，
            <b>￥</b><span>{{TotalAmt}}</span>
          </div>
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive" v-if="receive_billtype.shou">暂存</a>  
            <a href="javascript:(0)" class="ezt-foot-storage" @click="refulseReceive" v-if="receive_billtype.diao">驳回</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive" v-if="receive_billtype.shou || receive_billtype.diao">收货</a>
            <a href="javascript:(0)" class="ezt-foot-storage" @click="submitReceive" v-if="receive_billtype.cai">提交</a>
            <a href="javascript:(0)" class="ezt-foot-sub" @click="saveAndAuditReceive" v-if="receive_billtype.cai">提交并审核</a>   
          </div>  
        </div>     
      </ezt-footer>
      <!-- 切换仓库时校验 是否有以下物料 -->
      <confirm v-model="isWarehouse" @on-cancel="onWarehouseCancel" :show-confirm-button="false">
        <p style="text-align:center;"> 物料a、物料b、物料c、物料...的物料关系未分配至仓库**，请重新选择仓库。</p>
      </confirm>
      <!-- 删除物料时 校验 -->
      <confirm v-model="isDelGood" @on-confirm="onDelConfirm" @on-cancel="onDelCancel">
          <p style="text-align:center;"> 请确认是否删除该物料。</p>
      </confirm>
      <!-- 审核时 校验 -->
      <confirm v-model="isAudit" confirm-text="审核通过" cancel-text="审核不通过" @on-confirm="onPassAudit" @on-cancel="onUnpassAudit">
          <p style="text-align:center;"> 请确认是否删除该物料。</p>
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
      //  'goodList':'receiveGood/goodList'
      selectedGood:"publicAddGood/selectedGood",
     })
   },
   methods:{
     ...mapActions({
      //  'getGoodList':"receiveGood/getGoodList"
      setSelectedGood:"publicAddGood/setSelectedGood",
     })
   }
})
export default class ReceiveGood extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    // private beforeWarehouse:string="";//切换仓库校验物品失败的时候，还原之前的仓库值
    // private addInfo:any={
    //   warehouse:"01"
    // };
    private isDelGood:boolean = false; //删除物料判断
    private deleteData:any={};//删除时存储所删除数据
    private service: ReceiveGoodService;
    private selectedGood: any[];
    private setSelectedGood: INoopPromise;
    private pager:Pager;
    private getGoodList:INoopPromise
    private hideMask:()=>void;
    private showMask:()=>void;
    // private updateUser:INoop;
    private list:any[] = [];
    private DirectedNum:number=0;//已直拨的数量
    private restActiveRound:any={};
    private activeRound:any={};
    private errWarehouse:boolean = false;
    // private goodList:any[] = [{
    //         id:21,
    //         name:'牛肉',
    //         price:'15',
    //         utilname:'KG',
    //         num:2,
    //         roundValue:{//可直拨的数据
    //           num: 10,
    //           numed:0,
    //           list:[{
    //             name:'仓库一号',
    //             num:0
    //           },{
    //             name:'仓库二号',
    //             num:0
    //           }]
    //         }
    //     },{
    //         id:2,
    //         name:'白菜',
    //         price:'1.5',
    //         utilname:'KG',
    //         num:3,
    //         roundValue:{//可直拨的数据
    //           num: 10,
    //           numed:0,
    //           list:[{
    //             name:'仓库一号',
    //             num:0
    //           },{
    //             name:'仓库二号',
    //             num:0
    //           }]
    //         }
    //     }];

    private tabList:TabList = new TabList();
    private isDirect:boolean = false; //是否可直拨弹框
    private isWarehouse:boolean = false;//切换仓库校验物料
    private isAudit:boolean = false;//审核时校验
    private receive_billtype: any = {
      shou:false,
      cai:false,
      diao:false
    };
    private orderType:any=[{
      name:'仓库1',
      type:'01',     
    },{
      name:'仓库2',
      type:'02',      
    }]
    private addBillInfo:any={};
    private addBeforeBillInfo:any={};
    private oldValue = 1;
    created() { 
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
      //  this.beforeWarehouse = this.addInfo.warehouse;
       this.selectedGood.forEach(item=> this.$set(item,'active',false));
    }
    mounted(){     
      
      if(this.cache.getData(CACHE_KEY.RECEIVE_BILLTYPE)){
        switch (JSON.parse(this.cache.getData(CACHE_KEY.RECEIVE_BILLTYPE))){
          case "配":
            this.receive_billtype.shou = true;
            this.receive_billtype.cai=false;
            this.receive_billtype.diao=false;
          break;
          case "直":
            this.receive_billtype.shou = true;
            this.receive_billtype.cai = false;
            this.receive_billtype.diao = false;
          break;
          case "采":
            this.receive_billtype.cai = true;
            this.receive_billtype.shou = false;
            this.receive_billtype.diao = false;
          break;
          case "调":
            this.receive_billtype.diao = true;
          break;
        };
      }
      console.log(this.receive_billtype,'000999')
      if(this.cache.getData(CACHE_KEY.RECEIVE_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDINFO));
      }
      if(this.cache.getData(CACHE_KEY.RECEIVE_ADDBEFOREINFO)){
        this.addBeforeBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDBEFOREINFO));
      }
      if(this.selectedGood.length==0&&this.addBillInfo.goodList){
        this.setSelectedGood(this.addBillInfo.goodList); 
      }
      (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
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

  private handlerLeft(item:any){     
    item.active = true;
  }
  private handlerRight(item:any){
    item.active = false;
  }
  private numChange(item:any,info:any){
    if(item[info]==""||item[info]==0){
      item[info]=1;
    }
    if(!isNaN(item[info])){
      this.oldValue = item[info];//是一个数
    }else{
      item[info] = this.oldValue||1;
    }
    item[info] = parseFloat(item[info]);
    (this.addBeforeBillInfo.goodList).forEach((beforeInfo:any,beforeIndex:any)=>{
      if(item.id == beforeInfo.id && item[info]>beforeInfo[info] ){
        this.$toasted.show("收货数量不能超过采购数量！");
        item[info] = beforeInfo[info];
      }
    })
  }
  //审核通过操作
  private onPassAudit(){
    this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$toasted.success("审核成功！");
      this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}});    
  }
  //审核不通过操作
  private onUnpassAudit(){
    this.addBillInfo={},
    this.setSelectedGood([]);
    this.addBeforeBillInfo={};
    this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}});  
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
      if(!this.addBillInfo.warehouse||this.addBillInfo.warehouse==""){
        this.errWarehouse = true;
        this.$toasted.show("请选择仓库！");
        return false;
      }        
      if(!this.selectedGood || this.selectedGood.length<=0){
        this.$toasted.show("请添加物料！");
        return false;
      }
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$toasted.success("收货成功！")
      this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}});     
    }
    /**
     * 暂存收货
     */
    private saveReceive(){
      if(!this.addBillInfo.warehouse||this.addBillInfo.warehouse==""){
        this.errWarehouse = true;
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
     * 平调收货 驳回
     */
    private refulseReceive(){
      if(!this.selectedGood||this.selectedGood.length<=0){
        this.$toasted.show("请添加物料！");
        return false;
      }
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
      this.$toasted.success("驳回成功！")
      this.$router.push("/receiveGood");
    }
    /**
     * 采购入库 提交
     */
    private submitReceive(){
      this.setSelectedGood(this.selectedGood.filter(checkItem => (checkItem.num&&checkItem.num!=0)));
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
       //选择物料
    private renderUrl(info:string){     
        this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push(info);
    } 
    /**
     * 保存并审核
     */
    private saveAndAuditReceive(){
      this.setSelectedGood(this.selectedGood.filter(checkItem => (checkItem.num&&checkItem.num!=0)));
      if(!this.selectedGood||this.selectedGood.length<=0){
        this.$toasted.show("请添加物料！");
        return false;
      }
      this.isAudit = true;
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
     * 删除物料操作
     */
    private delAction(item:any){
        this.deleteData = item;
        this.isDelGood = true;
    }
    /**
     * 确认删除物料
     */
    private onDelConfirm(){
        this.deleteSection(this.deleteData);
    }
    /**
     * 取消删除物料
     */
    private onDelCancel(){
        this.isDelGood = false;
        let newIndex = this.selectedGood.findIndex((info:any,index:any)=>{
        return this.deleteData.id == info.id;
        })
        this.selectedGood[newIndex].active = false;
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
      this.addBillInfo.warehouse = this.addBeforeBillInfo;
    }
    // 返回
    private goBack(){
      this.addBillInfo={},
      this.setSelectedGood([]);
      this.addBeforeBillInfo={};
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
        line-height: 3;
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
    text-align: center;
    line-height: 50px;
  }
</style>
