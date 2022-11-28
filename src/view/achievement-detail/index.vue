<template>
  <div class="achievement-detail">
    <van-tabs v-model="activeName" color="#1976FA">
      <van-tab title="我的" :name="0" v-if="!isHiddenMy">
        <achievement-list></achievement-list>
      </van-tab>
      <van-tab title="一级" :name="1" v-if="!isHiddenFirst">
        <achievement-first :type="1"></achievement-first>
      </van-tab>
      <van-tab title="二级" :name="2" v-if="!isHiddenFirst">
        <achievement-second></achievement-second>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import AchievementList from '@/components/achievement-list'
  import AchievementFirst from '@/components/achievement-first'
  import AchievementSecond from '@/components/achievement-second'
  import {
    Tab,
    Tabs
  } from 'vant';
  export default {
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      AchievementList,
      AchievementFirst,
      AchievementSecond
    },
    data () {
      return {
        tabList: [
          {
            title: '我的',
            type: 0
          },
          {
            title: '一级',
            type: 1
          },
          {
            title: '二级',
            type: 2
          }
        ],
        activeName: 0,
        query: this.$route.query
      }
    },
    computed: {
      isHiddenMy () {
        let { type, source } = this.$route.query
        return +type === 1 && source === 'my'
      },
      isHiddenFirst () {
        let { type, source } = this.$route.query
        return +type === 0 && source === 'my'
      }
    },
    created () {
      let { type } = this.$route.query
      this.type = type
      this.activeName = +type
    },
    beforeRouteEnter (to, from, next) {
      window.document.body.style.backgroundColor = '#F7F7F7';
      next();
    },
    beforeRouteLeave (to, from, next) {
      window.document.body.style.backgroundColor = '';
      next();
    }
  }
</script>

<style lang="less" scoped>
  .achievement-detail {
    /deep/ .van-tab {
      flex: unset;
      margin-left: 60px;
      &:first-child {
        margin-left: 20px;
      }
    }
    /deep/ .van-tab--active {
      color: #1976FA;
    }
    /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
      border-color: #ffffff;
    }
  }
</style>
