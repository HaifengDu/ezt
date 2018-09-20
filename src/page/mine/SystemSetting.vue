<!-- 系统设置 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="系统设置" @goBack="goBack"></ezt-header>
        <div class="ezt-main">
            <ul class="ezt-setting-content">
                <li>
                    <div class="setting-title-name">订货量与订货周期
                        <span><i class="fa fa-info-circle title-info" aria-hidden="true"></i></span>
                    </div>
                    <span @click="handlerActivea"><b :class="{'active':activea}"></b></span>
                </li>
                <div v-if="activea" class="fold-content">
                   <span>
                       <input v-model="model.orderSelected" value="1" id='a' type="radio" name="order" class="radio">
                        <label name="order" class="radio" for="a">按订货班表订，无班表则按日订</label></span>
                   <span>
                       <input v-model="model.orderSelected" value="2" id='b' type="radio" name="order" class="radio">
                        <label name="order" for="b" class="radio">按订货班表订</label></span>
                   <span>
                        <input v-model="model.orderSelected" value="3" id="c" type="radio" name="order" class="radio">
                        <label name="order" for="c" class="radio">按日订货</label></span>
                   <span>
                       <input v-model="model.orderSelected" value="4" id="d" type="radio" name="order" class="radio">
                       <label name="order" for="d" class="radio">按订货班表订，无班表则按日订</label></span>
                   <span>
                       <input v-model="model.orderSelected" value="5" id="e" type="radio" name="order" class="radio">
                       <label name="order" for="e" class="radio">一次订
                           <input type="number" class="ezt-smart">天的量
                        </label>
                   </span> 
                   <span class="ezt-foot-total">
                        注：订货周期改变将影响要货量计算，如订货周期为2天，即每次订货需订2天的量。   
                    </span>                 
                </div>
                <li class="line-mark">
                    <div>
                        <div class="setting-title-name">预估要货是否计算散装量</div>
                        <span>
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
                <li>
                    <div class="setting-title-name">预估要货是否包含到货当天量</div>
                    <span @click="handlerActiveb"><b :class="{'active':activeb}"></b></span>
                </li>
                <div v-show="activeb" class="fold-content">
                    <span>
                        <input v-model="model.isContain" id="a1" value="1" type="radio" name="contaion" class="radio">
                        <label for="a1" class="radio" name="contaion"> 不包含</label>   
                    </span>
                   <span>
                       <input v-model="model.isContain" id="b1" value="2" type="radio" name="contaion" class="radio">
                       <label for="b1" class="radio" name="contaion">包含</label>
                    </span>
                   <span>
                       <input v-model="model.isContain" id="c1" value="3" type="radio" name="contaion" class="radio">
                        <label for="c1" class="radio" name="contaion">到货时间≤
                            <span class="title-select-name item-select">
                                <select name="" id="" class="ezt-select">
                                    <option :value="item" :key="item" v-for="(item) in hours">{{item}}</option>
                                </select>
                           </span>：
                           <span class="title-select-name item-select">
                                <select name="" id="" class="ezt-select">
                                    <option :value="item" :key="item" v-for="(item) in minutes">{{item}}</option>
                                </select>
                           </span>
                           时，包含当天量
                        </label>      
                   </span>
                    <span class="ezt-foot-total">
                        注：选择包含到货当天量，则引用的预估物料明细中，需包含到货当天的物料量。   
                    </span>    
                </div>
            </ul>
            <div class="mine-bot-btn" @click="saveSetting">
             <span class="ezt-lone-btn">确定</span>
           </div>

        </div>
        
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
declare var mobiscroll:any;//全局定义日历
@Component({

})
export default class Index extends Vue{
    private activea:boolean = false;
    private activeb:boolean = false;
    private hour:number;
    private minute:number;
    private hours:any[]=[
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
    ];
    private minutes:any[]=[
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,
        40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60
    ]
    private model:any={
        orderSelected : '1',
        bulkQuantity: 0,
        isContain:'1'
    
    };


    mounted(){     
    //   //日历
    //   mobiscroll.date(this.$refs.canlendar, {
    //       theme: 'material', 
    //       display: 'bottom',
    //       lang: 'zh',
    //       timeWheels: "|h:ii A|",
    //       timeFormat:'hh:ii A',         
    //       onSet: (val:{
    //           valueText:string
    //       })=>{
          
    //       },
    //   });
    }

    private handlerActivea(){
        this.activea=!this.activea;
    }
    private handlerActiveb(){
        this.activeb=!this.activeb;
    }
    /**
     * 保存设置
     */
    private saveSetting(){
        this.$toasted.success("更新设置成功！");
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
            flex:1           
        }
        .title-info{
            color: green;
            font-size: 20px;
            vertical-align: middle;
        }      
    }
    li:nth-child(1){
        border-top: 1px solid #ccc;
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
        span{
            margin: 6px 0px;
        }
        input[type='radio']{
            vertical-align: bottom;
            display:none;
        }
        label{
            background: url('../../assets/images/btn_ck_n_checked.png') no-repeat;
            background-size: 20px;
            padding-left: 30px;
        }
        input[type='radio'].radio:checked + .radio {
            background:url('../../assets/images/btn_ck_checked.png') no-repeat;
            background-size: 20px;
        }
        .ezt-smart{
            border: 1px solid #ccc;
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
</style>


