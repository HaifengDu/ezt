<!--选择模板-->
<template>
   <div class="ezt-page-con selectthetemplate">
    <ezt-header :back="true" title="选择模板">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content"> 
         <checklist 
           :label-position="labelPosition" 
           style="width:100%;" 
           :options="inventoryList" 
           :max="1"></checklist>
           <div :key="index" v-for="(item,index) in inventoryDetails"></div>
         <div class="nextstep" @click="nextstep">下一步</div>   
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
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       'inventoryDetails':'libraryDetails/inventoryDetails'
     }) 
   },
   methods:{ 
     ...mapActions({
       'getInventoryDetails':'libraryDetails/getInventoryDetails'
     })

   }   
})  
export default class selectthetemplate extends Vue{
    private pager:Pager;   
    private labelPosition= 'left';
    private service: LibraryDetailService;
    private getInventoryDetails:INoopPromise;
    private inventoryList:any[] = ['模板1','模板2','模板3'];
    created() {
      
    }

    mounted(){
       this.getInventoryDetails();

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
    // 盘点类型导入
     private inventorytype(info:string){
      this.$router.push(info)
     }
     //下一步
     private nextstep(){
       this.$router.push('/confirmationlist')
     }
    
      

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.demo3-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.selectthetemplate{
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
    .nextstep{
        width: 100%;
        height: 45px;
        line-height: 45px;
        position: fixed;
        bottom: 0;
        left: 0;
        font-size: 15px;
        color: #1188FC;
        cursor: pointer;
        background-color: @background-color;
        box-shadow: 0 -1px 3px 0 rgba(204,216,228,0.80);
     }
   }
   
}
</style>


