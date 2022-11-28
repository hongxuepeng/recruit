<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    </router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
  }
</script>

<style lang="less">
  html {
    height: 100%;
  }
  body {
    font-size: 16px;
    background-color: #ffffff;
    color: #5f6c83;
    -webkit-font-smoothing: antialiased;
    font-family: 'PingFang SC', Helvetica, 'STHeiti STXihei', 'Microsoft YaHei', Tohoma, Arial, sans-serif;
    overflow-x: hidden;
    &.screen {
      height: 100%;
    }
    &.login-bg {
      background: url("assets/bg_login.png") no-repeat;
      background-size:100% 100%;
      background-attachment:fixed;
      #app {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &.register-bg {
      background: url("assets/bg_register.png") no-repeat;
      background-size:100% 100%;
      background-attachment:fixed;
    }
  }
  *{
    box-sizing: border-box;
  }
  .van-list__error-text, .van-list__finished-text, .van-list__loading, .van-loading__text, .van-loading__spinner{
    color: #bbc7d7!important;
  }
  .van-dialog__footer {
    .van-button--default {
      border: none;
    }
  }
  .commission {
    .van-tabs__wrap {
      position: fixed!important;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
    }
    .van-tab__pane {
      padding: 20px 15px 15px 15px;
    }
    .van-tabs__content {
      padding-top: 50px;
    }
  }
  .van-nav-bar .van-icon {
    position: relative;
    top: -1px;
  }
  .shareImg .van-overlay {
    z-index: 3!important;
  }
  .team-table {
    .van-list__finished-text {
      font-size: 12px;
    }
  }
  .activity-html {
    img {
      max-width: 100%!important;
    }
  }
  .agent-city-choose .van-picker__toolbar {
    display: none;
  }
  .agent-city-flase .van-picker__toolbar {
    display: none;
  }
  .agent-city-flase .van-picker-column__item {
    font-size: 14px;
  }
  .home-swiper-section {
    .van-swipe__indicators {
      bottom: 6px;
    }
    .van-swipe__indicator {
      background: #ddd;
    }
  }
</style>
