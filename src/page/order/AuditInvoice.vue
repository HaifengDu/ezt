<!--审核要货单-->
<template>   
    <div class="ezt-page-con AuditInvoice">
        <ezt-header v-if="this.type == 'examine'" title="审核要货单" :back="true" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <ezt-header v-if="this.type == 'add'" title="添加要货单" :back="true" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li v-if="this.type == 'examine'">
                        <span class="title-search-name">单号：</span>     
                        <input type="text" class="ezt-middle" disabled v-model="addBillInfo.billno">
                    </li>
                    <li>    
                        <span class="title-search-name is-required">来货单位：</span>
                        <input type="text" class="ezt-middle" disabled v-model="addBillInfo.unit">
                    </li>
                    <li v-if="this.type == 'examine'">     
                        <span class="title-search-name">要货日期：</span>
                        <input type="text" class="ezt-middle" disabled v-model="addBillInfo.orderDate" :max="addBillInfo.arriveDate" ref="startDate">
                    </li>
                    <li v-if="this.type == 'add'">
                        <span class="title-search-name is-required">要货日期：</span>
                        <span>
                            <ezt-canlendar ref="startDate" v-model="addBillInfo.orderDate" :max="addBillInfo.arriveDate" :defaultValue="addBillInfo.orderDate" placeholder="要货日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar">
                           </ezt-canlendar>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">到货日期：</span>
                        <span>
                            <ezt-canlendar ref="endDate" v-model="addBillInfo.arriveDate" :min="addBillInfo.orderDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')" placeholder="到货日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar">
                           </ezt-canlendar>
                        </span>
                    </li>
                    <li>
                        <x-input title="备注：" v-model="addBillInfo.remark"></x-input>
                    </li>
                    <li>
                        <span class="title-search-name is-required">物料明细</span>
                        <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </li>
                </ul>
                <!-- 选择的物料明细 -->
                 <ul>
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good" v-swipeleft="handlerSwipe.bind(this,item,true)" 
                        v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（规格）</span>
                                    </span>
                                </div>
                                <div>
                                    <span class="good-detail-billno">编码：003222</span>
                                    <span class="good-detail-sort" v-if="materialSetting.show_order_price">￥{{item.price}}/{{item.utilname}}
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
                        <div class="ezt-detail-del" @click="deleteBill(item)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </div>
                    </li>
                </ul>   
            </div>
        </div>
        <ezt-footer>
            <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                    <b>品项</b><span>{{this.selectedGood.length}}</span>，
                    <b>数量</b><span>{{Total.num}}</span>，
                    <b v-if="materialSetting.show_order_price">￥</b><span v-if="materialSetting.show_order_price">{{Total.Amt.toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive"> 提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
                </div>  
            </div>
        </ezt-footer>
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
import ObjectHelper from '../../common/objectHelper'
@Component({
    computed:{
        ...mapGetters({    
            'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
            'InterfaceSysTypeBOH':'InterfaceSysTypeBOH', //BOH接口
            'systemParamSetting':"systemParamSetting",//系统设置参数   
            materialSetting : 'materialSetting',//物流参数设置
        })
    },
    methods:{
        ...mapActions({
            'setSelectedGood':'publicAddGood/setSelectedGood',
        })
    }
})  
export default class Order extends Vue{
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();
    private service: OrderGoodsService;
    private selectedGood:any[];//store中selectedGood的值
    private setSelectedGood:INoopPromise//store中给selectedGood赋值
    private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
    private addBillInfo:any={
        orderDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
        arriveDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd'),
    };
    private type:string;    
    private systemParamSetting:any;
    private materialSetting:any;
    created() {          
        this.service = OrderGoodsService.getInstance();
        (this.selectedGood||[]).forEach(item=>item.active = false);
        if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDINFO));
        }    
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        this.type = this.$route.query.type
    }
    // 点击删除按钮
    private deleteBill(item:any){
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
        content:'请确认是否删除该物料?'
        })
    }
    /**
     * 要货到货日期限制
     */
     private selectDateChange(val:any){
      (<any>this.$refs.startDate).setMax(new Date(val));
      (<any>this.$refs.endDate).setMin(new Date(val));
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
    private handlerSwipe(item:any,active:boolean){     
        item.active = active;
    }
    //选择物料
    private renderUrl(info: string) {   
        let goodTerm = {};
        goodTerm={
            billsPageType: 'orderGood',
            showPrice: !this.materialSetting.show_order_price
        }  
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
        // this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        // this.setAddBillInfo(this.addBillInfo); //将选择的单据信息保存在store中
        this.$router.push(info);
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
    /**
     * 提交并审核
     */
    private confirmReceive(){
        let _this = this;
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
         this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {//审核不通过
                _this.setSelectedGood([]);
                _this.$toasted.success("审核成功！");
                _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}}); 
            },
            onConfirm () {//审核通过
                _this.setSelectedGood([]);
                _this.$toasted.success("审核成功！");
                if(!_this.InterfaceSysTypeBOH){//SAAS才有待支付
                    _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}}); 
                }else{
                    _this.$router.push({name:'OrderGood',params:{'purStatus':'已完成'}}); 
                }
                
            },
            content:'确认审核该单据？',
            confirmText:"审核通过",
            cancelText:"审核不通过",
            showCancelButton:!_this.InterfaceSysTypeBOH,
            hideOnBlur:true
        })
    }

    /**
     * 提交
     */
    private saveReceive(){
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        } 
        this.addBillInfo={};
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$toasted.success("保存成功！");
        this.$router.push('/orderGood');
    }
    /**
     * 返回
     */
    private goBack(){
        let _this = this;
        if((this.addBillInfo&&this.addBillInfo.arriveDate||this.addBillInfo.remark)||this.selectedGood.length>0){
             this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                console.log(this) // 非当前 vm
                },
                onConfirm () {
                    _this.setSelectedGood([]);
                    _this.$router.push('/orderGood')
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
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
.ezt-middle{
    text-align: right;
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
// 左侧滑动删除
.swipe-transform{
    transform: translateX(-50px);
}
.ezt-detail-del{
    position: absolute;
    right: -9px;
    top: 0;
    width: 50px;
    height: 113px;
    text-align: center;
    line-height: 125px;
    font-size: 25px;
    display: flex;
    align-items: center;
}
.orderType-list span.active{
    background: #1674fc;
}

</style>


