<!--收货单详情页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="收货单详情" @goBack="goBack">
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
                    <span class="return-list-title">item.dc_name</span> 
                    <span class="receive-status">已完成</span>
                </div>
                <div class="receive-icon-content">
                    <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{item.bill_no}</span></span>
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
            <ul>
                <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>




                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                                <span class="good-detail-sort">￥360.001</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                    <div class='good-warehouse'>
                        <span>已直拨</span>
                        <div class="warehouse-list">
                            <ul class="warehouse-isDefault">
                                <li>江阳1仓
                                    <span class="good-warehouse-num">1</span>
                                </li>
                                <li>江阳2仓
                                    <span class="good-warehouse-num">22</span>
                                </li>
                            </ul>
                            <ul class="warehouse-other" v-if="showOther">
                                <li>包合3仓
                                    <span class="good-warehouse-num">8</span>
                                </li>
                                <li>包合4仓
                                    <span class="good-warehouse-num">6</span>
                                </li>
                            </ul>
                        </div>
                       
                        <span class="turnOn" @click="showOtherWare">
                            <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                        </span>                        
                    </div>
                </li>
            </ul> 
        </div>  
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
    private service: ReceiveGoodService;
    private pager:Pager;
    private tabList:TabList = new TabList();
    private showOther: boolean=false;
    created() {     
       this.service = ReceiveGoodService.getInstance();
    }

    mounted(){ 
    }
    private showOtherWare(){
        this.showOther = !this.showOther;
    }
    private goBack(){
        this.$router.push('/receiveGood');
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
             text-align: center;
            .warehouse-isDefault{           
                display: inline-block;               
                        
            }            
        }       
    }
    .good-warehouse-num{
        margin-left: 10px;
        color: #95A7BA;
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
