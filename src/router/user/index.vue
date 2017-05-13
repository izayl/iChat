<template>
  <div class="user">
    <x-header @on-click-back="back" style="position: fixed;left:0;right:0">{{username}}</x-header>
    <div class="chat-content">
      <div class="chat-item" v-for="message in messages">
        <flexbox>
          <flexbox-item :span="1/5" class="chat-thumb" :style="{'order': message.fromUser === userId ? 1 : 0}">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="
              alt="">
          </flexbox-item>
          <flexbox-item :span="4/5">
            <div class="chat-message">
              <flexbox direction="column" :align="message.fromUser === userId ? 'flex-end' : 'flex-start' ">
                <time-ago class="chat-message__time" :since="message.time" :max-time="86400 * 8"
                          :auto-update="60"></time-ago>
                <div class="chat-message__content">
                  <p>{{message.content}}</p>
                </div>
              </flexbox>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div id="hook"></div>
    </div>
    <div class="chat-input vux-1px-t">
      <flexbox>
        <flexbox-item style="flex-grow: 1; text-align: center">
          <span class="iconfont icon-microphone"></span>
        </flexbox-item>
        <flexbox-item style="flex-grow: 5;">
          <textarea rows="1" ref="textarea" v-model="message" autofocus/>
        </flexbox-item>
        <flexbox-item style="flex-grow: 1.2;text-align: center">
          <!--<span class="iconfont icon-no"></span>-->
          <x-button type="primary" mini @click.native="send" style="white-space: nowrap">发送</x-button>
        </flexbox-item>
      </flexbox>

    </div>
  </div>
</template>
<script>
  import { XHeader, Flexbox, FlexboxItem, XTextarea, Group, XButton } from 'vux'
  import Autosize from 'autosize'
  import { mapState } from 'vuex'
  export default {
    components: { XHeader, Flexbox, FlexboxItem, XTextarea, Group, XButton },
    data () {
      return {
        friendId: this.$route.params.userId,
        message: ''
      }
    },
    computed: mapState({
      messages: function (state) {
        console.log(state.chatStorage[this.friendId])
        return state.chatStorage[this.friendId] || {}
      },
      username: function (state) {
        return state.friends[this.friendId]
      },
      userId (state) {
        return state.userId
      }
    }),
    methods: {
      back () {
        this.$route.replace('/chatList')
      },
      send () {
        this.$store.commit('sendMessage', {
          toUser: this.friendId,
          content: this.message
        })
        this.message = ''
        Autosize(this.$refs.textarea)
        this.$refs.textarea.focus()
      }
    },
    watch: {
      messages: {
        handler () {
          console.log('true')
          this.$scrollTo('#hook', {
            easing: 'ease-in'
          })
        },
        deep: true
      }
    },
    mounted () {
      this.$refs.textarea.focus()
      this.$nextTick(() => {
        Autosize(this.$refs.textarea)
      })
    }
  }
</script>
<style lang="scss">
  @import "~@/common/style/rem";

  .user {
    flex: 1;
  }

  .chat-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 5px;
    background-color: #fff;
    textarea {
      width: 100%;
      margin-top: 10px;
      max-height: rem(100);
      padding: rem(8);
      font-size: rem(16);
      border: 1px solid #ccc;
      border-radius: rem(5);
      outline: none;
      resize: none;
      overflow: auto !important;
    }
    .iconfont:before {
      font-size: rem(24);
      border: 1px #ccc solid;
      border-radius: 50%;
      padding: 5px;
    }
  }

  .chat-content {
    margin-top: rem(60);
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: rem(100);
  }

  .chat-item {
    margin: rem(10) 0;
    padding: rem(5);
  }

  .chat-thumb {
    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: inline-block;
      margin: auto 14px;
    }
  }

  .chat-message {
    margin-left: -8px;
    &__time {
      color: #ccc;
      font-size: rem(12);
    }
    &__content {
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f0f0f0;
      padding: rem(5);
      max-width: 80%;
    }
  }
</style>
