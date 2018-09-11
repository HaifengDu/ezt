<!--选择盘点货品-->
<template>
<div>
   <div class="ezt-page-con selectinginventory">
    <ezt-header :back="true" title="选择盘点货品"  @goBack="goBack">
       <div slot="action">
           <div class="addbtn">
             <i @click="query" class="fa fa-search" aria-hidden="true"></i>
          </div>
       </div>        
    </ezt-header>   
    <div class="ezt-main">   
      <div class="content">
          <div class="collection">
              <div class="left">
                <p>收藏 | 成品</p>
              </div>
              <div class="right">
                <ul>
                  <li>非食原材料</li>
                  <li>非食原材料</li>
                  <li>非食原材料</li>
                  <li>非食原材料</li>
                </ul>
              </div>
          </div>
           <div class="sort">
               <div class="left">
                  <ul>
                   <li>非食原材料</li>
                   <li>非食原材料</li>
                   <li>非食原材料</li>
                   <li>非食原材料</li>
                 </ul> 
               </div>
               <div class="right">
                  <ul>
                   <li>
                     <p>鱼成品 <span>12元/KG(箱)</span></p>
                     <div>
                       <span>备</span>
                       <rater v-model="data3" :max='1'></rater>
                       <inline-x-number style="display:block;" :min="0" width="50px" button-style="round"></inline-x-number>
                     </div>
                   </li>
                  
                 </ul> 
               </div>
           </div>
            <div class="temporary" slot="confirm">
              <div class="button">
                <div class="storage">
                  已选货品
                  <span>1</span>
                </div>
                <div class="sub">去提交</div>
              </div>
          </div>  
        </div>
      </div>    
    </div> 
    <!-- 搜索  -->
    <div>
      <transition :name="sildename" v-show="search">
         <div class="search">
            wdjwjdlwjdlwjefdjweflwjefljwelfjlwef
            wdjwjdlwjdlwjefdjweflwjefljwelfjlwef
            wdjwjdlwjdlwjefdjweflwjefljwelfjlwefwdjwjdlwjdlwjefdjweflwjefljwelfjlwefwdjwjdlwjdlwjefdjweflwjefljwelfjlwefwdjwjdlwjdlwjefdjweflwjefljwelfjlwef
         </div>
      </transition>
    </div>   
</div> 
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import LibraryDetailService from '../../../service/LibraryDetailService'
import '../../../assets/css/transition.css'
@Component({  
   components:{  
      
   },   
    computed:{
     ...mapGetters({
       'inventoryDetails':'libraryDetails/inventoryDetails'
     }) 
   },
   methods:{ 
     ...mapActions({
       'getInventoryDetails':'libraryDetails/getInventoryDetails'
     })

   }   
})  
export default class selectinginventory extends Vue{
    private service: LibraryDetailService;
    private list:any[] = [];
    private getInventoryDetails:INoopPromise;
    private inventoryList:any[] = [];
    private search:boolean = false;
    private data3:string =  '1';
    private sildename:string = 'slide-go';
    created() {
      this.service = LibraryDetailService.getInstance();
    }

    mounted(){
      this.getInventoryDetails();
    }

  /**
   * watch demo    
   */
    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }
    private goBack(){
      this.$router.back();
    }

    /**
     * computed demo
     */
      private get Total(){
        return this.list.reduce((ori,item)=>{
          return ori.uprice+item;
        },0);
      }

      private query(){
         console.log("qwdqwfqwf")
         this.search = true
      }



      

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.selectinginventory{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: @width;
    height: @height;
    .content{
      width: @width;
      height:@height;
      display: flex;
      align-items: center;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;
      background-color: @background-color;
      .collection{
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #f1f1f1;
         .left{
           display: flex;
           p{
             width: 100px;

           }
         }
         .right{
           flex: 1;
           overflow-x:  scroll;
           ul{
               display: flex;
               align-items: center;
               li{
                 justify-content: flex-start;
                 width: 116px;
                 cursor: pointer;
               }
           }
         }
      }
      .sort{
        display: flex;
        flex-direction: row;
        width: @width;
        height: @height;
        justify-content: space-between;
        .left{
          width: 90px;
          border-right: 1px solid #ccc;
          ul{
            
            li{
              height: 35px;
              line-height: 35px;
              cursor: pointer;
              border-bottom: 1px solid #f1f1f1;
            }
          }
        }
        .right{
          flex: 1;
          ul{

            li{
              height: 70px;
              display: flex;
              flex-direction: column;
              text-align: left;
              margin:15px 0 0 5px;
              border-bottom: 1px solid #ccc;
              p{
                margin-bottom: 10px;
              }
              div{
                display: flex;
                flex-direction: row;
                margin-right: 20px;
                span{
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
       .temporary{
        width: 104%;
        position: fixed;
        bottom: -1px;
        .button{
          display: flex;
          flex-direction: row;
          height: 50px;
          line-height: 50px;
          justify-content: space-around;
          font-size: 15px;
          color: #FFFFFF; 
          .storage{
             flex: 1;
             cursor: pointer;
             background-color:red;
             position: relative;
             span{
              position: absolute;
              background-color: #fff;
              border-radius: 10px;
              width: 20px;
              height: 20px;
              line-height: 20px;
              color: #000;
              font-size: 10px;
              top: 10px;
             }
          }
          .sub{
             width:100px;
             cursor: pointer;
             background-color: #1188FC;
          }
        }
      }
   }
}
// 搜索页面
.search{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color:#ccc;
    z-index: 99;


}
</style>


