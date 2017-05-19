<template>
  <div class="rtc">
    <!--TODO: Add Close Button-->
    <flexbox id="mask" justify="center" align="center">
      <!--<input type="button" id="start" @click="start" value="Start Video" />-->
      <!--<input type="button" id="close" @click="close" value="Start Video" />-->
        <!--<span>正在等待对方接听</span>-->
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
        if (status === 0) {
          // Call
          this.$store.commit('startRTC', {
            isCaller: true,
            remoteVideo: this.$refs.remoteVideo
          })
        } else if (status === 2) {
          // response
          this.$store.dispatch('presetRTC', {
            localVideo: this.$refs.localVideo,
            to: this.to
          })
        }
      },
      close () {
        this.$store.commit('closeRTC')
      }
    },
    mounted () {
      if (this.callStatus === 0) {
        this.$store.dispatch('presetRTC', {
          localVideo: this.$refs.localVideo,
          to: this.to
        })
      }
    }
  }
</script>
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
