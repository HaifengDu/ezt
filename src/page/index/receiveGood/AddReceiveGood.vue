<!--收货新增页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='添加采购入库单' @goBack="goBack" :isInfoGoback="true">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main">
      <div class="ezt-add-content">
         <ul class="ezt-title-search">
          <li class="select-list">
            <span class="title-search-name is-required">单据类型：</span>
            <span class="title-select-name item-select">
              <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.billType" 
                @change="handlerBillType('billType','您已维护物料信息，如调整单据类型，须重新选择物料。')" :class="[{'selectError':billFiles[0].billType}]">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
          <li class="select-list">
            <span class="title-search-name is-required">供应商：</span>
            <span class="title-select-name item-select">
              <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.supplier"
              @change="handlerBillType('supplier','您已维护物料信息，如调整供应商，须重新选择物料。')" :class="[{'selectError':billFiles[1].supplier}]">
                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
              </select>
            </span>
          </li>
          <li class="select-list">
            <span class="title-search-name is-required">仓库：</span>
            <span class="title-select-name item-select">
              <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.warehouse"
              @change="handlerBillType('warehouse','您已维护物料信息，如调整仓库，须重新选择物料。')" :class="[{'selectError':billFiles[2].warehouse}]">
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
            <span class="title-search-name is-required">选择物料：</span>
            <span class="title-search-right" @click="renderUrl('/publicAddGood')">
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
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
declare var mobiscroll:any;
@Component({
   components:{
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
        'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
        'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',
     })
   },
   methods:{
    ...mapActions({
      'setSelectedGood':'publicAddGood/setSelectedGood',
    })    
   }
})
export default class ReceiveGood extends Vue{
  private cache = CachePocily.getInstance();
  private service: ReceiveGoodService;
  // private getGoodList:INoopPromise //调用store中的请求接口
  private hideMask:()=>void;
  private showMask:()=>void;
  // private updateUser:INoop;
  private selectedGood:any[];//store中selectedGood的值
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
  private addBillInfo:any={
    billType:"",
    supplier:"",
    warehouse:"",
    remark: "",
    editPrice:false//添加物料时 区分价格是否可以编辑
  };//store中
  private orderType:any[] = [{//单据类型下拉数据    
    name:"合同采购单",
    type:"q"
  },{
    name:"采购单",
    type:"m"
  }];
  /**
   * 枚举 表单字段
   */
  private billFiles=[
    {id:"billType",msg:"请选择单据类型！",billType:false},
    {id:"supplier",msg:"请选择供应商！",supplier:false},
    {id:"warehouse",msg:"请选择仓库！",warehouse:false}];
  created() {  
      this.service = ReceiveGoodService.getInstance();
    if(this.cache.getData(CACHE_KEY.RECEIVE_ADDINFO)){
        this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDINFO));
    }
    this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
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
      // 组件除show外的属性
      onCancel () {
        let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
          return item.id == info.id;
        })
        _this.selectedGood[newIndex].active = false;
      },
      onConfirm () {
        let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
          return item.id == info.id;
        })
        _this.selectedGood.splice(newIndex,1);
      },
      content:'请确认是否删除该物料。'
    })
  }
  /**
   * 收货 提交
   */
  private saveReceive(){
    for(let i=0;i<this.billFiles.length;i++){
      let item = this.billFiles[i];
      if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
        this.$toasted.show(item.msg);
        item[item.id]=true;
        return false;
      }
    }
    //过滤掉物料中数量为0的物品；
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
  /**
   * 收货 提交并审核
   */
  private confirmReceive(){
    let _this = this;
     for(let i=0;i<this.billFiles.length;i++){
      let item = this.billFiles[i];
      if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
        this.$toasted.show(item.msg);
        item[item.id]=true;
        return false;
      }
    }
    //过滤掉物料中数量为0的物品；
    this.setSelectedGood(this.selectedGood.filter(checkItem => (checkItem.num&&checkItem.num!=0)));
    if(!this.selectedGood||this.selectedGood.length<=0){
      this.$toasted.show("请添加物料！");
      return false;
    }
    this.$vux.confirm.show({
      // 组件除show外的属性
      onCancel () {//审核不通过
        _this.addBillInfo={},
        _this.setSelectedGood([]);
        _this.addBeforeBillInfo={};
        _this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}}); 
      },
      onConfirm () {//审核通过
        _this.addBillInfo={},
        _this.setSelectedGood([]);
        _this.addBeforeBillInfo={};
        _this.$toasted.success("审核成功！");
        _this.$router.push({name:'ReceiveGood',params:{'purStatus':'已完成'}}); 
      },
      content:'确认审核该单据？',
      confirmText:"审核通过",
      cancelText:"审核不通过",
      hideOnBlur:true
    })
  }    
    //选择物料
  private renderUrl(info:string){
    let goodTerm = {};
    if(this.addBillInfo){
      let _this = this;
      for(let i=0;i<this.billFiles.length;i++){
        let item = this.billFiles[i];
        if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
          this.$toasted.show(item.msg);
          item[item.id]=true;
          return false;
        }
      }
      goodTerm={
        billsPageType: 'receiveGood',
      }  
      this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));
      this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.addBillInfo));
      this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
      this.$router.push(info);
      // this.$router.push({name:'PublicAddGood',params:{'receiveOrderType':this.addBillInfo.billType}});
    }      
  }
  private checkEmpty(errorMsg:any){
    
    
  }
  /**
   * 选择单据类型，供应商，仓库
   */
  private handlerBillType(val:any,title:any){
    let _this = this;
    if(this.selectedGood.length>0){
       this.$vux.confirm.show({
        // 组件除show外的属性
        onCancel () {
          _this.addBillInfo[val] = _this.addBeforeBillInfo[val];
        },
        onConfirm () {
          _this.setSelectedGood([]);
          _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
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
    }
  }
  /**
   * 返回
   */
  private goBack(){
    let _this = this;
    if((this.addBillInfo&&this.addBillInfo.billType)||this.selectedGood.length>0){
      this.$vux.confirm.show({
        // 组件除show外的属性
        onCancel () {
          console.log(this) // 非当前 vm
        },
        onConfirm () {
          _this.addBillInfo={},
          _this.setSelectedGood([]);
          _this.addBeforeBillInfo={};
          _this.$router.push('/receiveGood');
        },
        content:"返回后，本次操作记录将丢失，请确认是否离开？"
      })
    }else{
      this.$router.push('/receiveGood');
    }
  } 
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
      // background: pink;
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 22px;
    }
</style>
