  <!--首页的页面-->
<template>
 <div class="ezt-page-con">
    <ezt-header :back="false" title="首页">
       <div slot="action">
           <span ref="canlendar">日结</span>
       </div>
    </ezt-header>    
    <div class="ezt-main">
        <ul class="icon-menu"><!--主页内容菜单-->
            <li @click="renderUrl('/needGood')">
                <div class="yaohuo"></div>
                <span>要货</span></li>
            <li @click="noAction()">
                <div class="jiadan"></div>
                <span>加单</span></li>
            <li @click="renderUrl('/receiveGood')">
                <div class="shouhuo"></div>
                <span>收货</span></li>
            <li @click="renderUrl('/returnGood')">
                <div class="tuihuo"></div>
                <span>退货</span></li>
            <li @click="renderUrl('/stocktaking')">
                <div class="panku"></div>
                <span>盘库</span></li>
        </ul>
        <!--内容-->
        
    </div>
  </div>

</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
declare var mobiscroll:any;
@Component({
   components:{
    //  'ezt-header':eztHeader
   }
})
export default class Index extends Vue{
   private selected:String = 'index';
    created() {
        console.log(this.selected,'selected')
    }
    mounted(){
        //日历
        mobiscroll.date(this.$refs.canlendar, {
            theme: 'material', 
            display: 'bottom',
            lang: 'zh',
            dateFormat:'yyyy-mm-dd',
            onSet: function(val:string){
                console.log(val,'99')
            }
        });
    }
    private renderUrl(info:string){
        this.$router.push(info);
    }
   
}
</script>

<style lang="less" scoped> 
   .icon-menu {
    padding: 10px 0px 20px 0px;
    /*display: -webkit-flex;*/

  }
  .icon-menu li {
    width: 33%;
    float: left;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    border-right: 1px solid #E1ECFF;
    border-bottom: 1px solid #E1ECFF;
  }

  .icon-menu li:nth-child(3) {
    border-right: none;
  }

  .icon-menu .yaohuo, .shouhuo, .tuihuo, .panku, .jiadan {
    width: 64px;
    height: 64px;
    display: inline-block;
  }

  .icon-menu .yaohuo {
    background: url(../../assets/images/icon-yaohuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .shouhuo {
    background: url(../../assets/images/icon-shouhuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .tuihuo {
    background: url(../../assets/images/icon-tuihuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .panku {
    background: url(../../assets/images/icon-panku.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .jiadan {
    background: url(../../assets/images/icon-jiadan.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu span {
    margin: 10px 0px;
    font-size: 12px;
    color: #395778;
  }
</style>
