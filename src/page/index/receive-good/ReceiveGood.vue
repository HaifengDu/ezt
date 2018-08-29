<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="收货">
       <div slot="action">
         <div class="add">
          <i class="fa fa-plus" aria-hidden="true"></i> 
          <i class="fa fa-search" aria-hidden="true"></i>
         </div>
       </div>
    </ezt-header>    
    <div class="ezt-main">       
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList"
         @click="tabClick(index)" :key="index">{{item.name}}</tab-item>
      </tab>        
      <div class="ezt-add-content">       
         <!-- <swiper v-model="index" height="100px" :show-dots="false">
              <swiper-item v-for="(item, index) in list2" :key="index">
                <div class="tab-swiper vux-center">
                       <ul class="submitted">
                          <li :key="index" v-for="(item,index) in inventoryList" @click="librarydetails">
                            <div class="state">
                                <span><i>{{item.week}}</i>{{item.name}}</span>
                                <span>{{item.state}}</span>
                            </div>
                            <div class="content">
                                <p>盘点仓库：<span>{{item.cangku}}</span></p>
                                <p>盘点日期：<span>{{item.date}}</span></p>
                                <p>生成损溢：<span>{{item.sunyi}}</span></p>
                                <p>未盘处理：<span>{{item.wpcl}}</span></p>
                            </div>
                            <div class="footer">
                                <P>业务日期：<span>{{item.ywrq}}</span></P>
                                <div class="submit">实盘录入</div>
                            </div>
                          </li>
                        </ul>
                  </div>
              </swiper-item>
          </swiper> -->
      </div>    
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import {TabItem} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
import { ReceiveGoodService } from '../../../service/RecieveGoodService';
import { TabList } from '../../../common/ITab';
declare var mobiscroll:any;
@Component({
   components:{
     TabItem
   },
   computed:{
     ...mapGetters({
       'goodList':'returnGood/goodList'
     })
   },
   methods:{
     ...mapActions({
       'getGoodList':"returnGood/getGoodList"
     })
   }
})
export default class ReturnGood extends Vue{
    private selected:String = 'deliver';
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    // private updateUser:INoop;
    private list:any[] = [];
    private goodList:any[];

    private tabList:TabList = new TabList();
    created() {
      this.tabList.push({
        name:"待收货",
        status:1,
        active:true
      });
      this.tabList.push({
        name:"待入库",
        status:2,
        active:false
      });
      this.tabList.push({
        name:"已完成",
        status:3,
        active:false
      });
      //  this.pager = new Pager()
      //  this.service = ReturnGoodService.getInstance();
      //  this.getGoodList();
    }

    mounted(){
      this.getGoodList();
    }

    tabClick(index:number){
      this.tabList.setActive(index);
    }

  /**
   * watch demo
   */
    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }

/**
 * computed demo
 */
    private get Total(){
      return this.list.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
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
 //tab切换颜色设置
  .mint-tab-item.is-selected .deliver {
    color: #54B1FD;
    border-bottom: 2px solid #54B1FD;
    padding: 3px 6px;
  }

  .mint-tab-item.is-selected .purchase {
    color: #6EDB90;
    border-bottom: 2px solid #6EDB90;
    padding: 3px 6px;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border: none;
  }

  .mint-navbar .mint-tab-item {
    padding: 7px 0;
  }
  .mint-navbar{
    display: flex;
  }
  .ezt-add-content{
    // position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 70px;
    width: 100%;
    height: 100%;
  }
  .add{
      font-size: 20px;
      i{
        margin-right: 10px;
      }
    }

</style>
