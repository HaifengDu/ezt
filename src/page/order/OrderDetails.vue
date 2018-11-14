<!--订货单详情-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" :title="paytitle" @goBack="goBack" :isInfoGoback="true">
       <div slot="action">
       </div>    
    </ezt-header>    
    <div class="ezt-main" :class="{'no-pament':!isPayMent||InterfaceSysTypeBOH}"> 
        <div class="ezt-backcolor"></div>
         <div class="ezt-detail-cot">
            <!-- 单据信息 -->
            <div class="receive-dc-list detail-order-info">
                <div class="receive-icon-title">
                    <span class="receive-icon-dcName"></span>
                    <span class="return-list-title">item.dc_name</span> 
                    <span class="receive-status">{{isPayMent?"待支付":"已完成"}}</span>
                </div>
                <div class="receive-icon-content">
                     <div style="display:flex">
                        <span class="receive-dc-title">单号：<span class="receive-dc-content">asd123123</span></span>
                        <span class="receive-dc-title" v-if="Payment">已付：<span class="receive-dc-content">1212222</span></span>
                    </div>
                    <div style="display:flex">
                        <span class="receive-dc-title">要货日期：<span class="receive-dc-content">2018-09-12</span></span>
                        <span class="receive-dc-title">到货日期：<span class="receive-dc-content">2018-09-12</span></span>
                    </div>
                    <div style="display:flex;padding-bottom:20px;">
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">不要啦就是你的济南市快递那福克斯地方</span></span>
                    </div>
                    <div class="receive-ys" v-if="!isPayMent">已收</div>
                </div>
            </div>
            <div class="detail-acount-title">
               物料明细
            </div>      
            <ul>
                <li class="good-detail-content" v-for="(item,index) in details" :key="index">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">{{item.dc_name}}</span>
                                <span class="good-detail-sort" v-if="materialSetting.show_order_price||isPayMent">￥{{item.material_size}}</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：{{item.bill_no}}</span>
                            </div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class="good-detail-item" v-if="item.remark">
                        <div class="good-detail-sort content">备注：
                            <div v-fixHeight="item" class="remark-suitable" :class="{'auto':item.flod}">{{item.remark}}</div>
                            <span @click='handleFold(item)' v-if="item.show">{{item.flod?"收起":"展开"}}</span>
                        </div>
                    </div>
                </li>
            </ul>             
        </div>  
    </div>
    <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
            <div class="ezt-foot-total">合计：
                <b>品项</b><span>{{details.length}}</span>，
                <b>数量</b><span>{{Total.num}}</span>，
                <b v-if="materialSetting.show_order_price||isPayMent">含税金额￥</b><span v-if="materialSetting.show_order_price||isPayMent">{{Total.Amt.toFixed(2)}}</span>
            </div>
            <div class="ezt-foot-button" v-if="isPayMent&&!InterfaceSysTypeBOH">
                <a href="javascript:(0)" class="ezt-foot-sub" @click="payMethod=true">支付</a>  
            </div>  
        </div>
    </ezt-footer> 
    <!--支付 选择方式-->
    <div>
        <x-dialog v-model="payMethod" class="dialog-demo">
            <div class="ezt-dialog-header ezt-titleColor1 ezt-fontSize3">
                <span class="header-name">
                    请选择支付方式
                </span>
                <span class="ezt-close" @click="closePayment">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </span>
            </div>
            <div class="warehouse-list">
                <ul class="warehouse-isDefault">
                    <li>
                        <label>
                            <span class="opt-text">
                                <span class="zfb-icon"></span>支付宝
                            </span>
                            <input type="radio" name="pay" value="1" v-model="payValue"/>
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                    </li>
                    <li>
                        <label>
                            <span class="opt-text">
                                <span class="wx-icon"></span>微信支付
                            </span>
                            <input type="radio" name="pay" value="2" v-model="payValue"/>
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                    </li>
                    <li>
                        <label>
                            <span class="opt-text balance">余额支付</span>
                            <input type="radio" name="pay" value="3" v-model="payValue"/>
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                    </li>                    
                </ul>
            </div> 
            <div class="mine-bot-btn">
                <span class="ezt-lone-btn" @click="confirmPay">确认支付</span>
            </div>           
        </x-dialog>
    </div> 
  </div>
</template>
<script lang="ts">   
import Vue from 'vue'
import ErrorMsg from "./model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import {LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../helper/methods';
import { OrderGoodsService} from '../../service/OrderGoodsService';
import { strictEqual } from 'assert';
declare var mobiscroll:any;
@Component({
   components:{

   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
        InterfaceSysTypeBOH:"InterfaceSysTypeBOH",
        materialSetting : 'materialSetting',//物流设置
     })
    
   },
   methods:{
     ...mapActions({
     })
   }
})
export default class OrderGoods extends Vue{
    private InterfaceSysTypeBOH:boolean;
    private service: OrderGoodsService;
    private details:any[] = [];  //物料明细
    private isPayMent:boolean=false; //是否有支付按钮
    private paytitle:string="";
    private Payment:boolean = false;  //订单支付页面显示已付
    private fold :boolean = true;  //备注超出显示查看更多
    private innerContent:string='';
    /**
     * 支付选择方式
     */
    private payMethod:boolean = false;
    private materialSetting: object;
    /**
     * 支付类型
     */
    private payList:any[]=[
        {
            value:'支付宝',
            key:'1'},
        {
            value:'微信支付',
            key:'2'},
        {
            value:'余额支付',
            key:'3'}];
    private payValue:any = 1;
    created() {          
       this.service = OrderGoodsService.getInstance();
    }
    
