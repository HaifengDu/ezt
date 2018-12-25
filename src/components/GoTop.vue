<template>
    <transition name='slide-fade'>
        <div v-show="showTop" class="go-top" @click="backTop">
            <!-- <div></div> -->
            <span><i class="fa fa-chevron-up" aria-hidden="true"></i></span>
        </div>
    </transition>
</template>
<script>
export default {
  name: "go-top",
  props: {
    element: {
      // 滚动元素的节点
      type: [Window, Object, Element],
      default: null
    },
    maxTop: {
      // 最大高度
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      scrollTop: 0,
      showTop: false // 是否显示回到顶部，默认不显示
    };
  },
  watch: {
    element(val) {
      if (val !== null) {
        val.addEventListener("scroll", event => {
          this.handleScroll(event);
        });
      }
    }
  },
  mounted() {},
  methods: {
    // 处理滚动
    handleScroll(event) {
      if (event) {
        console.log(event);

        // TODO 兼容Window对象
        this.scrollTop = (event.srcElement.scrollingElement) ? (event.srcElement.scrollingElement.scrollTop ? event.srcElement.scrollingElement.scrollTop:0):event.srcElement.scrollTop;
      //  this.scrollTop =
      //     event.srcElement.scrollTop || 0;  // :TODO 兼容Window   ?  还去兼容一下吗？在我这边用window测的，那的是后面的结果s
        
        this.showTopWarp();
      }
    },
    showTopWarp() {
      if (this.scrollTop >= this.maxTop) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
    },
    // 回调顶部点击事件
    backTop() {
      if (this.element !== null) {
        let that = this;
        let timer = setInterval(() => {
          let ispeed = Math.floor(-that.scrollTop / 5);
          this.element.scrollTop = document.documentElement.scrollTop = document.body.scrollTop =
            that.scrollTop + ispeed;
          if (that.scrollTop === 0) {
            clearInterval(timer);
          }
        }, 16);
      }
    }
  },
  destroyed() {
    if (this.element !== null) {
      this.element.removeEventListener("scroll", event => {
        this.handleScroll(event);
      });
    }
  }
};
</script>

<style scoped>
.go-top {
  cursor: pointer;
  position: fixed;
  bottom: 55px;
  right: 10px;
  border-radius: 100%;
  padding: 12px;
  text-align: center;
  line-height: 100%;
  background: #fff;
  border: 1px solid #ccc;
}
</style>


