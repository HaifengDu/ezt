  <!--首页的页面-->
<template>
 <div class="ezt-page-con">
    <ezt-header :back="false" custom>       
       <div slot="action">
           <span ref="canlendar">日结</span>
       </div>
       <div slot="title" class="indexPop">
         <span @click="handleSelect">门店1</span>
         <!-- <div class="pop-before" > -->
         
         <!-- </div> -->
         
       </div>
    </ezt-header>
    <div class="header-mine" @click="renderUrl('/mine')">
      <a class="mine-css"></a>
    </div>         
    <div class="ezt-main">
      <div class="header-date">        
        <div class="busiDate">
            <span>{{user.auth.busi_date}}</span>
        </div>
      </div>
       <div class="storeList" v-if="titleSelect">
            <div class="ezt-history">
              <ul>
                  <li>历史记录</li>
              </ul> 
            </div>
            <div class="ezt-checkList">
              <div>搜索</div>
              <ul>
                <li>门店1</li>
                <li>门店2</li>
                <li>门店3</li>
              </ul>
            </div>
          </div>
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
import IUser from "../../interface/IUserModel"
import LoginService from "../../service/LoginService"
import {mapGetters} from "vuex";
import {maskMixin} from "../../helper/maskMixin";
import ErrorMsg from "../model/ErrorMsg"
declare var mobiscroll:any;
@Component({
   components:{
    //  'ezt-header':eztHeader
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
       "user":"user"
     })
   }
})
export default class Index extends Vue{
   private selected = 'index';
   private service:LoginService;
   private user:IUser;
   private titleSelect:boolean=false;
   private newEle:any={};
   private addMaskClickListener:(...args:any[])=>void;
   private showMask:()=>void;
   private hideMask:()=>void;
   private storeList:any[] = [];
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
            // this.hideMask();
            this.titleSelect=false;
          }
      });
      // this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      //   this.titleSelect=!this.titleSelect; 
      //   // this.hideMask();
      // });
    }
    private renderUrl(info:string){
        this.$router.push(info);
    }
    private checkDate(date:string){
      this.service.checkDay(date).then(res=>{
        console.log(res,'res00000')
      },err=>{
        this.$toasted.error(err.message);
      })
    }
    private handleSelect(){
      this.titleSelect=!this.titleSelect; 
      // this.titleSelect?this.showMask():this.hideMask();
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
  .header-date{
    position: relative;
    width: 100%;
    height: 30px;
    background-image: linear-gradient(139deg, #018BFF -11%, #4A39F3 100%);
}
.busiDate {
    /*display: flex;*/
    width: 88px;
    height: 22px;
    justify-content: start;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 16px;
    background: url('../../assets/images/index_date.png') no-repeat;
    background-size: 88px 22px;
    position: absolute;
    bottom:0;
  }

  .busiDate span {
    float: left;
    /*background: #3D94FD;*/
    padding: 3px 10px 3px 10px;
    border-top-right-radius: 11px;
    border-bottom-right-radius: 11px;
  }
  // 顶部下拉
  .storeList{
    width: 100%;
    height: 100%;
    position: absolute;
    top: auto;
    left: 0;
    background: #fff;
    z-index: 3;
    color:#000;
    display:flex;
    flex-direction: row;
  }
  .pop-before{
    z-index: 3;
  }
  .pop-mask{
    z-index: 2;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 45px;
    left: 0;
    background: #000;
    opacity: .2;
  }
  .ezt-history{
    flex:.5;
  }
  .ezt-checkList{
    flex: 1;
  }
  .mine-css{
    display: inline-block;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 10px;
    top: 8px;
    background: url(../../assets/images/user_logo.png) 0 0 no-repeat;
    background-size: 30px 30px;
  }
</style>
