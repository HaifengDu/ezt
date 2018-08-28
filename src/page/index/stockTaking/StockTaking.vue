<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="盘库">
       <div slot="action">
           <!-- <span></span> -->
           <div>
             <i class="fa fa-user" aria-hidden="true"></i>
           </div>
           <div>
             <i class="fa fa-user" aria-hidden="true"></i>
           </div>
       </div>
    </ezt-header>    
    <div class="ezt-main">       
       <mt-navbar v-model="selected">
          <mt-tab-item id="all">
            <!-- <img slot="icon" src="../../../assets/images/all.png"> -->
            <span class="all">待提交</span>
          </mt-tab-item>
          <mt-tab-item id="shengxiao">
            <!-- <img slot="icon" src="../../../assets/images/daishengxiao.png"> -->
            <span class="shengxiao">待/已生效</span>
          </mt-tab-item>
          <mt-tab-item id="shenhe">
            <!-- <img slot="icon" src="../../../assets/images/daishenhe.png"> -->
            <span class="shenhe">待审核</span>
          </mt-tab-item>
          <mt-tab-item id="shenheshibai">
            <!-- <img slot="icon" src="../../../assets/images/shenheshibai.png"> -->
            <span class="shenheshibai">审核失败</span>
          </mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="all">
            待提交
          </mt-tab-container-item>
          <mt-tab-container-item id="shengxiao">
            待/已生效
          </mt-tab-container-item>
          <mt-tab-container-item id="shenhe">
            待审核
          </mt-tab-container-item>
          <mt-tab-container-item id="shenheshibai">
            审核失败
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
import NeedGoodService from '../../../service/NeedGoodService'
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
declare var mobiscroll:any;
@Component({
   components:{  
  
   },   
   computed:{
     ...mapGetters({
       'psList':'needGood/psList'
     }) 
   },
   methods:{
     ...mapActions({
       'getPsList':'needGood/getPsList'
     })
   }   
})
export default class NeedGood extends Vue{
    private selected:String = 'all';
    private service: NeedGoodService;
    private pager:Pager;   
    private getPsList:INoopPromise
    // private updateUser:INoop;
    private list:any[] = [];
    private psList:any[];
    created() {
      //  this.pager = new Pager()
      //  this.service = NeedGoodService.getInstance();
      //  this.getPsList();
    }

    mounted(){
      this.getPsList();
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

    // private getPsList(){
    //     this.service.getPsList(this.pager.getPage()).then(res=>{
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
    .mint-tab-item.is-selected .all{
        color: #AF4DFF;
        border-bottom: 2px solid #AF4DFF;
        padding: 5px 6px;
      }
      .mint-tab-item.is-selected .shengxiao{
        color: #54B0FF;
        border-bottom: 2px solid #54B0FF;
        padding: 5px 6px;
      }
      .mint-tab-item.is-selected .shenhe{
        color: #FFA74D;
        border-bottom: 2px solid #FFA74D;
        padding: 5px 6px;
      }
      .mint-tab-item.is-selected .shenheshibai{
        color: #FF7562;
        border-bottom: 2px solid #FF7562;
        padding: 5px 6px;
      }
      .mint-navbar .mint-tab-item.is-selected{
        border:none;
      }
      .mint-navbar .mint-tab-item{
        padding: 7px 0;
      }

</style>