    mounted(){ 
        this.detailList();
        this.getData();   
        if(this.$route.params.isPayMent=='false'){
            this.isPayMent = false;
            this.paytitle = "订货单详情";
        }else if(this.$route.params.isPayMent=='true'){
            this.isPayMent = true;
            this.paytitle = "订单支付"
            this.Payment = true
        }
        
    }
    private closePayment(){
        this.payMethod = false;
        let _this = this;
        this.$vux.confirm.show({
            onCancel(){
                _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}})
            },
            onConfirm(){
                _this.payMethod=true;
            },
            content:"取消后，可在待支付列表中重新付款。",
            confirmText:"继续付款",
            onCancelText:"取消付款",
            title:"取消付款"
        })
    }
    /**
     * 确认支付
     */
    private confirmPay(){
        console.log(this.payValue,'998')
        this.$router.push('/orderPaySuccess');
    }
    // 备注出现查看更多
    private handleFold(item:any) {
        this.$set(item,'flod',!item.flod);
    }
    private getData() {
        this.innerContent = this.innerContent
    }
    /**
     * computed demo
     * 物料总数量、总金额
     */
    private get Total(){
        return this.details.reduce((ori,item)=>{
        ori.num = ori.num+Number(item.num); 
            if(item.price){
                ori.Amt = ori.Amt + (item.num * item.price);
            }else if(item.Amt){
                ori.Amt = ori.Amt + (item.amt);
            }else{
                ori.num = 0;
                ori.Amt = 0;
            }      
        
        return ori;
        },{num:0,Amt:0});
    }
    // 物料明细
    private detailList(){
     this.service.getGoodDetail().then(res=>{
          this.details=res.data.data;
        },err=>{
          this.$toasted.show(err.message);
      });
    }
    /**
     * 返回
     */
    private goBack(){
        this.$router.push('/orderGood')
    }
}
</script>
<style lang="less" scoped>    
    .ezt-dialog-header{
        padding: 8px 0px;
        background: #F1F6FF;
        border-radius: 4px 4px 0 0;
        display:flex;
        text-align: left;
        .header-name{
            padding-left: 12px;
            flex: 1;
        }
        .ezt-close{
            margin-right: 14px;
            color: #aebaca;
            font-size: 16px;
        }
    }
    .warehouse-list{
        text-align: left;
    }
    .warehouse-isDefault{
        li{
            padding: 0px 12px;
            border-bottom:1px solid #f5f5f5;
        }
        label {                 /*设置label的样式*/
            width: 100%;
            padding: 10px 0px;
            display: block;
            line-height: 20px;
            position: relative;
            font-weight: normal;
        }
        .option {      /*把优化后的按钮图片设置为该div的背景图片，把该div定位到原生样式的上方，遮盖住原生样式。*/
            width: 22px;
            height: 22px;
            position: absolute;
            top: 10px;
            right: 0px;
            background-size: cover;
            background: url(../../assets/images/btn_ck_n_checked.png) no-repeat;
            background-size: cover;
        }
        input[type="radio"] {  /*为了保险起见，把原生样式隐藏掉*/
            display: inline-block ;
            margin-right: 15px ;
            opacity: 0 ;
        }
        input[type="radio"]:checked+div {  /*当radiuo被选中时，把input下边的div标签的背景图片替换掉*/
            background: url(../../assets/images/btn_ck_checked.png) no-repeat;
            background-size: cover;
        }
    }
    .ezt-lone-btn{
        padding: 5px 50px;
        margin: 5px;
        display: inline-block;
        background-image: linear-gradient(90deg, #46A3FF 0%, #4B8BFF 100%);
        border-radius: 24px;
        color: #fff;
    }
    .receive-icon-content{
         position: relative;
     }
    .ezt-backcolor{
        position: relative;
        height: 136px;
        background-image: linear-gradient(135deg, #018BFF -9%, #4A39F3 79%);
        margin-top: -1px;
    }
    .ezt-detail-cot{
        position: absolute;
        top:0;
        width: 100%;
    }
    .ezt-main{
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 68px;
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
    }
    .good-detail-l>div>span{
       flex:1;
    }
    .good-detail-r{
        display: inline-block;
        text-align: right;
        flex: .2;
        border-left: 1px dotted #C0CFE0;
    }
    .good-detail-num{
        display: inline-block;
        width: 100%;
        height:40px;
        text-align: center;
        font-size: 20px;
        color: #FF885E;
        letter-spacing: 0;
        line-height: 40px;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
    }
    /* .good-detail-item{
        border-bottom: 1px solid #E0EBF9;
        padding-bottom: 10px;
    } */
    .good-detail-item .content{       
        word-break: break-all;    
        word-wrap:break-word;
    } 
    .good-detail-item .remark-suitable{
        line-height: 25px;
        // height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-bottom: 10px;
    }
    .good-detail-item .remark-suitable.auto{
        height: auto;
        -webkit-line-clamp: initial;
    }
    .good-detail-billno,.good-num-t{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
    }   
    .good-num-t{
        display: inline-block;
        text-align: center;
        width: 100%;
    }
    .ezt-detail-good{
        display: flex;
        border-bottom: 1px solid #E0EBF9;
        padding-bottom: 10px;
        height:40px;
    }
    .receive-status{
        color:#4A39F3;
    }
    .total{
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #F1F6FF;
        span{
            color: red;
        }
    }
    .no-pament{
        margin-bottom: 24px;
    } 
    .zfb-icon,.wx-icon{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
    }
    .zfb-icon{
        background: url(../../assets/images/zfb-icon.png) no-repeat;
        background-size: 18px 18px;
    }
    .wx-icon{
        background: url(../../assets/images/wx-icon.jpg) no-repeat;
        background-size: 19px 19px;
    }
    .opt-text.balance{
        padding-left: 26px;
    }
</style>
