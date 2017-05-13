<template>
  <flexbox class="login" direction="column" justify="center">
    <flexbox-item>
      <flexbox class="brand" justify="center"> iChat </flexbox>
    </flexbox-item>
    <flexbox-item>
      <flexbox class="login-form" justify="center">
        <div class="input-group">
          <input type="text" placeholder="用户名" v-model="username">
          <div class="vux-1px-b"></div>
          <input type="password" placeholder="密码" v-model="password">
        </div>
      </flexbox>
    </flexbox-item>
    <flexbox-item>
      <flexbox class="login-submit" justify="space-between" align="center" direction="row" :gutter="64">
        <flexbox-item>
          <router-link to="/register">
            <x-button>注册</x-button>
          </router-link>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="login">登录</x-button>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
  </flexbox>
</template>
<script>
  import { Group, Cell, Flexbox, FlexboxItem, XButton, Divider } from 'vux'
  import { api } from '@/common/index'

  export default {
    components: { Group, Cell, Flexbox, FlexboxItem, XButton, Divider },
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login () {
        const username = this.username
        const password = this.password
        if (!this.validate()) return
        api.post('/login', {
          username: username,
          password: password
        }).then(data => {
          console.log(data)
          if (data.code === 200) {
            this.$store.commit('connecting', data.data.userId)
            this.$router.push('/')
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: data.error
            })
          }
        }).catch(e =>
          this.$vux.toast.show({
            text: 'Error:' + e,
            type: 'warn'
          })
        )
      },
      validate () {
        if (this.username.trim() === '' || this.password.trim() === '') {
          this.$vux.toast.show({
            text: '请输入用户名和密码',
            type: 'warn',
            width: '12em'
          })
          return false
        }
        return true
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "~@/common/style/rem";

  .login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("~@/assets/spalsh.png");
    background-size: 100% 100%;
  }

  .brand {
    color: #fff;
    text-align: center;
    font-size: rem(38);
    height: 100%;
  }

  .input-group {
    background-color: #fff;
    overflow: hidden;
    padding: rem(5);
    width: 100%;
    border-radius: rem(10);
    input {
      width: 100%;
      height: rem(45);
      text-indent: 1em;
    }
  }

  .login-form, .brand, .login-submit {
    height: 100%;
    padding: 0 rem(60);
  }
</style>
