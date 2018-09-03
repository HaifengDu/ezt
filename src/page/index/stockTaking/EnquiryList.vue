<!--查询盘库单-->
<template>
 <div>
   <div class="ezt-page-con enquirylist">
    <ezt-header :back="true" title="查询盘库单">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content">
          <div class="warehouse">
            <group>
              <x-input title='单据号' text-align="right" v-model="disabledValue">{{disabledValue}}</x-input>
              <popup-radio title="盘点库" :options="options3" v-model="option3">
                  <p slot="popup-header" class="vux-1px-b demo3-slot">请选择盘点库</p>
              </popup-radio>
               <x-input title='开始日期' disabled text-align="right"></x-input>
              <x-input title='结束日期' text-align="right" disabled  ref="canlendar"></x-input>
            </group>
          </div>
          <p class="s_btn1">查询</p>
       </div>
      </div>    
   </div>    
 </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import LoginService from "../../../service/LoginService"
import IUser from "../../../interface/IUserModel"
import {maskMixin} from "../../../helper/maskMixin";
import '../../../assets/css/style.less'
import _ from "lodash";
declare var mobiscroll:any;
@Component({  
   components:{  
      
   }, 
   mixins:[maskMixin],  
   computed:{
     ...mapGetters({
       "user":"user"
     }) 
   },
   methods:{ 
     ...mapActions({
       
     })

   }   
})  
export default class enquirylist extends Vue{
    private service:LoginService;
    private user:IUser;
    private disabledValue:string = '黄焖鸡';
    private option3:string = '仓库A';
    private options3:any[] =['仓库A', '仓库B', '仓库C'];
    
    created() {
       this.service = LoginService.getInstance();  
    }

    mounted(){
      //日历
      mobiscroll.date(this.$refs.canlendar, {
          theme: 'material', 
          display: 'bottom',
          lang: 'zh',
          dateFormat:'yyyy-mm-dd',
          onSet: (val:{
              valueText:string
          })=>{
            this.checkDate(val.valueText);
          },
          onShow:(event:any,inst:any)=>{
            
          }
      });

    }
     private checkDate(date:string){
      this.service.checkDay(date).then(res=>{
        console.log(res,'res00000')
      },err=>{
        this.$toasted.error(err.message);
      })
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
.enquirylist{
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
     .warehouse{
          width: @width;
          text-align: left;
     }
     .s_btn1{
         margin-top: 20px;
         width: 95%;
         height: 45px;
         color: #fff;
         line-height: 45px;
     }
   }
}
</style>


