<!--损溢单详情-->
<template>
  <div class="ezt-page-con SpilldetailsPage">
    <ezt-header :back="true" title="损溢单详情">
       <div slot="action">
       </div>    
    </ezt-header>    
    <div class="ezt-main"> 
        <div class="ezt-backcolor"></div>
         <div class="ezt-detail-cot">
            <div class="receive-dc-list detail-order-info">   
                <div class="receive-icon-title">
                    <span class="return-list-title">单号：{{spilledDetails.bill_no}}</span> 
                    <span class="receive-status">{{spilledDetails.currentdate}}</span>
                </div>
                <div class="receive-icon-content">
                    <span class="receive-dc-title">仓库：
                        <span class="receive-dc-content">{{spilledDetails.warehouse}}</span>
                    </span>
                    <span class="receive-dc-title">单据类型：
                        <span class="receive-dc-content">{{spilledDetails.bill_type}}</span>
                    </span>
                    <span class="receive-dc-title">报损原因：
                        <span class="receive-dc-content">{{spilledDetails.causeofloss}}</span>
                    </span>
                    <span class="receive-dc-title">盘点单号：
                        <span class="receive-dc-content">{{spilledDetails.singlenumber}}</span>
                    </span>
                    <div style="display:flex;padding-bottom:20px;">
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">{{spilledDetails.remark}}</span></span>
                    </div>
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
                                <span class="good-detail-name">{{item.dc_name}}【{{item.model}}】</span>
                                <span class="good-detail-sort">￥{{item.unit}}/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：{{item.bill_no}}</span>
                                <span class="good-detail-sort">￥{{item.material_size}}</span>
                            </div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class="good-detail-item" v-if="item.remark">
                        <div class="good-detail-sort content" v-model="content">备注：
                            <div class="remark-suitable" :class="{'auto':item.flod}">{{item.remark}}</div>
                            <span @click='handleFold(item)'>{{item.flod?"收起":"展开"}}</span>
                        </div>
                        <div>
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
import {LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../helper/methods'
import { SpilledSheetService } from '../../../service/SpilledSheetService'
import { CachePocily } from "../../../common/Cache"
import {ECache} from '../../../enum/ECache'
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{

   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({

     })
    
   },
   methods:{
     ...mapActions({
     })
   }
})
export default class SpilledSheet extends Vue{
    private service: SpilledSheetService;
    private cache = CachePocily.getInstance();
    private spilledDetails:any={};//损溢详情页面表头
    private details:any[] = [];  //物料明细
    private fold :boolean = true;  //备注超出显示查看更多
    private content:string='';
    created() {          
       this.service = SpilledSheetService.getInstance();
       this.detailList();
        if(this.cache.getData(CACHE_KEY.SPILLEDSHEET_DETAILS)){
            this.spilledDetails = JSON.parse(this.cache.getData(CACHE_KEY.SPILLEDSHEET_DETAILS));
        }
    }
    
    mounted(){ 
        this.detailList();
        this.getData();   
    }
    /**
     * 备注出现查看更多
     */
    private handleFold(item:any) {
        this.$set(item,'flod',!item.flod);
    }
    private getData() {
        this.content = this.content
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
    /**
     * 物料明细
     */
    private detailList(){
     this.service.getGoodDetail().then(res=>{
          this.details=res.data.data;
        },err=>{
          this.$toasted.show(err.message);
      });
    }
}
</script>
<style lang="less" scoped>
    .receive-icon-content{
         position: relative;
     }
    .return-list-title{
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
        ul{
            li:last-child{
                margin-bottom: 35px;
            }
        }
    }
    .ezt-main{
        overflow-y: auto;
        overflow-x: hidden;
    }
    .receive-dc-content{
        width: 100px;
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
    }
    .good-detail-item{
        margin-top: 5px;
    }
    .good-detail-item .content{       
        word-break: break-all;    
        word-wrap:break-word;
    } 
    .good-detail-item .remark-suitable{
        line-height: 25px;
        height: 50px;
        overflow: hidden;
    }
    .good-detail-item .remark-suitable.auto{
        height: auto;
    }    
    .good-detail-billno{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
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
</style>
