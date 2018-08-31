<!--新增盘库单-->
<template>
 <div>
   <div >

   </div>
   <div class="ezt-page-con addinventorylist" v-if="false">
    <ezt-header :back="true" title="新增盘库单">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content">
          
       </div>
      </div>    
   </div>    
 </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import LibraryDetailService from '../../../service/LibraryDetailService'
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
    private service: LibraryDetailService;
    private list:any[] = [];
    private inventoryDetails:any[];
    private getInventoryDetails:INoopPromise;
    created() {
      
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

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.confirmationlist{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: @width;
    height: @height;
    .content{
      width: @width;
      height:@height;
      display: flex;
      align-items: center;
      flex-direction: column;
      overflow: scroll;

   }
}
</style>


