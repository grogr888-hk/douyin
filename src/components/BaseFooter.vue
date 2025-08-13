<template>
  <div v-if="visible" class="footer">
    <div class="l-button" @click="tab(1)">
      <span :class="{ active: currentTab === 1 }">首页</span>
    </div>
    <div class="l-button" @click="tab(5)">
      <span :class="{ active: currentTab === 5 }">会员中心</span>
    </div>
  </div>
</template>

<script>
import bus, { EVENT_KEY } from '../utils/bus'

export default {
  name: 'BaseFooter',
  props: ['initTab'],
  data() {
    return {
      currentTab: this.initTab,
      visible: true
    }
  },
  created() {
    bus.on('setFooterVisible', (e) => (this.visible = e))
    bus.on(EVENT_KEY.ENTER_FULLSCREEN, () => (this.visible = false))
    bus.on(EVENT_KEY.EXIT_FULLSCREEN, () => (this.visible = true))
  },
  unmounted() {
    bus.off(EVENT_KEY.ENTER_FULLSCREEN)
    bus.off(EVENT_KEY.EXIT_FULLSCREEN)
  },
  methods: {
    $nav(path) {
      this.$router.push(path)
    },
    tab(index) {
      switch (index) {
        case 1:
          this.$nav('/')
          break
        case 5:
          this.$nav('/me')
          break
      }
      this.currentTab = index
    }
  }
}
</script>

<style scoped lang="less">
.footer {
  font-size: 14rem;
  position: fixed;
  width: 100%;
  height: var(--footer-height);
  z-index: 2;
  top: calc(var(--vh, 1vh) * 100 - var(--footer-height));
  background: var(--footer-color);
  color: white;
  display: flex;

  .l-button {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16rem;

    span {
      cursor: pointer;
      font-weight: bold;
      opacity: 0.7;
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>