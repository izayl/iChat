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
  </div>
</template>
<script>
  import { Search } from 'vux'
  import debounce from 'lodash/debounce'
  import { mapState } from 'vuex'

  export default {
    components: { Search },
    data () {
      return {
        value: ''
      }
    },
    computed: {
      ...mapState(['searchList'])
    },
    methods: {
      resultClick (item) {
//        window.alert('you click the result item: ' + JSON.stringify(item))
        console.log(item)
        if (!item.id) return
        this.vaule = ''
        this.$refs.search.cancel()
        this.$store.commit('addFriend', {
          username: item.title,
          userId: item.id
        })
        this.$router.push('/user/' + item.id)
      },
      getResult (val) {
        const _this = this
        return debounce(() =>
          _this.$store.dispatch('search', val), 500)()
      }
    }
  }
</script>
