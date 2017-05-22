<template>
  <div class="rtc">
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
        token: this.$route.params.token
      }
    },
    computed: {
      ...mapState(['callStatus', 'rtcMsg', 'callerId'])
    },
    methods: {
      close () {
        this.$router.back()
      }
    },
    mounted () {
      this.$store.commit('create or join', this.token)
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
