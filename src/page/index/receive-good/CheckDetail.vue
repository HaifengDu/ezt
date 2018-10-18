<!--收货单详情页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="收货单详情">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
        <div class="ezt-backcolor"></div>
         <div class="ezt-detail-cot">
            <!-- 单据信息 -->
            <div class="receive-dc-list detail-order-info">
                <div class="receive-icon-title">
                    <span class="receive-icon-dcName"></span>
                    <span class="return-list-title">{{detailList.dc_name}}</span> 
                    <span class="receive-status">已完成</span>
                </div>
                <div class="receive-icon-content">
                    <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{detailList.bill_no}}</span></span>
                    <div style="display:flex">
                        <span class="receive-dc-title">含税金额：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">税率：<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>
                    <div style="display:flex">
                        <span class="receive-dc-title">未税金额：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">到货日期<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>
                    <div style="display:flex">
                        <span class="receive-dc-title">仓库：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>              
                </div>
            </div>
            <div class="detail-acount-title">
            物品清单
            </div>  
            <ul v-if="goodList.length>0">
                <li class="good-detail-content" v-for="(item,index) in goodList" :key="index">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div class="title">
                                <span class="good-detail-name">{{item.name}}
                                    <span class="good-detail-sort">（{{item.sort}}）</span>
                                </span>
                                <span class="good-detail-sort">￥{{item.price}}/{{item.unitName}}</span>
                            </div>
                            <div class="title">
                                <span class="good-detail-billno">编号：{{item.billNo}}</span>
                                <span class="good-detail-sort">￥{{item.amt}}</span>
                            </div>
                            <div class="good-detail-sort">备注：{{item.remark}}</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">{{item.num}}</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
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
            <b>数量</b><span>{{Total.num}}</span>，
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
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
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
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class ReceiveGood extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    private service: ReceiveGoodService;
    private pager:Pager;
    private tabList:TabList = new TabList();
    private showOther: boolean=false;
    private goodList:any[]=[];//详情页物品信息
    private detailList:any={};//详情页信息
    created() {     
        this.service = ReceiveGoodService.getInstance();       
    }

    mounted(){ 
        if(this.cache.getData(CACHE_KEY.RECEIVE_DETAILLIST)){
            this.detailList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_DETAILLIST));
            this.detailList.goodList = [{
            name:"猪肉",
            sort:"规格",
            price:12,
            unitName:"KG",
            billNo:"003222",
            amt: 360,
            remark:"这是水果",
            num:3,
            directWarehouse:[{
                name:"仓库1",
                num:1,
            },{
                name:"仓库2",
                num:2,
            },{
                name:"仓库3",
                num:3,
            },{
                name:"仓库4",
                num:66
            }]
            },{
                name:"大猪蹄子",
                sort:"规格",
                price:22,
                unitName:"KG",
                billNo:"003222",
                amt: 660,
                remark:"这是肉",
                num: 6,
                directWarehouse:[{
                    name:"上海仓库1",
                    num:1,
                },{
                    name:"北京仓库2",
                    num:2,
                },{
                    name:"軣咕咕3",
                    num:3,
                },{
                    name:"仓库4",
                    num:66
                }]
            }]
            this.goodList = this.detailList.goodList;
        }
    }
    /**
     * computed demo
     * 物料总数量、总金额
     */
    private get Total(){
        return this.goodList.reduce((ori,item)=>{
        ori.num = ori.num+Number(item.num); 
            if(item.price){
                ori.Amt = ori.Amt + (item.num * item.price);
            }else{
                ori.Amt = ori.Amt + (item.amt);
            }      
        
        return ori;
        },{num:0,Amt:0});
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
</style>
