<template>
    <div class="ezt-page-footer" v-if="isShow">
        <slot name="confirm">
            
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
    
</style>


