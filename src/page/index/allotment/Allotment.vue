<!--调拨-->
<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="店内调拨" @goBack="goBack" :isInfoGoback="true">

        </ezt-header>
    </div>
    
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from "vue-property-decorator";
import Pager from "../../../common/Pager";
import { TabItem, LoadingPlugin } from "vux";
import { mapActions, mapGetters } from "vuex";
import { maskMixin } from "../../../helper/maskMixin";
import { INoop, INoopPromise } from "../../../helper/methods";
import { TabList } from "../../../common/ITab";
import { CachePocily } from "../../../common/Cache";
import {ECache} from '../../../enum/ECache';
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    components: {
        TabItem
    },
    mixins: [maskMixin],
})
export default class allotment extends Vue{
    goBack(){
        this.$router.push('/');
    }
    
}
</script>
<style lang="less" scoped>

</style>


