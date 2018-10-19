<template>
    <div class="ezt-page-con">
        <ezt-header title="审核初始化单" :back="true" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li>
                        <span class="title-search-name">单号：</span>
                        <span>{{addBillInfo.bill_no}}</span>
                    </li>
                    <li>
                        <span class="title-search-name">仓库：</span>
                        <span>{{addBillInfo.warehouse}}</span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">库存初始日：</span>
                        <span class="">                        
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">成本录入方式</span>
                        <span class="costType-info">                            
                            <!-- <button-tab v-model="addInitStockInfo.costType" @click.native="handlerChangeType(addInitStockInfo.costType)">
                                <button-tab-item selected>含税单价</button-tab-item>
                                <button-tab-item>含税金额</button-tab-item>
                            </button-tab> -->
                            <div class="auditDisabled">
                                <span :class="[{active:addBillInfo.costType==0}]">含税单价</span>
                                <span :class="[{active:addBillInfo.costType==1}]">含税金额</span>
                            </div>
                        </span>
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
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good" v-swipeleft="handlerSwipe.bind(this,item,true)" 
                v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（规格）</span>
                                    </span>
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
                                    <span class="title-search-name">税率：</span>
                                    <span class="receive-dc-content">{{item.rate||0}}%</span>
                                </div>
                                <div class="park-input"> 
                                    <span class="title-search-name">供应商：</span>
                                    <span class="receive-dc-content">{{item.supplier||'无'}}</span>
                                </div>                    
                            </div>
                        </div>
                         <div class="ezt-detail-del" @click="delAction(item)">删除</div>                                               
                    </li>
                </ul> 
                 
            </div>
        </div>
        <ezt-footer>
            <div class="ezt-foot-temporary" slot="confirm">
            <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                <b>品项</b><span>{{this.selectedGood.length}}</span>，
                <b>数量</b><span>{{Total.num}}</span>，
                <b>含税金额￥</b><span>{{Total.Amt.toFixed(2)}}</span>
            </div>
            <div class="ezt-foot-button">
                <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive">提交</a>  
                <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive">提交并审核</a>   
            </div>  
            </div>
        </ezt-footer> 
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
import {mapActions,mapGetters} from 'vuex';
import { INoop, INoopPromise } from "../../../helper/methods";
import { InitStockService } from "../../../service/InitStockService";
import { CachePocily } from "../../../common/Cache";
import ObjectHelper from '../../../common/objectHelper'
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
 computed: {
    ...mapGetters({
      selectedGood: "publicAddGood/selectedGood", //选择物料的物品
    })
  },
  methods: {
    ...mapActions({
      setSelectedGood: "publicAddGood/setSelectedGood"
    })
  }
})
export default class InitStock extends Vue{
    private cache = CachePocily.getInstance();
    private service: InitStockService;
    private addBillInfo: any={}; //store中
    private addBeforeBillInfo: any={};
    private setSelectedGood: INoopPromise;
    private selectedGood: any[]; //store中selectedGood的值
    private orderType: any[] = [
        {
            //单据类型下拉数据
            name: "合同采购单",
            type: "q"
        },
        {
            name: "采购单",
            type: "m"
        }
    ];

   created() {
        this.service = InitStockService.getInstance();
        this.addBillInfo.editPrice = true;
        (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
    }
    mounted(){        
        if(this.cache.getData(CACHE_KEY.RECEIVE_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_ADDINFO));
            this.addBillInfo.goodList = [{
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
                }]
        }
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        if(this.selectedGood.length==0&&this.addBillInfo.goodList){
            this.setSelectedGood(this.addBillInfo.goodList); 
        }
        (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
    }
    /**
     * 切换成本录入方式
     */
    private handlerChangeType(item:any){

    }
    /**
   * 
   * 物料总数量\总金额
   */
    private get Total(){
      return this.selectedGood.reduce((ori,item)=>{
       ori.num = ori.num+Number(item.num); 
        if(item.price){
            ori.Amt = ori.Amt + (item.num * item.price);
        }else{
            ori.Amt = ori.Amt + (item.amt);
        }      
     
      return ori;
      },{num:0,Amt:0});
    }
    //选择物料
    private renderUrl(info: string) {
        this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push({
            name:"PublicAddGood",
            params:{
                editPrice:"initStock",
                costType:this.addBillInfo.costType}
        })
    }
    /**
     * 左侧滑动
     *  */
    private handlerSwipe(item:any,active:boolean){     
      item.active = active;
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
     * 页面列表审核
     */
    private confirmReceive() {
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        } 
        let _this = this;
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
                _this.setSelectedGood([]);
                _this.$router.push({name:'InitStock',params:{'purStatus':'已完成'}});   
            },
            onConfirm () {
                _this.setSelectedGood([]);
                _this.$toasted.success("审核成功！");
                _this.$router.push("/initStock");
            },
            content:'确认审核该单据？',
            confirmText:"审核通过",
            cancelText:"审核不通过",
            hideOnBlur:true
        }) 
    }
    /**
     * 页面保存
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
        this.$router.push("/initStock");
    }
   /**
     * 返回
     */
    private goBack() {
        let _this = this;
        if((this.addBillInfo&&this.addBillInfo.warehouse)||this.selectedGood.length>0){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                },
                onConfirm () {
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$router.push('/initStock');
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
        }else{
            this.addBillInfo={},
            this.setSelectedGood([]);
            this.addBeforeBillInfo={};
            this.$router.push('/initStock');
        }
    }
}
</script>
<style lang="less" scoped>
.auditDisabled{
    border: 1px solid #1188FC;
    span{
        color: #000;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        background: #fdfdfd;
        padding: 2px 6px;
    }
    span.active{
        background:#1188FC;
        color: #FFF;
        line-height: 30px;
        display: inline-block;
    }
}
//按钮
.mine-bot-btn {
  width: 100%;
  // position: absolute;
  margin-top: 20px;
  .ezt-lone-btn {
    display: inline-block;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 8px 90px;
    margin-bottom: 10px;
    border-radius: 40px;
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#5a12cc),
      to(#3c82fb)
    );
    background-image: linear-gradient(90deg, #018bff 0%, #4a39f3 100%);
    -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
    box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
  }
}
//编辑物品 修改的字段
.dialog-demo {
  .ezt-dialog-header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
  .edit-good-list {
    flex-direction: column;
    text-align: center;
    display: inline-block;
    li {
      display: flex;
      // flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #ccc;
      .title-dialog-name {
        flex: inherit;
        padding: 10px 0px;
        font-size: 13px;
        color: #5f7b9a;
      }
      .weui-cell:before {
        border: none;
      }
      select {
        height: 36px;
      }
      .icon-input::before {
        display: inline-block;
        content: "%";
        position: absolute;
        right: 40px;
      }
      .icon-input.price::before {
        content: "￥";
      }
    }
  }
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
    flex:1;
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
.costType-info a.active {
  color: #1674fc;
}
.vux-button-group a{
    height: inherit;
    padding: 2px 6px;
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
    text-align: center;
    line-height: 50px;
  }
</style>


