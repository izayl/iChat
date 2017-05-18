<template>
  <div class="user">
    <x-header :left-options="{showBack: false}" style="position: fixed;left:0;right:0">
      <div slot="left" @click="back" class="back">
        <i class="iconfont icon-left"></i>
      </div>
      {{username}}
    </x-header>
    <div class="chat-content">
      <div class="chat-item" v-for="message in messages">
        <flexbox>
          <flexbox-item :span="1/5" class="chat-thumb" :style="{'order': message.fromUser === userId ? 1 : 0}">
            <svg class="avatar" aria-hidden="true">
              <use :xlink:href="'#avatar-' + (message.fromUser === userId ? avatar : myAvatar)"></use>
            </svg>
          </flexbox-item>
          <flexbox-item :span="4/5">
            <div class="chat-message">
              <flexbox direction="column" :align="message.fromUser === userId ? 'flex-end' : 'flex-start' ">
                <time-ago class="chat-message__time" :since="message.time" :max-time="86400 * 8"
                          :auto-update="60"></time-ago>
                <div class="chat-message__content">
                  <p v-if="!message.isVideo">{{message.content}}</p>
                  <a v-if="message.isVideo" :href="message.content">视频邀请</a>
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
          <span class="iconfont icon-microphone" @click="facetime"></span>
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
        var friend = state.friends.filter(item => item.userId === this.friendId)
        return friend[0].username
      },
      avatar: function (state) {
        var friend = state.friends.filter(item => item.userId === this.friendId)
        return friend[0].avatar
      },
      userId (state) {
        return state.userId
      },
      myAvatar (state) {
        return state.myAvatar
      }
    }),
    methods: {
      facetime () {
        this.$router.push('/rtc/' + this.friendId)
        this.$store.commit('sendMessage', {
          toUser: this.friendId,
          content: '#/rtc/' + this.friendId,
          isVideo: true
        })
        this.message = ''
        Autosize(this.$refs.textarea)
        this.$refs.textarea.focus()
      },
      back () {
        console.log('back')
        this.$router.replace('/chatList')
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
      this.$store.commit('addRecent', {
        username: this.username,
        userId: this.friendId,
        avatar: this.avatar
      })
    }
  }
</script>
<style lang="scss">
  @import "~@/common/style/rem";

  .user {
    flex: 1;
    .back {
      width: 60px;
      height: 45px;
      position: absolute;
      top: 0px;
      left: 0;
      margin-top: -13px;
      margin-left: -18px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
    svg {
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
