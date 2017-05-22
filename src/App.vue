<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'app',
    computed: {
      ...mapState(['callStatus', 'callerId', 'global', 'connected', 'userId', 'showVideo', 'callToken'])
    },
    watch: {
      callStatus: function (val) {
        console.log('status changed ' + val)
        if (val === 2) {
          const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
          this.$vux.confirm.show({
            title: '用户id：' + _this.callerId + ' 向你发起视频',
            content: '是否接听',
            onShow () {
              console.log('plugin show')
            },
            onHide () {
              console.log('plugin hide')
            },
            // 组件除show外的属性
            onCancel () {
              _this.$store.commit('cancelVideo')
              _this.$store.commit('resetCallStatus')
            },
            onConfirm () {
              _this.$router.push('/rtc/' + _this.callToken)
            }
          })
        }
      },
      global: function (val) {
        if (val) {
          this.$vux.toast.show({
            type: 'text',
            text: val
          })
        }
      }
    },
    mounted () {
      if (this.userId && !this.connected) {
        this.$store.commit('connecting')
        this.$store.commit('changePage', this.$route.path)
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100vh;
    max-height: 100vh;
    display: flex;
  }

  * {
    box-sizing: border-box;
  }
</style>
