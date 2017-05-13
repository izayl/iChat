<template>
  <div class="list">
    <a :href="item.url" v-for="item in list" class="list-box">
      <div class="list-box-thumb" v-if="item.src">
        <img :src="item.src" alt="">
      </div>
      <div class="list-box-text">
        <h4>{{item.title}}</h4>
        <p>{{item.desc}}</p>
      </div>
      <div class="list-box-meta">
        <span class="list-box-meta__time"></span>
        <span class="list-box-meta_badge"></span>
      </div>
    </a>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        list: [
          {
            src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
            title: 'TOM'
          }
        ]
      }
    }
  }
</script>
<style lang="less">
  @import "~vux/src/styles/weui/base/fn.less";
  @import "~vux/src/styles/weui/base/variable/color.less";

  .list {
    padding: 14px 15px 10px;
    color: @weuiTextColorGray;
    position: relative;
    background-color: #FFFFFF;
    margin-top: 10px;
    &:after {
      .setBottomLine(@weuiLineColorLight);
    }
  }
</style>
