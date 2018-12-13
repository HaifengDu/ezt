<!--收货单详情页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="收货单详情"></ezt-header>    
    <div class="ezt-main"> 
        <div class="ezt-backcolor"></div>
        <div class="ezt-detail-cot">
            <!-- 单据信息 --> 
            <div class="receive-dc-list detail-order-info">
                <div class="receive-icon-title">
                    <span class="receive-icon-dcName"></span>
                    <span class="return-list-title">{{detailList.dc_name||detailList.outOrganName}}</span> 
                    <span class="receive-status">已完成</span>
                </div>
                <div class="receive-icon-content" v-if="!InterfaceSysTypeBOH">
                    <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{detailList.bill_no}}</span></span>
                    <div style="display:flex">
                        <span class="receive-dc-title">含税金额：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">税率：<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>
                    <div style="display:flex" v-if="!InterfaceSysTypeBOH">
                        <span class="receive-dc-title">未税金额：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">到货日期<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>
                    <div style="display:flex" v-if="!InterfaceSysTypeBOH">
                        <span class="receive-dc-title">仓库：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>              
                </div>
                <div class="receive-icon-content" v-if="InterfaceSysTypeBOH">
                    <span class="receive-dc-title">单据号：<span class="receive-dc-content">{{detailList.billNo}}</span></span>                    
                    <span class="receive-dc-title">到货日期：<span class="receive-dc-content">{{new Date (detailList.busiDate||new Date()).format("yyyy-MM-dd")}}</span></span>
                    <span class="receive-dc-title">金额：<span class="receive-dc-content">{{detailList.totalAmt}}</span></span> 
                </div>
            </div>
            <div class="detail-acount-title">
            物品清单
            </div>  
            <div v-if="goodList.length==0" class="done-none">
                <span>暂无物品明细</span>
            </div> 
            <ul v-if="goodList.length!=0">
                <li class="good-detail-content" v-for="(item,index) in goodList" :key="index">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div class="title">
                                <span class="good-detail-name">{{item.name || item.goodsName}}
                                    <span class="good-detail-sort" v-if="!InterfaceSysTypeBOH">（{{item.sort}}）</span>
                                </span>
                                <span class="good-detail-sort" v-if="!InterfaceSysTypeBOH">￥{{item.price}}/{{item.unitName}}</span>
                                <span class="good-detail-sort">￥{{item.sendPrice}}/{{item.orderUnitName}}</span>
                            </div>
                            <div class="title">
                                <span class="good-detail-billno">编号：{{item.goodsCode}}</span>
                                <span class="good-detail-sort" v-if="!InterfaceSysTypeBOH">￥{{item.amt}}</span>
                            </div> 
                            <div class="title">
                                <span class="good-detail-billno">发货金额：{{item.sendAmt}}</span>
                            </div>                            
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">{{item.num || item.sendQty}}</span>
                        </div>
                    </div>
                    <div class="good-detail-item" v-if="item.remark && !InterfaceSysTypeBOH">
                        <div class="good-detail-sort content">备注：
                            <div v-fixHeight="item" class="remark-suitable" :class="{'auto':item.flod}">{{item.remark}}</div>
                            <span @click='handleFold(item)' v-if="item.show">{{item.flod?"收起":"展开"}}</span>
                        </div>
                    </div>
                    <div class='good-warehouse' v-if="!InterfaceSysTypeBOH">
                        <span class="hint-sign ezt-titleColor2">已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault ezt-titleColor3" :class="{'active':item.active}" >
                                <li v-for="(info,index) in item.directWarehouse" :key="index">
                                    <span>{{info.name}}</span>
                                    <span class="good-warehouse-num ezt-titleColor1">{{info.num}}</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare(item)">
                            <span class="icon-trun-on" :class="[{'off':item.active}]"></span>
                        </span>                        
                    </div>
                </li>
            </ul> 
        </div>  
    </div>
    <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
        <div class="ezt-foot-total">合计：
            <b>品项</b><span>{{goodList.length}}</span>，
            <b>数量</b><span>{{Total.num||Total.sendQty}}</span>，
            <b>含税金额￥</b><span>{{Total.Amt.toFixed(2)}}</span>
        </div> 
        </div>
    </ezt-footer>  
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
import { IReceiveGoodService } from '../../../interface/service/IReceiveGoodService';
import { FactoryService } from '../../../factory/FactoryService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey';
declare var mobiscroll:any;
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
      InterfaceSysTypeBOH:"InterfaceSysTypeBOH"
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
//这是调用的文件
export default class ReceiveGood extends Vue{
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();
    private service: IReceiveGoodService;
    private pager:Pager;
    private tabList:TabList = new TabList();
    private showOther: boolean=false;
    private goodList:any[]=[];//详情页物品信息
    private detailList:any={};//详情页信息
    private domEles: {};
    created() {     
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createReceiveGood(); 
    }
    mounted(){ 
        this.pager = new Pager().setLimit(7)
        if(this.cache.getData(CACHE_KEY.RECEIVE_DETAILLIST)){
            this.detailList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_DETAILLIST));
             let submitType = this.detailList.submitType 
            this.service.getGoodDetail(submitType,this.detailList.id,this.pager.getPage()).then(res=>{
                this.detailList = res.data.data;
                this.goodList = res.data.data.detailList;
            })           
        }
    }
    /**
     * 
     * 物料总数量、总金额
     */
    private get Total(){
        return this.goodList.reduce((ori,item)=>{
            if(item.sendPrice){
                //boh版的数量，金额
                ori.sendQty = ori.sendQty + Number(item.sendQty);
                if(item.sendPrice){
                    ori.Amt = ori.Amt + (item.sendQty * item.sendPrice);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.sendQty = 0;
                }
                return ori;
            }else{
                //saas版的数量，金额
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
           
        },{num:0,Amt:0,sendPrice:0,sendQty:0});
    }
    // 备注出现查看更多
    private handleFold(item:any) {
        this.$set(item,'flod',!item.flod);
    }
    private showOtherWare(item:any){
        if(item.active){
            item.active=!item.active;
        }else{
            this.$set(item,'active',true);
        }
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
.hint-sign{
    line-height: 42px;
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
    // height: calc(100vh - 45px);
    // overflow-y: auto;
    // overflow-x: hidden;
}
.ezt-main{
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 28px;
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
.good-detail-l .title .good-detail-name,.good-detail-l .title .good-detail-billno{
    flex: 1.3;
}
.good-detail-l>div{
    display:flex;
    flex-direction: row;
    line-height: 22px;
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
}
.good-detail-sort{
    font-size: 13px;
    color: #5F7B9A;
    letter-spacing: 0;
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
    margin-bottom: 10px;
}
//直拨仓库
.good-warehouse{
    display: flex;
    flex-direction: row;
    .warehouse-list{
        flex: 1;
        padding: 4px 0px 0px 10px;
        .warehouse-isDefault{           
            // display: flex;               
            flex-direction: column;  
            overflow: hidden;
            height: 46px; 
            li>span{
                text-align: left;
                width: 88px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        } 
        .warehouse-isDefault.active{
            overflow-y: auto;
            height: auto;
        }           
    }       
}
.warehouse-list,.warehouse-other{
    text-align: left;  
    li{
        display:flex;
        line-height: 22px;
        span{
            flex:1;
            text-align: center;
        }
    }      
}
.good-warehouse-num{
    margin-left: 10px;
    letter-spacing: 0;
}
.turnOn{
    display: inline-block;
    height: 100%;
    flex: .2;
    margin-top: 10px;
}
.icon-trun-on.off{
    transform: rotate(180deg);
} 
.good-detail-item{
    border-bottom: 1px solid #E0EBF9;
    padding-bottom: 10px;
}
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
</style>
