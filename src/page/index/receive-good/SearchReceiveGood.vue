<!--收货新增页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货单查询'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <!-- <ul class="ezt-title-search">
          <li>
            <span class="title-search-name">收货类型：</span>
            <span class="title-select-name">配送收货<i class="icon-trun-on"></i></span>
          </li>
          <li>
            <span class="title-search-name">来货单位：</span>
            <span class="title-select-name">全部<i class="icon-trun-on"></i></span>
          </li>
          <li>
            <span class="title-search-name">收货日期：</span>
            <span>
              <ezt-canlendar type="text" class="input-canlendar"></ezt-canlendar>
               <span>至</span>
              <ezt-canlendar type="text" class="input-canlendar"></ezt-canlendar>
            </span>
          </li>
          <li>
            <span class="title-search-name">仓库：</span>
            <span class="title-select-name">全部<i class="icon-trun-on"></i></span>
          </li>
          <li>
            <span class="title-search-name">源单号：</span>
            <input type="text">
          </li>
           <li>
            <span class="title-search-name">单据或物料：</span>
            <input type="text">
          </li>
          <li>
            <div class="ezt-two-btn">查询</div>
          </li>
        </ul> -->
        <ul>
          <li>
              <!-- 收货单列表       -->
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName"></span>
                <span class="return-list-title">dc_name}}</span> 
                <span class="receive-status">已完成</span>
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">订单编号：<span class="receive-dc-content">item.bill_no</span></span>
                <div style="display:flex">
                  <span class="receive-dc-title">到货日期：<span class="receive-dc-content">item.arrive_date</span></span>
                  <span class="receive-dc-title">要货日期：<span class="receive-dc-content">item.ask_goods_date</span></span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">item.details</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共2件货品<span class="receive-total">合计：￥434</span></span>
                </div>
              </div>
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
    private title:String = '';
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    private hideMask:()=>void;
    private showMask:()=>void;
    private searchParam:String = "";
    // private updateUser:INoop;
    private list:any[] = [];
    private goodList:any[] = [];

    private tabList:TabList = new TabList();
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
       this.goodList = [];
      //  this.getGoodList();
    }

    mounted(){      
      this.title = this.$route.params.type 
      this.searchParam = this.$route.params.obj;
      console.log(this.searchParam,'00000');
    }

  /**
   * computed demo
   */
    private get Total(){
      return this.list.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
    }
    /**
     * 确认收货
     */
    private confirmReceive(){
      console.log('确认收货！')
    }
   
}
</script>

<style lang="less" scoped>
  .ezt-title-search{
    background: #fff;
  }
 .ezt-title-search li{
    padding: 10px;
    border-bottom: 1px solid #E0EBF9;
    text-align: left;
    display: flex;
    flex-direction: row;
 }
 .ezt-title-search li:last-child{
   background:none;
   padding: 4px 0px;
 }
 .title-search-name{
   flex:1;
 }
 .ezt-two-btn{
    width: 40px;
    margin: 0 auto;
    border-radius: 8px;
    padding: 6px 11px;
    text-align: center;
 }
 .icon-trun-on{
   margin-left: 10px;
 }
</style>
