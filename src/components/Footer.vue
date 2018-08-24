<template>
    <div class="ezt-page-footer" v-if="isShow">
         <slot name="comfirm">
                
         </slot>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Prop} from "vue-property-decorator"
@Component
export default class Header extends Vue{
    @Prop({
        default:true,
        type:Boolean
    })
    isShow:boolean   

    goBack(){
        this.$router.back();
    }
}
</script>
<style lang="less" scoped>
     .ezt-page-footer {
        height: 50px;
        background: #FFFFFF;
        box-shadow: 0 -1px 3px 0 rgba(204,216,228,0.80);
        position: fixed;
        width: 100%;
        bottom:0;
    }
</style>


