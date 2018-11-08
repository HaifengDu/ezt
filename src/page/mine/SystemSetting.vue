<!-- 系统设置 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="系统设置" @goBack="goBack"></ezt-header>
        <div class="ezt-main">
            <ul class="ezt-setting-content">
                <li @click="handlerActivea">
                    <div class="setting-title-name">订货量与订货周期
                        <!-- <span><i class="fa fa-info-circle title-info" aria-hidden="true"></i></span> -->
                    </div>
                    <span><b :class="{'active':activea}"></b></span>
                </li>
                <ul v-if="activea" class="fold-content">
                   <li>
                        <label for="a">
                            <span class="opt-text">按订货班表订，无班表则按日订</span>
                            <input type="radio" name="order" id="a" value="1" v-model="model.orderSelected" />
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                   <li>
                       <label for="b">
                            <span class="opt-text">按订货班表订</span>
                            <input type="radio" name="order" id="b" value="2" v-model="model.orderSelected" />
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                   <li>
                       <label for="c">
                            <span class="opt-text">按日订货</span>
                            <input type="radio" name="order" id="c" value="3" v-model="model.orderSelected" />
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>            
                   <li>
                        <label for="e">
                            <span class="opt-text">
                                一次订
                                <input type="text" class="ezt-smart" :class="{'disabled':model.orderSelected!='4'}" :min="0" :disabled="model.orderSelected!='4'"
                                 v-model="model.orderDate" @change="pubChange(model,'orderDate')">天的量
                            </span>
                            <input type="radio" name="order" id="e" value="4" v-model="model.orderSelected" />
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                   </li> 
                   <li class="ezt-foot-total">
                        注：订货周期改变将影响要货量计算，如订货周期为2天，即每次订货需订2天的量。   
                    </li>                 
                </ul>
                <li class="line-mark">
                    <div>
                        <div class="setting-title-name">预估要货是否计算散装量</div>
                        <span class="setting-tab">
                            <button-tab v-model="model.bulkQuantity">
                                <button-tab-item>否</button-tab-item>
                                <button-tab-item>是</button-tab-item>
                            </button-tab>
                        </span> 
                    </div>
                    <div>
                        <span class="ezt-foot-total">
                            注：选择计算散装量，则将计算现有散装库存量，需考虑安全库存、在途库存。否则按整装量采购。   
                        </span>  
                    </div>
                                      
                </li>
                <li @click="handlerActiveb">
                    <div class="setting-title-name">预估要货是否包含到货当天量</div>
                    <span><b :class="{'active':activeb}"></b></span>
                </li>
                <ul v-show="activeb" class="fold-content">
                    <li>
                        <label for="a1">
                            <span class="opt-text">不包含</span>
                            <input type="radio" name="contaion" id="a1" value="1" v-model="model.isContain" />
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                    </li>
                   <li>
                       <label for="b1">
                            <span class="opt-text">包含</span>
                            <input type="radio" id="b1" name="contaion" value="2" v-model="model.isContain"/>
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                    </li>
                   <li>
                        <label for="c1">
                            <span class="opt-text">
                                到货时间≤
                                <i class="title-select-name item-select">
                                    <select class="ezt-select" :class="{'disabled':model.isContain!='3'}" v-model="containTime.newHour" :disabled="model.isContain!='3'">
                                        <option :value="item" :key="item" v-for="(item) in hours">{{item}}</option>
                                    </select>
                                </i>：
                                <i class="title-select-name item-select">
                                    <select class="ezt-select" :class="{'disabled':model.isContain!='3'}" v-model="containTime.newMinut" :disabled="model.isContain!='3'">
                                        <option :value="item" :key="item" v-for="(item) in minutes">{{item}}</option>
                                    </select>
                                </i>
                                时，包含当天量
                            </span>
                            <input type="radio" id="c1" name="contaion" value="3" v-model="model.isContain"/>
                            <div class="option"></div><!--该div盛放的是优化后的按钮图片-->                            
                        </label>
                   </li>
                    <li class="ezt-foot-total">
                        注：选择包含到货当天量，则引用的预估物料明细中，需包含到货当天的物料量。   
                    </li>    
                </ul>
            </ul>
            <div class="mine-bot-btn" @click="saveSetting">
             <span class="ezt-lone-btn">确定</span>
           </div>

        </div>
        
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {mapActions,mapGetters} from 'vuex'
import { INoop, INoopPromise } from '../../helper/methods';
import ObjectHelper from '../../common/objectHelper'
import {Component} from "vue-property-decorator";
import commonService from '../../service/commonService.js';
declare var mobiscroll:any;//全局定义日历
@Component({
    computed:{
        ...mapGetters({
            systemParamSetting:"systemParamSetting"
        }),       
    },
    methods:{
        ...mapActions({
            setSystemParam:'setSystemParam'
        })
    }
})
export default class Index extends Vue{
    private activea:boolean = false;
    private activeb:boolean = false;
    private systemParamSetting:any;//store中selectedGood的值
    private setSystemParam:INoopPromise;
    private hour:number;
    private minute:number;
    private oldValue = 0;
    private containTime:any={};
    private hours:any[]=[];
    private minutes:any[]=[]
    private model:any={
        // orderSelected : '1',
        // bulkQuantity: 0,
        // isContain:'1'    
    };


