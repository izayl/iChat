<template>
  <div class="chatList">
    <group v-if="recent.length > 0" >
      <template v-for="(friend, index) in recent">
        <cell :title="friend.username" :link="`/user/${friend.userId}`" :isLink="true">
          <i slot="icon" width="20" class="icon avatar list-thumb" v-html="friend.avatar"></i>
          <x-button slot="child" @click.native.stop="remove(index)" mini>删除</x-button>
        </cell>
      </template>
      <!--<cell title="Go to Demo" :link="{path:'/demo'}" inline-desc=':link={path:"/demo"}'>-->
        <!--<img slot="icon" width="20" class="list-thumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=">-->
      <!--</cell>-->
      <!--<cell title="http link" link="https://vux.li" inline-desc='link="https://vux.li"'>-->
        <!--<img slot="icon" width="20" class="list-thumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=">-->
        <!--<div slot="value">-->
          <!--<badge text="9"></badge>-->
        <!--</div>-->
      <!--</cell>-->
    </group>
  </div>
</template>
<script>
  import { Group, Cell, Badge, XButton } from 'vux'
  import { mapState } from 'vuex'
  export default {
    components: { Group, Cell, Badge, XButton },
    computed: mapState(['recent']),
    methods: {
      remove (index) {
        this.$store.commit('removeRecent', index)
      }
    }
  }
</script>
<style lang="scss">
  @import "~@/common/style/rem";

  .chatList .weui-cell__ft:after {
    display: none !important;
  }
  .chatList .list-thumb {
    display:block;
    margin-right:5px;
    width: rem(50);
  }
</style>
