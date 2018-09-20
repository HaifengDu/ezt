<!--选择模板-->
<template>
   <div class="ezt-page-con selectthetemplate">   
    <ezt-header :back="true" title="选择模板" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">     
       <div class="ezt-add-content"> 
          <div class="done-none" v-if="!inlineDescListValue">
            <div></div>
            <span>没有搜索结果</span>
            <em @click="goBack">返回</em>
          </div>  
         <checklist style="width:100%;" :label-position="labelPosition" :options="templateList" v-model="inlineDescListValue"  :max="1"></checklist>
         <div class="nextstep" @click="nextstep('d')">下一步</div>   
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
import StockTakingService from "../../../service/StockTakingService"
import librarydetails from './LibraryDetails'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       "user":"user",
       'pktemplateimport':'stockTaking/pktemplateimport',//模板导入
       'inventoryDetails':'stockTaking/inventoryDetails',//盘点详情  确认盘点单
     }) 
   },
   methods:{ 
     ...mapActions({
       'setPktemplateimport':"stockTaking/setPktemplateimport",
       'setInventoryDetails':"stockTaking/setInventoryDetails",
     })

   }   
})  
export default class stockTaking extends Vue{
    private pager:Pager;   
    private user:IUser;
    private service:StockTakingService;
    private getTemplateDetails:INoopPromise;  //模板详情
    private labelPosition= 'left';
    private inventoryDetails:any[]; //列表详情  确认盘点单
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private pktemplateimport:any; 
    private setPktemplateimport:INoopPromise;//store中给setPktemplateimport赋值
    private templateList:any= [];
    private inlineDescListValue:any;
    private busi_date:any;
    private bill_type_name:any;
    private warehouse_name:any;
    private stock_count_mode_name:any;
    private pdtype:any;
    created() {
      this.service = StockTakingService.getInstance();
      this.pktemplateimport.pdtype = this.$route.query.pdtype
      this.pktemplateimport.warehouse_name = this.$route.query.warehouse_name
      this.pktemplateimport.stock_count_mode_name = this.$route.query.stock_count_mode_name
     
    }

    mounted(){
       this.list()
    }
    private goBack(){
      this.$router.back();
    }

    private list(){
        this.pktemplateimport.forEach((item:any,index:any)=>{
           let obj={
            key:'',
            value:''
          }
           obj.key=item.id;
           obj.value=item.text;
           this.templateList.push(obj);         
        })
        this.inlineDescListValue = [this.templateList[0]['key']]
     }

    
     //下一步
     private nextstep(types:any){   
      if(this.pktemplateimport){  
        const template_id = this.inlineDescListValue[0]  //选中模板id
        const flag = this.pktemplateimport.pdtype
        const warehouse_id = this.pktemplateimport.warehouse_name
        this.service.getTemplateDetails(template_id,flag,warehouse_id).then(res=>{ 
              this.$router.push({
                name:'LibraryDetails',
                 query:{
                    busi_date:this.$route.query.busi_date,
                    bill_type:this.pktemplateimport.pdtype,
                    bill_type_name:this.$route.query.bill_type_name,
                    warehouse_name:this.pktemplateimport.warehouse_name,
                    stock_count_mode_name:this.pktemplateimport.stock_count_mode_name,
                    treatment : this.pktemplateimport.stock_count_mode_name,
                    types:types,
                    template_name:"模板导入"
                }
              });
              this.setInventoryDetails(res.data.data); 
          },err=>{
              this.$toasted.show(err.message)
          })
        }
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
.ezt-main{
  height: auto;
  background-color:@background-color!important;
}
.selectthetemplate{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: @width;
    height: @height;
    overflow: hidden;
    background-color: @background-color;
    .ezt-add-content{
      width: @width;
      height:@height;
      display: flex;
      align-items: center;
      flex-direction: column;
      .done-none{
        height: 1000px;
        z-index: 9999;
        overflow: hidden;
        position: absolute;
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
}
</style>


