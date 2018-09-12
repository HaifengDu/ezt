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
                           {{addInitStockInfo.date}}
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name ">仓库：</span>
                        <span class="title-select-name item-select">
                        <select name="" id="" placeholder="请选择" class="ezt-select" v-model="addInitStockInfo.warehouse">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">成本录入方式</span>
                        <span class="costType-info">
                            <!-- <a href="javascript:(0)" :class='[{active:(addInitStockInfo.costType=="price")}]'>含税单价</a>
                            <a href="javascript:(0)" :class='[{active:(addInitStockInfo.costType=="amt")}]'>含税金额</a> -->
                            <!-- <button-tab v-model="addInitStockInfo.costType">
                                <button-tab-item>含税单价</button-tab-item>
                                <button-tab-item>含税金额</button-tab-item>
                            </button-tab> -->
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
                <ul>
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good" >
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（规格）</span>
                                    </span>
                                    <span @click="editStatus">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                                    </span>                                   
                                </div>
                                <div>
                                    <span class="good-detail-billno">编码：003222</span>
                                    <span class="good-detail-sort">￥{{item.price}}/{{item.utilname}}
                                    </span>
                                    <span>{{item.num}}</span>
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                    <span class="title-search-name">税率：</span>
                                    <span>20%</span>
                                </div>
                                <div class="park-input"> 
                                    <span class="title-search-name">供应商：</span>
                                    <span>河南供应商1</span>
                                </div>                    
                            </div>
                        </div>
                         <div>
                            <x-dialog v-model="isEdit" class="dialog-demo">
                            <div class="ezt-dialog-header">                                
                                <span class="ezt-close" @click="isEdit=false" >
                                <i class="fa fa-times" aria-hidden="true"></i>
                                </span>
                            </div>                            
                            <div class="warehouse-list">
                                <ul class="edit-good-list">
                                    <li>
                                        <span class="title-select-name">数量：</span>
                                        <x-number v-model="item.num" button-style="round" :min="0"></x-number>
                                    </li>
                                    <li>
                                        <span class="title-dialog-name">价格/含税额：</span>
                                        <span class="icon-input price">
                                            <input type="number" class="ezt-smart" v-model="item.price">
                                        </span>                                       
                                    </li>
                                    <li>
                                        <span class="title-dialog-name">税率：</span>
                                        <span class="icon-input">
                                            <input type="number" class="ezt-smart" v-model="item.rate">
                                        </span>
                                    </li>
                                    <li class="select-list">
                                        <span class="title-dialog-name">供应商：</span>
                                        <span class="title-select-name item-select">
                                        <select name="" id="" placeholder="请选择" class="ezt-select" v-model="item.supplier">
                                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                                        </select>
                                        </span>
                                    </li>
                                    <li>
                                        <span class="title-dialog-name">备注：</span>
                                        <input type="text" placeholder="请输入备注" class="ezt-middle" v-model="item.remark">
                                    </li>
                                </ul>
                            </div>
                            <div class="mine-bot-btn">
                                <span class="ezt-lone-btn">确定</span>
                            </div>             
                            </x-dialog>
                        </div>                       
                    </li>
                </ul>   
            </div> 
            <ezt-footer>
                <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                    <b>品项</b><span>{{this.selectedGood.length}}</span>，
                    <b>数量</b><span>{{TotalNum}}</span>，
                    <b>含税金额￥</b><span>{{TotalAmt}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="confirmReceive">提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive">审核</a>   
                </div>  
                </div>
            </ezt-footer>           
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
            'addInitStockInfo':'initStock/addInitStockInfo',//添加采购入库单的单据信息
            'selectedGood':'publicAddGood/selectedGood',//选择物料的物品
        })       
    },
    methods:{
        ...mapActions({
            'setAddInitStockInfo':"initStock/setAddInitStockInfo",
            'setSelectedGood':'publicAddGood/setSelectedGood'
        })
    }
})
export default class InitStock extends Vue{
    private service:InitStockService;
    private addInitStockInfo:any;//store中
    private setAddInitStockInfo:INoopPromise;//store中给addInitStockInfo赋值
    private setSelectedGood:INoopPromise;
    private selectedGood:any[];//store中selectedGood的值
    private isEdit:boolean=false;//物料是否可编辑
    private orderType:any[] = [{//单据类型下拉数据    
      name:"合同采购单",
      type:"q"
    },{
      name:"采购单",
      type:"m"
    }];


    created(){
        this.service=InitStockService.getInstance();
        this.addInitStockInfo.date=new Date().format("yyyy-MM-dd");
        this.addInitStockInfo.warehouse = this.orderType[0].type;
        this.addInitStockInfo.costType= "price";
    }
     //选择物料
    private renderUrl(info:string){
        this.setAddInitStockInfo(this.addInitStockInfo);//将选择的单据信息保存在store中   
        this.$router.push(info);      
    }

    private editStatus(){
        this.isEdit=true;
    }

     /**
     * computed demo
     * 物料总数量
     */
        private get TotalNum(){
        return this.selectedGood.reduce((ori,item)=>{
            return Number(ori)+Number(item.num);       
        },0);
        }
    /**
     * 物料总金额
     */
    private get TotalAmt(){
        return this.selectedGood.reduce((ori,item)=>{
        return ori+(item.num*item.price);       
        },0);
    }
    /**
     * 初始化提交
     */
    private confirmReceive(){
      console.log('确认提交！')
    }



    /**
     * 返回
     */
    private goBack(){
        this.setAddInitStockInfo({});
        this.setSelectedGood([]);
        this.$router.push("/initSet");
    }
}
</script>
<style lang="less" scoped>
//物料信息
.good-detail-content{
    text-align: left;
    margin: 8px 10px;
    padding: 12px 10px 12px 15px;
    background: #FFFFFF;
    border: 1px solid #DDECFD;
    box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
    display: flex;
    flex: row;
    flex-direction: column;   
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
      display:flex;
      flex-direction: row;
    }
    .good-detail-l>div>span{
        padding: 5px 0px;
        align-items: baseline;
    }
    .good-detail-r{
        display: inline-block;
        display:flex;
        .park-input{
            flex:1;
        }
    }
    .good-detail-num{
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #FF885E;
        letter-spacing: 0;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
        display: flex;
        flex:1;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
        flex:1;
    }
    .good-detail-billno,.good-num-t{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
        flex:1;
    }
    .good-num-t{
        display: inline-block;
        text-align: center;
        width: 100%;
    }
    .ezt-detail-good{
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
    }
}
//编辑物品 修改的字段 
.dialog-demo{
    .ezt-dialog-header{
        display:flex;
        justify-content: flex-end;
        padding: 10px;
    }
    .edit-good-list{
        flex-direction: column;
        text-align: center;
        display: inline-block;
        li{
            display:flex;
            // flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #ccc;
            .title-dialog-name{
                flex:inherit;
                padding: 10px 0px;
                font-size: 13px;
                color: #5F7B9A;
            }
            .weui-cell:before{
                border:none;
            }
            select{
                height: 36px;
            }
            .icon-input::before{
                display: inline-block;
                content: "%";
                position: absolute;
                right: 40px;
            }
            .icon-input.price::before{
                content:"￥";
            }
        }
    }
}
//按钮
.mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 20px;
        .ezt-lone-btn{
        display: inline-block;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        padding: 8px 90px;
        margin-bottom: 10px;
        border-radius: 40px;
        background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
        background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
        -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
        box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
}
.costType-info a{
    color: #000;
}
.costType-info a.active{
    color: #1674fc;
}

</style>

