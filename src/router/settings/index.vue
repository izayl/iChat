<template>
  <div class="settings">
    <grid :rows="3">
      <grid-item label="个性签名">
        <i class="iconfont icon-message-r" slot="icon"></i>
      </grid-item>
      <grid-item label="头像选择" @on-item-click="showAvatarSelector = true">
        <i class="iconfont icon-me" slot="icon"></i>
      </grid-item>
      <grid-item label="退出">
        <i class="iconfont icon-lock" slot="icon"></i>
      </grid-item>
    </grid>
    <div v-transfer-dom>
      <popup v-model="showAvatarSelector" position="left" width="100%">
        <div class="position-horizontal">
          <grid :row="3">
            <grid-item @on-item-click="handleAvatarSelect(i - 1)" v-for="i in 46" :key="i" style="text-align: center;">
              <svg class="avatar" aria-hidden="true">
                <use :xlink:href="'#avatar-' + (i - 1)"></use>
              </svg>
            </grid-item>
          </grid>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, Grid, GridItem, XInput, XButton, TransferDom, Popup } from 'vux'
  export default {
    components: {
      Group, Cell, Grid, GridItem, XInput, XButton, TransferDom, Popup
    },
    directives: {
      TransferDom
    },
    data () {
      return {
        showAvatarSelector: false
      }
    },
    methods: {
      changeSignature () {

      },
      handleAvatarSelect (i) {
        console.log(i)
        this.showAvatarSelector = false
      }
    }
  }
</script>
<style lang="scss">
  .position-horizontal {
    position: relative;
    height: 100%;
    overflow: auto;
  }
</style>
