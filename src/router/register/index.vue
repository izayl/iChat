<template>
  <div class="register">
    <group label-width="5em">
      <x-input title="用户名" v-model="username"/>
      <x-input type="password" title="密码" v-model="password"/>
      <x-input type="password" title="确认密码" v-model="password2"/>
    </group>
    <div class="register-submit">
      <x-button type="primary" @click.native="register">注册</x-button>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, CellBox, XButton, XInput, Flexbox, FlexboxItem } from 'vux'
  import { api } from '@/common/'

  export default {
    components: { Group, Cell, CellBox, XButton, XInput, Flexbox, FlexboxItem },
    data () {
      return {
        username: '',
        password: '',
        password2: ''
      }
    },
    computed: {
      isEqual () {
        return this.password === this.password2
      }
    },
    methods: {
      register () {
        const { username, password } = this
        if (!this.username || !this.password) {
          this.$vux.toast.show({
            type: 'warn',
            text: '用户名或密码<br>未填写'
          })
          return false
        }
        if (!this.isEqual) {
          this.$vux.toast.show({
            type: 'warn',
            text: '密码不一致<br>请重新确认'
          })
          return false
        }
        api.post('/register', {
          username, password
        }).then(res => {
          if (res.code === 200) {
            this.$vux.toast.show({
              text: '注册成功'
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          }
          if (res.code === 401) {
            this.$vux.toast.show({
              type: 'warn',
              text: '用户名已被注册'
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "~@/common/style/rem";

  .register {
    flex: 1;
    background-color: #f0f0f0;
  }

  .register-submit {
    margin-top: rem(15);
    padding: 0 rem(10);
  }
</style>
