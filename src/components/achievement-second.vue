<template>
  <div class="achievement-list-content">
    <van-search v-model="value" placeholder="输入姓名/手机号码搜索" shape="round" show-action>
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <div class="achievement-list-box">
      <div class="achievement-list-section">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad">
          <div class="achievement-list-grid">
            <div class="achievement-list-header">
              <van-row type="flex">
                <van-col span="6">上级</van-col>
                <van-col span="6">代理</van-col>
                <van-col span="6">客户</van-col>
                <van-col span="6">进度</van-col>
              </van-row>
            </div>
            <div class="achievement-list-item" v-for="(item, index) in list" :key="index">
              <van-row type="flex">
                <van-col span="6">
                  <div>{{item.paname}}</div>
                  <div class="achievement-list-top">{{item.paphone}}</div>
                </van-col>
                <van-col span="6">
                  <div>{{item.aname}}</div>
                  <div class="achievement-list-top">{{item.aphone}}</div>
                </van-col>
                <van-col span="6">
                  <div>{{item.name}}</div>
                  <div class="achievement-list-top">{{item.phone}}</div>
                </van-col>
                <van-col span="6">
                  <div>{{item.proName}}</div>
                  <div class="achievement-list-top">{{item.progressName}}</div>
                </van-col>
              </van-row>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Search,
    List,
    Row,
    Col,
  } from 'vant';
  import {
    getMyLowLowLoanList
  } from "@/api/index";
  export default {
    name: "achievement-list",
    components: {
      [Search.name]: Search,
      [List.name]: List,
      [Row.name]: List,
      [Col.name]: Col
    },
    data () {
      return {
        value: '',
        list: [],
        loading: false,
        finished: false,
        pageIndex: 1,
        pageSize: 20
      }
    },
    methods: {
      onSearch () {
        this.resetData()
      },
      async onLoad() {
        try {
          let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            key: this.value
          }
          let res = await getMyLowLowLoanList(params)
          if (+res.code === 1) {
            let myList = res.info.myLowLowLoanList || []
            this.list = [...this.list, ...myList]
            this.loading = false
            let totalPage = res.info.pageCount || 1
            if (this.pageIndex >= totalPage) {
              this.finished = true
              return
            }
            this.pageIndex++
          } else {
            this.loading = false
            this.finished = true
          }
        } catch (e) {
          this.loading = false
          this.finished = true
        }
      },
      resetData () {
        this.pageIndex = 1
        this.list = []
        this.finished = false
      },
    }
  }
</script>

<style lang="less" scoped>
  .achievement-list-content {
    font-size: 12px;
    /deep/ .van-search__action {
      color: #1976FA;
    }
    .achievement-list-box {
      height: calc(100vh - 98px);
      padding: 10px;
      overflow-y: auto;
      .achievement-list-section {
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
        border-radius: 3px;
        padding: 0 8px;
        .achievement-list-grid {
          .achievement-list-header {
            overflow: hidden;
            /deep/ .van-col {
              padding: 12px 4px;
            }
            font-size: 14px;
            border-bottom: 1px solid #EEEEEE;
          }
          .achievement-list-item {
            overflow: hidden;
            /deep/ .van-col {
              padding: 12px 4px;
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: flex-start;
            }
            border-bottom: 1px solid #EEEEEE;
            font-size: 12px;
          }
          /deep/ .van-list {
            display: flex;
            align-items: center;
          }
          .achievement-list-top {
            margin-top: 5px;
          }
        }
      }
    }
  }
</style>
