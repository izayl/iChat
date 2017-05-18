<template>
  <div class="main">
    <x-header :left-options="{showBack: false}" @on-click-more="showMenus = true">
      {{title}}
    </x-header>
    <router-view></router-view>
    <keep-alive>
      <tabbar>
        <tabbar-item :selected="page === '/chatList'" link="/chatList">
          <span slot="icon" class="iconfont icon-message"></span>
          <span slot="label">最近聊天</span>
        </tabbar-item>
        <tabbar-item :selected="page === '/friends'" link="/friends">
          <span slot="icon" class="iconfont icon-me"></span>
          <span slot="label">联系人</span>
        </tabbar-item>
        <tabbar-item :selected="page === '/settings'" link="/settings">
          <span slot="icon" class="iconfont icon-setting"></span>
          <span slot="label">设置</span>
        </tabbar-item>
      </tabbar>
    </keep-alive>
  </div>
</template>
<script>
  import { Tabbar, TabbarItem, Icon, XHeader } from 'vux'
  import { mapState } from 'vuex'

  const titleMap = {
    '/chatList': '最近聊天',
    '/friends': '联系人',
    '/settings': '设置'
  }

  export default {
    components: {
      Tabbar, TabbarItem, Icon, XHeader
    },
    computed: {
      ...mapState(['connected', 'clientId', 'page']),
      title () {
        return titleMap[this.page]
      }
    },
    mounted () {
      if (!this.connected) {
        this.$store.commit('connecting')
      }
      this.$store.commit('changePage', this.$route.path)
    },
    beforeRouteUpdate (to, from, next) {
      this.$store.commit('changePage', to.path)
      next()
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