    mounted(){     
        this.hours = commonService.getHours();
        this.minutes = commonService.getMinutes();        
        this.checkTime();
    }
    created(){
        if(JSON.stringify(this.systemParamSetting)=='{}'){
            this.setSystemParam({
                orderSelected : '1',
                bulkQuantity: 0,
                isContain:'1'
            })
        }       
        this.model=ObjectHelper.serialize(this.systemParamSetting);
    }

    private handlerFocus(item:any,name:any,val:any){
        // @focus="handlerFocus(model,'orderSelected','5')"
        item[name]=val;
    }
    private handlerActivea(){
        this.activea=!this.activea;
    }
    private handlerActiveb(){
        this.activeb=!this.activeb;
    }
    //预估订货单
    private checkTime(){
        if(this.model.isContain=='3'){
            if(this.systemParamSetting&&this.systemParamSetting.containTime){
                let str = this.systemParamSetting.containTime;
                this.containTime.newHour=Number(str.substring(0,str.indexOf(":")));
                this.containTime.newMinut=Number(str.substring(str.indexOf(":")+1,str.length));
            }else{
                this.$set(this.systemParamSetting,'containTime',"0:0");
                this.containTime.newHour = 0;
                this.containTime.newMinut = 0;
            }
           
        }else{
            this.containTime.newHour = 0;
            this.containTime.newMinut = 0;
        }
    }
    // 价格\税率\税额 修改的时候
    private pubChange(item:any,info:any){
        if(item[info]==""){
            item[info]=0;
        }
        if(!isNaN(item[info])){
        this.oldValue = item[info];//是一个数
        }else{
        item[info] = this.oldValue||0;
        }
        item[info] = parseInt(item[info]);
    }
    /**
     * 保存设置
     */
    private saveSetting(){
        // ObjectHelper.merge(this.systemParamSetting,this.model,true);
        if(this.model.isContain==3){
            this.$set(this.model,'containTime',this.containTime.newHour+":"+this.containTime.newMinut)
        }
        this.setSystemParam(this.model);

        this.$toasted.success("更新设置成功！");
        this.$router.push('/mine');
    }
    private goBack(){        
        this.$router.push('/mine');
    }
    
}
</script>
<style lang="less" scoped>
.ezt-main{
    text-align: left;
}
.mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 20px;
    display:flex;
    justify-content: center;
    .ezt-lone-btn{
      display: inline-block;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      padding: 10px 130px;
      border-radius: 40px;
      background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
      background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
      -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
      box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
}
.ezt-setting-content{
    li{
        background: #fff;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        display: flex;
        flex:1;
         span>b{
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('../../assets/images/icon-trunright.png') no-repeat;
            background-size: 16px 16px;
        }
        span>b.active{
            transform: rotate(90deg);
        }
        .setting-title-name{
            flex:1 ;  
            font-size: 14px;
            color: #395778;
            font-weight: 600;
        }
        .setting-tab{
            margin-bottom: 8px;
        }
        .title-info{
            color: green;
            font-size: 20px;
            vertical-align: middle;
        }      
    }
    li.line-mark{
        flex-direction: column;
        div{
            display:flex;
            flex-direction: row;
            align-items: center;
        }
    }
    .fold-content{
        background: #fff;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #ccc;
        padding: 8px;
        font-size: 12px;
        color: #395778;       
        li{
            padding: 6px 6px;
            border-bottom: 1px dotted #ece9e9;
        }
        li:last-child{
            border:none;
        }
        label {                 /*设置label的样式*/
            width: 100%;
            display: block;
            position: relative;
            font-weight: normal;
        }
        .ezt-smart{
            border: 1px solid #ccc;
        }
        input.disabled{
            background: #ccc;
        }
        .option {      /*把优化后的按钮图片设置为该div的背景图片，把该div定位到原生样式的上方，遮盖住原生样式。*/
            width: 22px;
            height: 22px;
            position: absolute;
            top: 0px;
            right: 0px;
            background-size: cover;
            background: url(../../assets/images/btn_ck_n_checked.png) no-repeat;
            background-size: cover;
        }
        input[type="radio"] {  /*为了保险起见，把原生样式隐藏掉*/
            display: inline-block ;
            margin-right: 15px ;
            opacity: 0 ;
            height: auto;
        }
        input[type="radio"]:checked+div {  /*当radiuo被选中时，把input下边的div标签的背景图片替换掉*/
            background: url(../../assets/images/btn_ck_checked.png) no-repeat;
            background-size: cover;
        }

    }
    .vux-button-group > a{
        padding: 0px 10px;
    }  
  
}
.ezt-foot-total{
    height: inherit;
    text-align: left;
    display: inline-block;
    background:none;
    color: #96958c;
}
.item-select{
    width: 40px;
    position: relative;
    border:1px solid #ccc;
    // background:pink;
    display:inline-block
}
.item-select::after{
    right: 8px;
}
.ezt-select{  
    height: 19px;
    padding: 0px 20px 0px 3px;
    max-width: 100%;
    width: inherit;
}
.ezt-select.disabled{
    background: #ccc;
}
</style>


