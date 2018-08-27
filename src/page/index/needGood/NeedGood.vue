<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="要货">
       <div slot="action">
           <span>要货</span>
       </div>
    </ezt-header>    
    <div class="ezt-main">   
         <div :key="index" v-for="(item,index) in psList">{{item.name}}</div>          
      </div>    
    </div>
</template>  

<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import NeedGoodService from '../../../service/NeedGoodService'
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
declare var mobiscroll:any;
@Component({
   components:{  
  
   },   
   computed:{
     ...mapGetters({
       'psList':'needGood/psList'
     }) 
   },
   methods:{
     ...mapActions({
       'getPsList':'needGood/getPsList'
     })
   }   
})
export default class NeedGood extends Vue{
    private service: NeedGoodService;
    private pager:Pager;   
    private getPsList:INoopPromise
    // private updateUser:INoop;
    private list:any[] = [];
    private psList:any[];

    created() {
      //  this.pager = new Pager()
      //  this.service = NeedGoodService.getInstance();
      //  this.getPsList();
    }

    mounted(){
      this.getPsList();
    }

  /**
   * watch demo
   */
    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }

/**
 * computed demo
 */
    private get Total(){
      return this.list.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
    }

    // private getPsList(){
    //     this.service.getPsList(this.pager.getPage()).then(res=>{
    //        this.list = res.data.data;
    //        this.pager.setNext();
    //     },err=>{
    //         this.$toasted.show(err.message);
    //     });

    //     this.pager.setLimit(20);
    // }
      
}
</script>

<style lang="less" scoped> 
.requiregoods{
    position: absolute;
    left:0;
    top:0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
     .query{
        width: 100%;
        height: 150px;
        background-color: #fff;
        .distribution {
            font-size: 14px;
            color: #5F7B9A;
            margin-right: 5px;
            display: block;
            width: 200px;
            height: 40px;
            text-align: right;
        }
        .icon-bottom {
          width: 15px;
          height: 15px;
          background: url('../../../assets/images/icon-trunright.png') no-repeat;
          background-size: 16px 15px;
          transform:rotate(90deg);
        }
      }
      .Wayofdelivery{
          background-color: #F1F6FF;
          flex: 1;
          width: 100%;
          .order {
            height: 50px;
            text-align: center;
            display: flex;
            margin-top: 50px;
            span{
              flex-direction:column;
            }
            .line {
              display: inline-block;
              flex: 2;
              border-top: 1px solid #C1CFDE ;
            }
            .txt {
                color: #95A7BA;
                vertical-align: middle;
                line-height: 5px;
                width: 88px;
              }
          }
          .button{
            display: flex;
            flex-direction: column;
            align-items: center;
            .templateimport{
              margin-bottom: 25px;
            }
            .templateimport,.manualproduction{
              background-color: #fff;
              width: 90%;
              height: 50px;
              line-height: 50px;
              border-radius:25px;
              color: #1188FC;
              font-size: 16px;
              cursor: pointer;
            }
          }
        }
  }

</style>
