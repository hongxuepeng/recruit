<template>
  <div class="recruit-home">
    <div class="recruit-home-banner">
      <img src="@/assets/home/banner.png" alt="">
    </div>
    <form action="/"
          class="recruit-home-form"
          :class="{'recruit-home-form-top' : isScrollTop}">
      <van-search v-model="searchValue"
                  show-action
                  shape="round"
                  placeholder="请输入企业/职位名称"
                  action-text="搜索"
                  @search="onSearch">
        <template #action>
          <div @click="onSearch(searchValue)">搜索</div>
        </template>
      </van-search>
    </form>
    <div class="recruit-home-section">
      <div class="recruit-home-grid">
        <van-grid :column-num="4"
                  square>
          <van-grid-item class="recruit-home-grid-item"
                         v-for="(item, index) in gridList"
                         :key="index"
                         @click="handleGrid(item.groupGuid)">
            <img :src="item.imgUrl" alt="">
            <div>{{item.name}}</div>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="recruit-home-list">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad">
          <div v-for="(item, index) in list"
               :key="item.productId"
               class="recruit-home-item"
               @click="viewDetail(item)">
            <div class="recruit-home-item-content">
              <div class="recruit-home-item-section">
                <div class="recruit-home-item-img van-hairline--surround">
                  <van-image lazy-load :src="item.iconUrl" fit="cover" />
                  <div class="recruit-home-item-person">{{item.applyCount}}人已申请</div>
                </div>
                <div class="recruit-home-item-detail">
                  <div class="recruit-home-item-company van-ellipsis">{{item.productname}}</div>
                  <div class="recruit-home-item-money">
                    <div>{{item.startLimit}}-{{item.endLimit}}元/月</div>
                    <div class="van-ellipsis">{{item.station}}</div>
                  </div>
                  <ul class="recruit-home-item-tags van-ellipsis">
                    <li class="van-hairline--surround"
                        :class="item.recruitmentName === '停招' ? 'gray' : 'red'"
                        v-if="item.recruitmentName">{{item.recruitmentName}}</li>
                    <li class="van-hairline--surround"
                        v-for="v in getTags(item.lablelist, item.recruitmentName)"
                        :key="v + index">{{v}}</li>
                  </ul>
                  <div class="recruit-home-item-address van-ellipsis">{{item.companyName}}</div>
                </div>
              </div>
              <div class="van-ellipsis recruit-home-item-tips" v-if="item.model">模式：{{item.model}}</div>
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="recruit-home-item-footer">
              <div class="van-hairline--surround" @click.stop="handleShare(item)">
                <div class="recruit-home-btn-icon"></div>
                <div>分享给好友</div>
              </div>
              <div @click.stop="handleEnroll(item)">立即报名</div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <van-overlay :show="show"
                 class="share"
                 @click="show = false">
    </van-overlay>
  </div>
</template>

<script>
  import { wexinShare, getStorage, isIos, getSessionStorage } from '@/libs/utils';
  import {
    getProductGroup,
    getProductList,
    getSignature
  } from "@/api/index";
  import {
    Search,
    Grid,
    GridItem,
    List,
    Image,
    overlay
  } from 'vant';
  export default {
    components: {
      [Search.name]: Search,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [List.name]: List,
      [Image.name]: Image,
      [overlay.name]: overlay,
    },
    data() {
      return {
        searchValue: '',
        gridList: [],
        list: [],
        loading: false,
        finished: false,
        scrollTop: 0,
        searchKey: '',
        pageIndex: 1,
        pageSize: 10,
        groupGuid: '',
        show: false
      }
    },
    mounted () {
    },
    computed: {
      isScrollTop ({ scrollTop }) {
        return scrollTop > 50
      }
    },
    methods: {
      /**
       * 搜索
       */
      onSearch (val) {
        this.groupGuid = ''
        this.searchKey = val
        this.resetData()
      },
      /**
       * 监听滚动事件
       */
      handleScroll () {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      },
      async onLoad() {
        try {
          let params = {
            groupGuid: this.groupGuid,
            key: this.searchKey,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          }
          let res = await getProductList(params)
          if (+res.code === 1) {
            this.list = [...this.list, ...res.info.list]
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
      /**
       * 重置列表
       */
      resetData () {
        this.pageIndex = 1
        this.list = []
        this.finished = false
        this.loading = true
        this.onLoad()
      },
      /**
       * 查看详情
       */
      viewDetail (item) {
        this.$router.push(`detail/${item.productId}`);
      },
      /**
       * 立即报名
       */
      handleEnroll (item) {
        this.$router.push(`enroll/${item.productId}`);
      },
      async handleShare (item) {
        let domain = document.domain;
        const url = isIos ? getSessionStorage('iosUrl') : window.location.href
        let res = await getSignature({ url })
        if (+res.code !== 1) return
        //微信加签
        const obj = {
          appId: res.info.appId,
          noncestr: res.info.noncestr,
          signature: res.info.signature,
          timestamp: res.info.timestamp,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        };
        //分享数据，这段主要是为了在hash模式下分享出去的链接不被浏览器截取，保证完全把链接分享出去
        let guid = getStorage('agentGuid')
        let shareData = {
          title: `${item.productname}`, // 分享标题
          desc: `公司名称：${item.companyName}`,
          link: `http://${domain}/detail/${item.productId}?guid=${guid}`,
          imgUrl: item.iconUrl // 分享图标
        };
        //引用
        wexinShare(obj, shareData);
        this.show = true
      },
      /**
       * 获取岗位类型
       * @returns {Promise<void>}
       */
      async getJobType () {
        let res = await getProductGroup()
        if (+res.code === 1) {
          this.gridList = res.info
        }
      },
      getTags (tags = [], recruitmentName) {
        let num = recruitmentName ? 2 : 3
        return tags.length > num ? tags.slice(0, num) : tags
      },
      handleGrid (groupGuid) {
        this.groupGuid = groupGuid
        this.searchValue = ''
        this.searchKey = ''
        this.resetData()
      }
    },
    created () {
      this.getJobType()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        window.document.body.style.backgroundColor = '#F7F7F7';
        window.addEventListener('scroll', vm.handleScroll)
      });
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.handleScroll)
      next();
    }
  }
