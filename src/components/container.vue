<template>
  <div class="main">
    <x-header :left-options="{showBack: false}" :right-options="{showMore: true}" @on-click-more="showMenus = true">
      最近聊天
    </x-header>
    <router-view></router-view>
    <tabbar>
      <tabbar-item selected link="/chatList">
        <span slot="icon" class="iconfont icon-message"></span>
        <span slot="label">最近聊天</span>
      </tabbar-item>
      <tabbar-item link="/friends">
        <span slot="icon" class="iconfont icon-me"></span>
        <span slot="label">联系人</span>
      </tabbar-item>
      <tabbar-item link="/settings">
        <span slot="icon" class="iconfont icon-setting"></span>
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import { Tabbar, TabbarItem, Icon, XHeader } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      Tabbar, TabbarItem, Icon, XHeader
    },
    computed: {
      ...mapState(['connected', 'clientId'])
    },
    mounted () {
      if (!this.connected) {
        this.$store.commit('connecting')
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/common/style/rem";
  .main {
    flex: 1;
    .iconfont {
      font-size: rem(22);
    }
  }
</style>
