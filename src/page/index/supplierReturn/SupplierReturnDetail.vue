<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="退货单详情"  @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-backcolor"></div>
            <div class="ezt-detail-cot">
                <!-- 单据信息 -->
                <div class="receive-dc-list detail-order-info">
                    <div class="receive-icon-title">
                        <span class="receive-icon-dcName"></span>
                        <span class="return-list-title">{{detailList.dc_name || detailList.billNo}}</span> 
                        <span class="receive-status">已完成</span>
                    </div>
                    <div class="receive-icon-content">
                        <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">单号：<span class="receive-dc-content">{{detailList.bill_no}}</span></span>
                        <div class="receive-dc-title">退货日期：<span class="receive-dc-content">{{detailList.busiDate}}</span></div>
                        <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">仓库：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">源单号：<span class="receive-dc-content">{{}}</span></span>
                        <div v-if="InterfaceSysTypeBOH" class="receive-dc-title">供应商/配销中心：<span class="receive-dc-content">{{detailList.businessName}}</span></div>
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">{{detailList.memo?'detailList.memo':'无'}}</span></span>
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
                                    <span class="good-detail-name">{{item.name || item.goodsName}}
                                        <span class="good-detail-sort" v-if="!InterfaceSysTypeBOH">（{{item.sort}}）</span>
                                    </span>
                                    <span class="good-detail-sort">￥{{item.distributePrice1}}/{{item.unitName || item.unitName}}</span>
                                </div>
                                <div class="title">
                                    <span class="good-detail-billno">编号：{{item.billNo || item.goodsCode}}</span>
                                    <span class="good-detail-sort" v-if="!InterfaceSysTypeBOH">￥{{item.amt}}</span>
                                </div>                               
                            </div>
                            <div class="good-detail-r">
                                <span class="good-detail-num">{{item.num || item.qty}}</span>
                            </div>
                        </div>
                        <div class="good-detail-item">
                            <div class="good-detail-sort content">备注：
                                <div v-fixHeight="item" class="remark-suitable" :class="{'auto':item.flod}">{{item.remark || item.memo?'item.memo':'无'}}</div>
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
                <b>品项</b><span>{{goodList.length}}</span>，
                <b>数量</b><span>{{Total.num || Total.qty}}</span>，
                <b>含税金额￥</b><span>{{Total.Amt.toFixed(2)}}</span>
            </div> 
            </div>
        </ezt-footer>  
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
import { FactoryService } from '../../../factory/FactoryService';
import { ISupplierReturnService } from '../../../interface/service/ISupplierReturnService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey';
import { mapActions, mapGetters } from 'vuex';
@Component({
   components:{

   },
    computed:{
     ...mapGetters({
       'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',   //true BOH接口  false saas接口
      //  'goodList':'returnGood/goodList'
     })
   },
})
export default class ReturnGood extends Vue{
    private cache = CachePocily.getInstance();
    private service: ISupplierReturnService;
    private InterfaceSysTypeBOH:boolean;
    /**
     * 详情页物品信息
     */
    private goodList:any[] = [];
    /**
     * 详情页信息
     */
    private detailList:any = {};     
    created() {   
        const factory = FactoryService.getInstance().createFactory();  
        this.service = factory.createSupplierReturn();
    }
    mounted() {        
        if(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_DETAILLIST)){
            const detailList = JSON.parse(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_DETAILLIST));
            this.detailList = detailList.data
            this.goodList = detailList.data['detailList']
        }
    }
    private goBack() {     
      this.cache.clear();
      this.$router.push('/supplierReturn');
    }
    /**
     * 
     * 物料总数量、总金额
     */
    private get Total(){
        return this.goodList.reduce((ori,item) => {
            if(item.distributePrice1){
                ori.qty = ori.qty + Number(item.qty);
                if(item.distributePrice1){
                    ori.Amt = ori.Amt + (item.qty * item.distributePrice1);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.qty = 0;
                }
                return ori;
           }else{
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
    },{num:0,Amt:0,distributePrice1:0,qty:0});
  }
    // 备注出现查看更多
    private handleFold(item:any) {
        this.$set(item,'flod',!item.flod);
    }
}
</script>
<style lang="less" scoped>
.detail-acount-title{
    font-size: 12px;
    color: #95A7BA;
    letter-spacing: 0;
    text-align: left;
    margin-left: 10px;
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
    margin-bottom: 28px;
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
    line-height: 2;
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


