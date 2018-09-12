<!--添加初始化单-->
<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="添加初始化单" @goBack="goBack">

        </ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name ">库存初始日：</span>
                        <span >
                            <!-- <ezt-canlendar placeholder="开始时间" type="text" class="input-canlendar"></ezt-canlendar> -->
                            2018-9-13
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">仓库：</span>
                        <span class="title-select-name item-select">
                        <select name="" id="" placeholder="请选择" class="ezt-select" v-model="addReceiveGoodInfo.warehouse">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">成本录入方式</span>
                        <span>
                            <a href="javascript:(0)">含税单价</a>
                            <a href="javascript:(0)">含税金额</a>
                        </span>
                    </li>
                    <li>
                        <!-- <span class="title-search-name">选择物料：</span> -->
                        <span class="title-search-name">选择物料：</span>
                        <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                        
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {Component,Watch} from 'vue-property-decorator';
import { INoop, INoopPromise } from '../../../helper/methods';
import { InitStockService } from '../../../service/InitStockService';
@Component({
    computed:{
        ...mapGetters({
            'addReceiveGoodInfo':'initStock/addReceiveGoodInfo',//添加采购入库单的单据信息
        })       
    },
    methods:{
        ...mapActions({
            'setAddReceiveGoodInfo':"initStock/setAddReceiveGoodInfo",
            'setSelectedGood':'publicAddGood/setSelectedGood'
        })
    }
})
export default class InitStock extends Vue{
    private service:InitStockService;
    private addReceiveGoodInfo:any;//store中
    private setAddReceiveGoodInfo:INoopPromise;//store中给addReceiveGoodInfo赋值
    private setSelectedGood:INoopPromise;
    private orderType:any[] = [{//单据类型下拉数据    
      name:"合同采购单",
      type:"q"
    },{
      name:"采购单",
      type:"m"
    }];


    created(){
        this.service=InitStockService.getInstance();
    }
     //选择物料
    private renderUrl(info:string){
        // this.setAddReceiveGoodInfo(this.addReceiveGoodInfo);//将选择的单据信息保存在store中   
        this.$router.push(info);
      
    }

    /**
     * 返回
     */
    private goBack(){
        this.setAddReceiveGoodInfo({});
        this.setSelectedGood([]);
        this.$router.push("/initStock");
    }
}
</script>