</script>

<style lang="less" scoped>
  .recruit-home {
    .recruit-home-banner {
      img {
        width: 100%;
        height: auto;
      }
    }
    .recruit-home-form {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 99;
      .van-search {
        background-color: transparent;
        /deep/ .van-search__content {
          background-color: #FFFFFF;
        }
        /deep/ .van-search__action {
          color: #FFFFFF;
          font-size: 12px;
          &:active {
            background-color: transparent;
          }
        }
        /deep/ .van-icon-search {
          color: #999999;
        }
        /deep/ .van-field__control {
          font-size: 12px;
        }
      }
      &.recruit-home-form-top {
        .van-search {
          background-color: #FFFFFF;
          box-shadow: 0 4px 6px #ebedf0;
        }
        /deep/ .van-search__content {
          background-color: #f7f8fa;
        }
        /deep/ .van-search__action {
          color: #5f6c83;
        }
      }
    }
    .recruit-home-section {
      padding: 0 10px;
    }
    .recruit-home-grid {
      background-color: #FFFFFF;
      border-radius: 5px;
      overflow: hidden;
      margin-top: -30px;
      .recruit-home-grid-item {
        font-size: 12px;
        color: #333333;
        background-color: #FFFFFF;
        /deep/ .van-grid-item__content::after {
          display: none;
        }
        img {
          height: 30px;
          width: auto;
          margin-bottom: 14px;
        }
      }
    }
    .recruit-home-item {
      background: #FFFFFF;
      border-radius: 5px;
      margin-top: 10px;
      .recruit-home-item-content {
        padding: 15px 10px 0 10px;
        .recruit-home-item-section {
          display: flex;
        }
        .recruit-home-item-detail {
          flex: 1;
          padding-left: 10px;
          overflow: hidden;
          .recruit-home-item-company {
            color: #333333;
            font-size: 15px;
            line-height: 15px;
          }
          .recruit-home-item-money {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 13px;
            margin-top: 10px;
            div {
              font-size: 12px;
              color: #666666;
              &:first-child {
                color: #F06449;
                font-size: 13px;
              }
              &:last-child {
                flex: 1;
                overflow: hidden;
                text-align: right;
              }
            }
          }
          .recruit-home-item-tags {
            display: flex;
            font-size: 10px;
            margin-top: 8px;
            height: 18px;
            align-items: center;
            li {
              height: 16px;
              line-height: 16px;
              padding: 0 4px;
              margin-left: 5px;
              color: #009CE5;
              background: #EBF6FD;
              &:first-child {
                margin-left: 0;
              }
              &::after {
                border-color: #A0D0EE;
              }
              &.red {
                color: #E57200;
                padding-left: 16px;
                background: url("../../assets/home/hot.png") no-repeat center left 4px;
                background-size: 8px 10px;
                background-color: #FDF4EB;
                &::after {
                  border-color: #F3C79B;
                }
              }
              &.gray {
                color: #666666;
                padding-left: 16px;
                background: url("../../assets/home/gray.png") no-repeat center left 4px;
                background-size: 8px 10px;
                background-color:#EEEEEE;
                &::after {
                  border-color:  #AAAAAA;
                }
              }
            }
          }
          .recruit-home-item-address {
            font-size: 10px;
            color: #666666;
            margin-top: 13px;
          }
        }
        .recruit-home-item-img {
          position: relative;
          width: 108px;
          height: 90px;
          border-radius: 3px;
          overflow: hidden;
          .van-image {
            height: 100%;
            width: 100%;
          }
          &::after {
            border-radius: 6px;
          }
          .recruit-home-item-person {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 25px;
            background-color: rgba(0, 0, 0, .5);
            color: #FFFFFF;
            font-size: 10px;
            line-height: 25px;
            border-radius: 0px 0px 3px 3px;
            padding: 0 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .recruit-home-item-tips {
          font-size: 11px;
          line-height: 11px;
          margin-top: 15px;
          color: #666666;
          background: url("../../assets/home/tips.png") no-repeat center left;
          background-size: 11px 11px;
          padding-left: 16px;
        }
        .van-hairline--bottom {
          margin-top: 10px;
          &::after {
            border-color: #E0E0E0;
          }
        }
      }
      .recruit-home-item-footer {
        display: flex;
        justify-content: flex-end;
        padding: 12px 14px;
        & > div {
          height: 25px;
          font-size: 11px;
          line-height: 25px;
          text-align: center;
          border-radius: 26px;
          &::after {
            border-radius: 26px;
          }
          &:first-child {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90px;
            color: #1976FA;
            &::after {
              border-color: #1976FA;
            }
          }
          &:last-child {
            background-color: #1976FA;
            color: #FFFFFF;
            width: 82px;
            margin-left: 12px;
          }
        }
        .recruit-home-btn-icon {
          height: 14px;
          width: 14px;
          background: url("../../assets/home/share.png") no-repeat center  1px;
          background-size: auto 12px;
          margin-right: 3px;
        }
      }
    }
    .share {
      z-index: 100;
      background: url("../../assets/share.png") no-repeat right top;
      background-size: 100% auto;
      background-color: rgba(0,0,0,.7);
    }
  }
</style>
