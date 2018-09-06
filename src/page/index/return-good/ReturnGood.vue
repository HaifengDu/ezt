<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="退货">
       <div slot="action">
           <span>退货</span>
       </div>
    </ezt-header>    
    <div class="ezt-main">       
       <mt-navbar v-model="selected">
          <mt-tab-item id="deliver">
            <img slot="icon" src="../../../assets/images/distribution.png">
            <span class="deliver">配送单</span>
          </mt-tab-item>
          <mt-tab-item id="purchase">
            <img slot="icon" src="../../../assets/images/put_in_storage.png">
            <span class="purchase">采购单</span>
          </mt-tab-item>
        </mt-navbar>        
      <div class="ezt-add-content">       
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="deliver">
            <div>
              <div :key="index" v-for="(item,index) in goodList">{{item.name}}</div>
            </div>         
            <!-- <ul class="done-none">
               <div></div>
              <span>目前还没有任何订单</span>
            </ul> -->
          </mt-tab-container-item>
          <mt-tab-container-item id="purchase">
            采购单
            
            <ul class="done-none">
              <div></div>
              <span>目前还没有任何订单</span>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>    
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import ReturnGoodService from '../../../service/ReturnGoodService'
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
declare var mobiscroll:any;
@Component({
   components:{
  
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
    private service: ReturnGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    // private updateUser:INoop;
    private list:any[] = [];
    private goodList:any[];

    created() {
      //  this.pager = new Pager()
      //  this.service = ReturnGoodService.getInstance();
      //  this.getGoodList();
    }

    mounted(){
      this.getGoodList();
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
</style>
