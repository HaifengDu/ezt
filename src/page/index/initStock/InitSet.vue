<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="库存初始设置" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name ">库存初始日期：</span>
                        <span >
                            <ezt-canlendar v-model="setObj.initStockDate" :defaultValue="setObj.initStockDate" placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">库存月结日：</span>
                        <span class="title-select-name item-select">
                        <select placeholder="请选择" class="ezt-select" v-model="setObj.stockMonthDate">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">财务年截止日：</span>
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
        <!-- <confirm v-model="isCheckDay" @on-confirm="checkDayonConfirm">
            <p style="text-align:center;"> 当前机构初始化库存为0，日结后初始化数据不可维护，请确认是否日结。</p>
        </confirm> -->
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
import { FactoryService } from "../../../factory/FactoryService";
import { IIndexService } from '../../../interface/service/IIndexService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import ObjectHelper from '../../../common/objectHelper'
import CACHE_KEY from '../../../constans/cacheKey'
import _ from "lodash";
declare var mobiscroll:any;//全局定义日历
@Component({

})
export default class InitStock extends Vue{
    private cache = CachePocily.getInstance();
    private isCheckDay:boolean=false;
    private service:IIndexService;
    private setObj:any={
            accountCheckDate:"12-31",//财务结算日期
            stockMonthDate:'A',//库存月结日
            initStockDate:new Date().format('yyyy-MM-dd'),//库存初始日期
        };
   


    created() {  
        if(this.cache.getData(CACHE_KEY.INITSTOCK_SETTING)){//要货日期 的时间（）
            this.setObj = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INITSTOCK_SETTING));
        }      
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createIndex();
    }
    mounted(){   
           
         //日历
        const instance = mobiscroll.date(this.$refs.canlendar, {
            theme: 'material', 
            display: 'bottom',
            lang: 'zh',
            dateFormat:'mm-dd',
            //   defaultValue: new Date(this.setObj.accountCheckDate),
          invalid:[
            { start: new Date(new Date().getFullYear() + '/3/1'), end: new Date(new Date().getFullYear()+ '/3/31') },
            { start: new Date(new Date().getFullYear() + '/4/1'), end: new Date(new Date().getFullYear() +'/4/30') },
            { start: new Date(new Date().getFullYear() + '/5/1'), end: new Date(new Date().getFullYear() +'/5/31') },
            { start: new Date(new Date().getFullYear() + '/6/1'), end: new Date(new Date().getFullYear() +'/6/30') },
            { start: new Date(new Date().getFullYear() + '/7/1'), end: new Date(new Date().getFullYear() +'/7/31') },
            { start: new Date(new Date().getFullYear() + '/8/1'), end: new Date(new Date().getFullYear() +'/8/31') },
            { start: new Date(new Date().getFullYear() + '/9/1'), end: new Date(new Date().getFullYear() +'/9/30') },
            { start: new Date(new Date().getFullYear() + '/10/1'), end: new Date(new Date().getFullYear() +'/10/31') },
            { start: new Date(new Date().getFullYear() + '/11/1'), end: new Date(new Date().getFullYear() +'/11/30') },
          ],
          onSet: (val:{
              valueText:string
          })=>{
            this.setObj.accountCheckDate =val.valueText;
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
        this.cache.save(CACHE_KEY.INITSTOCK_SETTING,JSON.stringify(this.setObj));
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
    // private checkDayonConfirm(){
    //     this.checkDate('00');
    // }
    /**
     * 日结
     */
    private handlerCheckDay(){
        // this.isCheckDay = true;
        let _this = this;
        this.$vux.confirm.show({
            onConfirm () {
            _this.checkDate('00');
            },
            content:"当前机构初始化库存为0，日结后初始化数据不可维护，请确认是否日结。",
            showCancelButton: false
        })
    } 
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


