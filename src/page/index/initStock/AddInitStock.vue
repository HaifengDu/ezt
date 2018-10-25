<!--添加初始化单-->
<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="添加初始化单" @goBack="goBack" :isInfoGoback="true">

        </ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name is-required">库存初始日：</span>
                        <span >
                           {{addBillInfo.date}}
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">仓库：</span>
                        <span class="title-select-name item-select">
                        <select placeholder="请选择" class="ezt-select" v-model="addBillInfo.warehouse"
                        @change="handleWarehouse('warehouse')"
                        >
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">成本录入方式</span>
                        <div class="auditDisabled" v-if="selectedGood.length>0">
                            <span :class="[{active:addBillInfo.costType==0}]">含税单价</span>
                            <span :class="[{active:addBillInfo.costType==1}]">含税金额</span>
                        </div>
                        <span class="costType-info" v-else>                            
                            <button-tab v-model="addBillInfo.costType" @click.native="handlerChangeType(addBillInfo.costType)">
                                <button-tab-item selected>含税单价</button-tab-item>
                                <button-tab-item>含税金额</button-tab-item>
                            </button-tab>
                        </span>
                        
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
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good" v-swipeleft="handlerSwipe.bind(this,item,true)" 
            v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
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
                                    <span class="good-detail-sort" v-if="addBillInfo.costType==0">￥{{item.price}}/{{item.utilname}}</span>
                                    <span class="good-detail-sort" v-if="addBillInfo.costType==1">￥{{item.amt}}/{{item.utilname}}</span>
                                    
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
                        <b>含税金额￥</b><span>{{(Total.Amt).toFixed(2)}}</span>
                    </div>
                    <div class="ezt-foot-button">
                        <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive">提交</a>  
                        <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive">审核</a>   
                    </div>  
                </div>
            </ezt-footer>           
        </div>        
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Component, Watch } from "vue-property-decorator";
import { INoop, INoopPromise } from "../../../helper/methods";
import { InitStockService } from "../../../service/InitStockService";
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey';
import {EGoodType} from '../../../enum/EGoodType';
@Component({
  computed: {
    ...mapGetters({
      selectedGood: "publicAddGood/selectedGood", //选择物料的物品
      isFirstStore:'initStock/isFirstStore'
    })
  },
  methods: {
    ...mapActions({
      setSelectedGood: "publicAddGood/setSelectedGood",
    })
  }
})
export default class InitStock extends Vue {
    private cache = CachePocily.getInstance();
    private service: InitStockService;
    private addBillInfo: any={
        // date:new Date().format("yyyy-MM-dd"),
    }; //store中
    private addBeforeBillInfo: any={
        // date:new Date().format("yyyy-MM-dd"),
    };
    private setSelectedGood: INoopPromise;
    private selectedGood: any[]; //store中selectedGood的值
    private isFirstStore:boolean;
    private EGoodType = EGoodType;//区分是税额还是价格
    private orderType: any[] = [
        {
            //单据类型下拉数据
            name: "合同采购单",
            type: "q"
        },{
            name:"采购单",
            type:"m"
        }
    ];
    /**
     * 枚举 表单字段
     */
    private billFiles=[
        {id:"date",msg:"请选择库存初始化日",date:false},
        {id:"costType",msg:"请选择成本录入方式",costType:false},
        {id:"warehouse",msg:"请选择仓库！",warehouse:false}];

    mounted(){
        if(this.cache.getData(CACHE_KEY.INITSTOCK_SETTING)){
            this.addBillInfo.date = JSON.parse(this.cache.getData(CACHE_KEY.INITSTOCK_SETTING)).initStockDate;
            this.addBeforeBillInfo.date = JSON.parse(this.cache.getData(CACHE_KEY.INITSTOCK_SETTING)).initStockDate;
        }
    }
    created() {
        this.service = InitStockService.getInstance();
        this.addBillInfo.warehouse = this.orderType[0].type;
        this.addBeforeBillInfo.warehouse = this.orderType[0].type;
        (this.selectedGood||[]).forEach(item=>item.active = false);
        if(this.cache.getData(CACHE_KEY.INITSTOCK_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INITSTOCK_ADDINFO));
        }
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
    }
    //选择物料
    private renderUrl(info: string) {
        let _this = this;
        let goodTerm = {};
        for(let i=0;i<this.billFiles.length;i++){
        let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                if(this.addBillInfo[item.id]!=0){
                    this.$toasted.show(item.msg);
                    item[item.id]=true;
                    return false;
                }
            
            }
        }
        goodTerm={
            billsPageType: 'initStock',
            costType: this.addBillInfo.costType
        }     
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.INITSTOCK_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.INITSTOCK_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push(info);
        // this.$router.push({
        //     name:"PublicAddGood",
        //     params:{
        //         GoodPriceOrAmt:this.addBillInfo.GoodPriceOrAmt}
        // })
    }

        /**
         * 左侧滑动删除
         */
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
   * 切换仓库 校验
   */
    private handleWarehouse(val:any){
        let _this = this;
        if(this.selectedGood.length>0){
            // this.isWarehouse=true;
             this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                    _this.addBillInfo[val] = _this.addBeforeBillInfo[val];
                },
                onConfirm () {
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
                },
                content:"您已选择物料，如调整仓库，须重新选择物料。"
            })
        }else{
            this.addBeforeBillInfo.warehouse=this.addBillInfo.warehouse;            
        }
    }
    /**
   * 
   * 物料总数量\总金额
   */
    private get Total(){
      return this.selectedGood.reduce((ori,item)=>{
       ori.num = ori.num+Number(item.num); 
        if(this.addBillInfo.costType==0){
            ori.Amt = ori.Amt + (Number(item.num) * item.price);
        }else{
            ori.Amt = ori.Amt + Number(item.amt);
        }
      return ori;
      },{num:0,Amt:0});
    }
    /**
     * 页面列表审核
     */
    private confirmReceive() {
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }        
        // if(this.orderType.length==1){
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
        // }else{
        //     this.$router.push({name:'InitStock',params:{'purStatus':'已完成'}});     
        // }
         
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
     * 切换成本录入方式
     */
    private handlerChangeType(item:any){

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
                console.log(this) // 非当前 vm
                },
                onConfirm () {
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    if(_this.isFirstStore){
                        _this.$router.push("/initSet");
                    }else{
                        _this.$router.push("/initStock");
                    }
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
        }else{
            if(this.isFirstStore){
                this.$router.push("/initSet");
            }else{
                this.$router.push("/initStock");
            }
        }
    }
}
</script>
<style lang="less" scoped>
.auditDisabled{
    border: 1px solid #ccc;
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
        background:#ccc;
        color: #FFF;
        line-height: 30px;
        display: inline-block;
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
    // background: pink;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 22px;
}
</style>

