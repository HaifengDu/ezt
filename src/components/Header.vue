<template>
    <div class="ezt-header" >
        <span class="ezt-header-goback" :class=[{none:!back}] @click="goBack"></span>
        <span class="ezt-header-title">{{title}}</span>
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
        type:String,
        required:true
    })
    title:string;

    goBack(){
        this.$router.back();
    }
}
</script>

