<template>
  <div class="friends">
    <search
      @result-click="resultClick"
      @on-change="getResult"
      :results="searchList"
      v-model="value"
      position="absolute"
      auto-scroll-to-top top="46px"
      ref="search"></search>


    <div v-transfer-dom>
      <popup v-model="show" height="260px" is-transparent>
        <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
          <group>
            <cell :title="selectedUser.username" :inline-desc="selectedUser.desc">
              <i slot="icon" class="icon avatar" style="margin-right: 10px;" v-html="selectedUser.avatar"></i>
            </cell>
          </group>
          <div style="padding:20px 15px;">
            <x-button type="primary" @click.native="onAdd">添加好友</x-button>
            <x-button @click.native="onCancel">取消</x-button>
          </div>
        </div>
      </popup>
    </div>


    <group>
      <template v-for="friend in friends">
        <cell :title="friend.username" :inline-desc="friend.desc">
          <i slot="icon" class="icon avatar" style="margin-right: 10px;" v-html="friend.avatar"></i>
        </cell>
      </template>
    </group>
  </div>
</template>
<script>
  import { Search, Popup, TransferDom, Group, Cell, XButton } from 'vux'
  import debounce from 'lodash/debounce'
  import { mapState } from 'vuex'

  export default {
    components: { Search, Popup, Group, Cell, XButton },
    directives: {
      TransferDom
    },
    data () {
      return {
        value: '',
        show: false,
        selectedUser: {}
      }
    },
    computed: {
      ...mapState(['searchList', 'friends'])
    },
    methods: {
      resultClick (item) {
        this.show = true
        this.selectedUser = {
          userId: item.userId,
          username: item.username,
          desc: item.desc,
          avatar: item.avatar
        }
        return
//        console.log(item)
//        if (!item.id) return
//        this.vaule = ''
//        this.$refs.search.cancel()
//        this.$store.commit('addFriend', {
//          username: item.title,
//          userId: item.id
//        })
//        this.$router.push('/user/' + item.id)
      },
      getResult (val) {
        const _this = this
        return debounce(() =>
          _this.$store.dispatch('search', val), 500)()
      },
      onCancel () {
        this.show = false
        this.$refs.search.setFocus()
      },
      onAdd () {
        const selectedUser = this.selectedUser
        if (!selectedUser.userId) return
        this.$refs.search.cancel()
        this.$store.dispatch('addFriend', selectedUser)
          .then(res => this.$vux.toast.show({
            type: 'success',
            text: '添加成功'
          }))
          .then(this.onCancel())
          .catch(e => this.$vux.toast.show({
            type: 'warn',
            text: '添加失败<br>' + e
          }))
      }
    }
  }
</script>
