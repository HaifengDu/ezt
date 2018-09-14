<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="库存初始设置" @goBack="goBack"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name ">库存初始日期：</span>
                        <span >
                            <ezt-canlendar :defaultValue="setObj.initStockDate" placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">库存月结日：</span>
                        <span class="title-select-name item-select">
                        <select placeholder="请选择" class="ezt-select" v-model="setObj.stockMonthDate">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">财务年截止日：</span>
                        <span >
                            <!-- <ezt-canlendar placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar> -->
                            <span ref="canlendar" class="input-canlendar">
                                {{setObj.accountCheckDate}}
                            </span>
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">成本核算方式：</span>
                        <span>
                           加权平均
                        </span>
                    </li>
                </ul>
            </div>
            <ezt-footer>
                <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total remark">
                    注：当须维护初始化库存时，点击“添加初始化库存”，否则可直接“日结”
                </div>
                <div class="ezt-foot-button">
                    <span class="ezt-foot-storage" @click="handlerCheckDay">
                        <p>直接日结</p>  
                        <p>初始化库存为0</p>
                    </span>                   
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="renderUrl('/addInitStock')"> 添加初始化库存</a>   
                </div>  
                </div>
            </ezt-footer>
        </div>
        <!-- 返回时提示保存信息 -->
        <confirm v-model="isCheckDay" @on-confirm="checkDayonConfirm">
            <p style="text-align:center;"> 当前机构初始化库存为0，日结后初始化数据不可维护，请确认是否日结。</p>
        </confirm>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
import LoginService from "../../../service/LoginService"
import _ from "lodash";
declare var mobiscroll:any;//全局定义日历
@Component({

})
export default class InitStock extends Vue{
    private isCheckDay:boolean=false;
    private service:LoginService;

    private setObj:any={
        accountCheckDate:"12-31",//财务结算日期
        stockMonthDate:'A',//库存月结日
        initStockDate:new Date().format('yyyy-MM-dd'),//库存初始日期
    }


    created() {
      this.service = LoginService.getInstance(); 
    }
    mounted(){
         //日历
      mobiscroll.date(this.$refs.canlendar, {
          theme: 'material', 
          display: 'bottom',
          lang: 'zh',
          dateFormat:'mm-dd',
          valid:[
            {start: new Date(new Date().getFullYear(),1,1),end: new Date(new Date().getFullYear(),1,1)},
            {start: new Date(new Date().getFullYear(),2,1),end: new Date(new Date().getFullYear(),2,1)},
            {start: new Date(new Date().getFullYear(),12,1),end: new Date(new Date().getFullYear(),12,1)},
          ],
          onSet: (val:{
              valueText:string
          })=>{
            this.setObj.accountCheckDate =val.valueText;
          },
          onShow:(event:any,inst:any)=>{
            // this.hideMask();
            // this.titleSelect=false;
          }
        });
    }

    private orderType:any[]=[{
        name:'1日-自然月',
        type:'A'
    },{
        name:'25日-财务月',
        type:'B'
    }]

    /**
     * 添加初始化库存
     */
    private renderUrl(info:any){
        this.$router.push(info);
    }
     //日结事件
    private checkDate(date:string){
      this.service.checkDay(date).then(res=>{
        console.log(res,'res00000')
      },err=>{
        this.$toasted.error(err.message);
      })
    }
    /**
     * 日结确认
     */
    private checkDayonConfirm(){
        this.checkDate('00');
    }
    /**
     * 日结
     */
    private handlerCheckDay(){
        this.isCheckDay = true;
    }    
    /**
     * 返回
     */
    private goBack(){
        this.$router.push("/");
    }
}
</script>
<style lang="less" scoped>
    .ezt-foot-total.remark{
        height: auto;
        text-align: left;
        line-height: inherit;
        padding:4px;
    }
    .ezt-foot-button{
        line-height: inherit;
    }
    .ezt-foot-storage{
        display: flex;
        flex-direction: column;
    }
    .ezt-foot-sub{
        line-height: 50px;
    }

</style>


