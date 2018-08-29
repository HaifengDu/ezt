<!--盘库详情-->
<template>
<div class="ezt-page-con librarydetails">
    <ezt-header :back="true" title="盘库详情">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="pkdetails">
              awfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfaawfsasfasdfasfsfa
              awfsasfasdfasfsfa
              awfsasfasdfasfsfa
              
              
              
              

        </div>
    </div>    
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
declare var mobiscroll:any;
@Component({
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       
     }) 
   },
   methods:{
     ...mapActions({
       
     })

   }   
})
export default class stockTaking extends Vue{
    private pager:Pager;   
    private list:any[] = [];
    
    created() {
      //  this.pager = new Pager()
      //  this.service = StockTakingService.getInstance();
      //  this.getPsList();
    }

    mounted(){
      
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
.librarydetails{
    position: relative;
    top: -67px;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 900px;
    background: linear-gradient(-98deg, #01A1FF 0%, #3945F3 96%);
}
</style>


