<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="库存初始设置" @goBack="goBack"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name ">库存初始日期：</span>
                        <span >
                            <ezt-canlendar placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">库存月结日：</span>
                        <span class="title-select-name item-select">
                        <select name="" id="" placeholder="请选择" class="ezt-select">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">财务年截止日：</span>
                        <span >
                            <ezt-canlendar placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar>
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
                    <a href="javascript:(0)" class="ezt-foot-storage">直接日结</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub"> 添加初始化库存</a>   
                </div>  
                </div>
            </ezt-footer>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
@Component({

})
export default class InitStock extends Vue{


    private orderType:any[]=[{
        name:'1日-自然月',
        type:'A'
    },{
        name:'25日-财务月',
        type:'B'
    }]
    
    private goBack(){
        this.$router.push("/initStock");
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
</style>


