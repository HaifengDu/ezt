<!--选择模板-->
<template>
   <div class="ezt-page-con selectthetemplate">   
    <ezt-header :back="true" title="选择模板">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">     
       <div class="ezt-add-content">    
          <div class="done-none" v-if="!inlineDescListValue||inlineDescListValue.length<=0">
            <div></div>   
            <span>没有搜索结果</span>
            <em @click="this.inlineDescListValue = false">返回</em>
          </div>  
         <checklist style="width:100%;" v-else :label-position="labelPosition" :options="templateList" v-model="inlineDescListValue"  :max="1"></checklist>
         <div class="nextstep" @click="nextstep(pageType.InventoryType)">下一步</div>   
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
import IUser from "../../../interface/IUserModel"
import { INoop, INoopPromise } from '../../../helper/methods'
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import CACHE_KEY from '../../../constans/cacheKey'
import { PageType } from "../../../enum/EPageType"
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       "user":"user",
     }) 
   },
   methods:{ 
     ...mapActions({

     })
   }   
})  
export default class stockTaking extends Vue{
    private pager:Pager;   
    private user:IUser;
    private service:IStockTakingService;
    private cache = CachePocily.getInstance();
    private templateimport:any; 
    private labelPosition= 'left';
    private templateList:any= [];
    private inlineDescListValue:any=[];
    private pageType = PageType; //页面类型
    private addinventory:any;//store中
    created() {   
       const factory = FactoryService.getInstance().createFactory();
       this.service = factory.createStockTaking();
       if(this.cache.getData(CACHE_KEY.TEMPLATEIMPORT)){
          const templateList = JSON.parse(this.cache.getData(CACHE_KEY.TEMPLATEIMPORT));
          this.templateimport = templateList
       }
       if(this.cache.getData(CACHE_KEY.ADDINVENTORY)){
            this.addinventory = JSON.parse(this.cache.getData(CACHE_KEY.ADDINVENTORY));
       }
    }
    mounted(){
       this.list()
    }
    /**
     * 获取模板数据
     */
    private list(){
        this.templateimport.forEach((item:any,index:any)=>{
           let obj={
            key:'',
            value:''
           }
           obj.key=item.id;
           obj.value=item.text;    
           this.templateList.push(obj);         
        })
        if(this.templateList&&this.templateList.length>0){
          this.inlineDescListValue = [this.templateList[0]['key']]
        }
     }
     /**
      * 下一步
      */
     private nextstep(types:PageType,template_name:any){   
      let templateName ={};
      const template_id = this.inlineDescListValue[0]  //选中模板id
      const flag = this.addinventory.bill_type
      const warehouse_id = this.addinventory.stock
      this.service.getTemplateDetails(template_id,flag,warehouse_id).then(res=>{ 
            templateName={
                templateName:"模板导入"
            }
            this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
            this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(this.addinventory));
            this.cache.save(CACHE_KEY.TEMPLATEIMPORT,JSON.stringify(this.templateimport));
            this.cache.save(CACHE_KEY.TEMPLATE_NAME,JSON.stringify(templateName))
            this.$router.push({name:'LibraryDetails',query:{types:types.toString()}});
        },err=>{
            this.$toasted.show(err.message)
        })
   }
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.selectthetemplate{
    background-color: @background-color;
      .done-none{
        position: absolute;
        z-index: 999;
        em{
          border: 1px solid #BACAD9;
          padding: 0 15px;
          width: 53px;
          height: 30px;
          line-height: 30px;
          margin: 70px auto;
          border-radius: 19px;
          font-size: 12px;
          font-style: normal;
          cursor: pointer;
          color: #5F7B9A;
        }
      }
     .nextstep{
        width: 100%;
        height: 45px;
        line-height: 45px;
        position: fixed;
        bottom: 0;
        left: 0;
        font-size: 15px;
        color: #1188FC;
        z-index: 0;
        cursor: pointer;
        background-color: @background-color;
        box-shadow: 0 -1px 3px 0 rgba(204,216,228,0.80);
     }
}
</style>


