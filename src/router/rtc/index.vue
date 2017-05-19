<template>
  <div class="rtc">
    <flexbox id="mask" justify="center" align="center">
      <!--<input type="button" id="start" @click="start" value="Start Video" />-->
      <!--<input type="button" id="close" @click="close" value="Start Video" />-->
      <!--<span>正在等待对方接听</span>-->
      <span class="vux-close" @click="close"></span>
      <span class="iconfont icon-message" @click.native="start"> {{text}} </span>
    </flexbox>
    <video id="localVideo" autoplay muted ref="localVideo"></video>
    <video id="remoteVideo" autoplay ref="remoteVideo"></video>
  </div>
</template>
<script>
  import { Blur, Flexbox } from 'vux'
  import { mapState } from 'vuex'
  export default {
    components: {
      Blur, Flexbox
    },
    data () {
      return {
        to: this.$route.params.userId
      }
    },
    computed: {
      ...mapState(['callStatus']),
      text () {
        switch (this.callStatus) {
          case 0:
            return '呼叫'
          case 1:
            return '呼叫中'
          case 2:
            return '接听'
        }
      }
    },
    methods: {
      start () {
        const status = this.callStatus
        if (status === 2) {
          // for callee is to accept to be called
          this.$store.commit
        } else {
          // for caller is to confirm to call

        }
      },
      close () {
        this.$router.back()
      }
    },
    mounted () {
      // to show local video
      this.$store.dispatch('presetRTC', {
        localVideo: this.$refs.localVideo,
        to: this.to
      })
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      this.$store.commit('closeRTC')
      next()
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/close.less';

  .vux-close:before, .vux-close:after {
    height: 5px;
    color: #fff;
  }

  .vux-close {
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 36px;
    font-weight: bolder;
  }
</style>
<style lang="scss">
  .rtc {
    flex: 1;
    #localVideo {
      position: fixed;
      right: 0;
      bottom: 0;
      width: 40%;
    }
    #mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(to top right, rgba(43, 40, 50, 0.8) 0%, rgba(83, 86, 99, 0.8) 45%, rgba(69, 77, 91, 0.6) 60%);
    }
  }
</style>
