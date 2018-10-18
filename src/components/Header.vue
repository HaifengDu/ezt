<template>
    <div class="ezt-header" >
        <span class="ezt-header-goback" :class=[{none:!back}] @click="goBack" ></span>
        <span class="ezt-header-title" v-if="!custom">{{title}}</span>
        <span class="ezt-header-title" v-if="custom">
            <slot name="title">
                
            </slot>
        </span>
        <div class="ezt-header-action" ref="canlendar">
            <slot name="action">
                
            </slot>
        </div>       
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
    back:boolean

    @Prop({
        type:String
    })
    title:string;

    @Prop({
        type:Boolean,
        default:false
    })
    custom:boolean;

    @Prop({
        type:Boolean,
        default: false
    })
    isInfoGoback:boolean;

    goBack(){
        if(this.isInfoGoback){
            this.$emit('goBack');
        }else{
            this.$router.back();
        }
    }
}
</script>
<style lang="less" scoped>

</style>


