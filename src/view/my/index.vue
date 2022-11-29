<template>
  <div class="person-center">
    <div class="person-header">
      <div class="person-avatar">
        <img src="@/assets/home/home_head.png">
      </div>
      <div class="person-info">
        <div class="person-info-detail">
          <div class="person-info-phone">{{info.phone}}</div>
          <div class="person-info-real" @click="handleReal">
            <span>{{info.name ? '已认证' : '未认证'}}</span>
          </div>
        </div>
      </div>
    </div>
    <ul class="person-grid">
      <li @click="handleCode">
        <img src="@/assets/person_grid_1.png">
        <div class="person-grid-title">推广二维码</div>
      </li>
      <li @click="$router.push('customer-search')">
        <img src="@/assets/person_grid_2.png">
        <div class="person-grid-title">客户信息查询</div>
      </li>
      <li @click="$router.push('achievement')">
        <img src="@/assets/person_grid_3.png">
        <div class="person-grid-title">我的团队</div>
      </li>
      <li @click="$router.push('agent')">
        <img src="@/assets/person_grid_4.png">
        <div class="person-grid-title">推广代理</div>
      </li>
    </ul>
    <div class="person-total">
      <div class="person-total-content">
        <div class="person-total-top">
          <div class="person-total-top-num">
            <div>总佣金（元）</div>
            <div class="van-ellipsis">{{info.allcommission || 0}}</div>
          </div>
          <div class="person-total-top-btn">
            <van-button plain
                        round
                        type="primary"
                        color="#FFFFFF"
                        @click="$router.push('commission')">去领取</van-button>
          </div>
        </div>
        <div class="person-total-bottom">
          <van-row>
            <van-col span="8">
              <div>已领取佣金</div>
              <div>{{info.withdrawBonus || 0}}</div>
            </van-col>
            <van-col span="8">
              <div>发放中</div>
              <div>{{info.freezeBonus || 0}}</div>
            </van-col>
            <van-col span="8">
              <div>可领取佣金</div>
              <div>{{info.fesidueBonus || 0}}</div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <ul class="person-list">
      <li @click="$router.push('index')">
        <div class="person-list-img">
          <img src="@/assets/home/home_icon_1.png">
        </div>
        <div class="person-list-title">
          <div>企业中心</div>
          <img src="@/assets/right.png">
        </div>
      </li>
      <li @click="handleAchievement(0)">
        <div class="person-list-img">
          <img src="@/assets/home/home_icon_2.png">
        </div>
        <div class="person-list-title">
          <div>我的客户</div>
          <img src="@/assets/right.png">
        </div>
      </li>
      <li @click="handleAchievement(1)">
        <div class="person-list-img">
          <img src="@/assets/home/home_icon_3.png">
        </div>
        <div class="person-list-title">
          <div>我团队的客户</div>
          <img src="@/assets/right.png">
        </div>
      </li>
<!--      <li @click="handleReset">-->
<!--        <div class="person-list-img">-->
<!--          <img src="@/assets/home/home_icon_4.png">-->
<!--        </div>-->
<!--        <div class="person-list-title">-->
<!--          <div>收益</div>-->
<!--          <img src="@/assets/right.png">-->
<!--        </div>-->
<!--      </li>-->
      <li @click="$router.push('rule')">
        <div class="person-list-img">
          <img src="@/assets/home/home_icon_5.png">
        </div>
        <div class="person-list-title">
          <div>规则</div>
          <img src="@/assets/right.png">
        </div>
      </li>
      <li @click="handleCustomer">
        <div class="person-list-img">
          <img src="@/assets/home/home_icon_8.png">
        </div>
        <div class="person-list-title">
          <div>我的专属客服</div>
          <img src="@/assets/right.png">
        </div>
      </li>
    </ul>
    <div class="person-logout" @click="logout">退出登录</div>
    <div class="shareImg">
      <compose-img ref="composeImg"></compose-img>
    </div>
    <van-popup v-model="isSystem" class="system-box">
      <div class="system-tips">
        <div class="system-tips-header"></div>
        <div class="system-tips-content">
          <div class="system-tips-text">系统您已为您分配官方专属客服！</div>
          <div class="system-tips-text">客服电话：{{info.customer}}（同微信）</div>
          <div class="system-tips-btn" id="systemBtn" @click="copyCustomer">复制微信号</div>
          <div class="system-tips-detail">快去微信添加好友获取专属服务吧</div>
        </div>
        <img src="../../assets/code_close.png" class="system-tips-close" @click="isSystem = false">
      </div>
    </van-popup>
  </div>
</template>

<script>
  import composeImg from '@/components/shareImg.vue'
  import { clearUserCookie, saveUserInfo, copyLink } from '@/libs/utils';
  import { getAgentMsg } from "@/api/index";
  import {
    Popup,
    Icon,
    Dialog,
    Button,
    Col,
    Row,
    Toast
  } from 'vant';
  export default {
    components: {
      [Popup .name]: Popup,
      [Icon .name]: Icon,
      [Dialog .name]: Dialog,
      [Button .name]: Button,
      [Col .name]: Col,
      [Row .name]: Row,
      [Toast .name]: Toast,
      composeImg
    },
    data() {
      return {
        show: false,
        customerInfo: {},
        info: {},
        isSystem: false
      }
    },
    methods: {
      /**
       * 邀请代理
       */
      handleAgent () {
        this.$router.push('agent');
      },
      /**
       * 产品推荐
       */
      handleProduct () {
        this.$router.push('recommend');
      },
      /**
       * 我的业绩
       */
      handleRecommend () {
        this.$router.push('achievement');
      },
      /**
       * 城市推荐
       */
      handleCity () {
        this.$router.push('city');
      },
      /**
       * 重置密码
       */
      handleReset () {
        this.$router.push('reset');
      },
      /**
       * 推广二维码
       */
      handleCode () {
        this.$refs.composeImg.loadImg();
      },
      /**
       * 实名认证
       */
      handleReal () {
        this.$router.push('information');
      },
      /**
       * 退出登录
       */
      logout () {
        clearUserCookie()
      },
      async bindInfo () {
        let res = await getAgentMsg()
        this.info = res.info || {}
        saveUserInfo(res.info);
      },
      handleAchievement (type) {
        this.$router.push({
          path: '/achievement-detail',
          query: {
            type: type,
            source: 'my'
          }
        })
      },
      handleCustomer () {
        this.isSystem = true
      },
      copyCustomer () {
        copyLink(this.info.customer)
        Toast.success('复制成功');
      }
    },
    created () {
      this.bindInfo()
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
  .person-center {
    position: relative;
    background: url("../../assets/banner_personal_bg.png") no-repeat;
    background-size: 100% auto;
    padding-bottom: 10px;
    .person-header {
      display: flex;
      align-items: center;
      padding: 30px 18px;
      .person-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .person-info {
        flex: 1;
        padding-left: 22px;
        &-detail {
          display: flex;
          flex-direction: column;
        }
        &-name {
          font-size: 16px;
          color: #FFFFFF;
          line-height: 16px;
          margin-right: 12px;
        }
        &-real {
          display: flex;
          align-items: center;
          height: 18px;
          line-height: 18px;
          padding: 0 8px;
          background: rgba(0, 0, 0, .2);
          border-radius: 9px;
          font-size: 11px;
          color: #FFFFFF;
          width: 60px;
          text-align: center;
          margin-top: 10px;
          justify-content: center;
          img {
            width: 13px;
            height: auto;
            margin-right: 5px;
          }
        }
        &-phone {
          font-size: 13px;
          line-height: 13px;
          color: #DDDDDD;
        }
        &-city {
          font-size: 13px;
          line-height: 13px;
          color: #DDDDDD;
          margin-top: 20px;
        }
      }
    }
    .person-achievement {
      margin-top: 25px;
      &-box {
        background: #FFFFFF;
        box-shadow: 0px 0px 5px 0px rgba(4, 0, 0, 0.09);
        border-radius: 0px 25px 0px 0px;
        height: 82px;
        display: flex;
        align-items: center;
      }
      &-item {
        flex: 1;
        text-align: center;
      }
      &-num {
        color: #333333;
        font-size: 18px;
        font-weight: 500;
      }
      &-label {
        color: #999999;
        font-size: 11px;
        margin-top: 8px;
      }
    }
    .person-grid {
      display: flex;
      background: #ffffff;
      padding-top: 30px;
      padding-bottom: 24px;
      border-radius: 0px 25px 0px 0px;
      li {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        flex-flow: column;
        img {
          height: 48px;
          width: 48px;
        }
        .person-grid-title {
          color: #333333;
          margin-top: 12px;
        }
      }
    }
    .person-total {
      padding: 12px 17px 0 17px;
      .person-total-content {
        height: 132px;
        width: 100%;
        background: url("../../assets/total_bg.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
      }
      .person-total-top {
        height: 75px;
        display: flex;
        align-items: center;
        border-bottom: 0.5px dotted #AAAAAA;
        padding-right: 36px;
        padding-left: 31px;
        .person-total-top-num {
          flex: 1;
          font-size: 13px;
          color: #FFFFFF;
          line-height: 13px;
          & > div {
            &:last-child {
              font-size: 18px;
              line-height: 18px;
              margin-top: 15px;
            }
          }
        }
        .person-total-top-btn {
          display: flex;
          align-items: center;
          .van-button {
            width: 85px;
            height: 25px;
            background: transparent;
            line-height: 25px;
          }
        }
      }
      .person-total-bottom {
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
        height: 100%;
        flex: 1;
        .van-row {
          height: 100%;
        }
        .van-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          & > div {
            &:last-child {
              margin-top: 4px;
            }
          }
        }
      }
    }
    .person-list {
      background: #ffffff;
      margin-top: 12px;
      box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.06);
      li {
        display: flex;
        font-size: 15px;
        color: #333333;
        height: 54px;
        .person-list-title {
          position: relative;
          flex: 1;
          height: 100%;
          font-weight: 400;
          border-bottom: 1px solid #EEEEEE;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 12px;
          img {
            width: 6px;
          }
          .person-list-modify {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            color: #AAAAAA;
            font-size: 13px;
          }
        }
        .person-list-img {
          width: 48px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: auto;
            height: 16px;
          }
        }
        &:last-child {
          .person-list-title {
            border-bottom: none;
          }
        }
      }
    }
    .person-logout {
      height: 50px;
      background: #ffffff;
      text-align: center;
      color: #333333;
      font-size: 16px;
      line-height: 50px;
      margin-top: 50px;
      box-shadow: 0px 1px 9px 0px rgba(125, 124, 124, 0.11);
    }
  }
  .customer-service {
    position: relative;
    width: 320px;
    background: #ffffff;
    border-radius: 8px;
    .van-icon-cross {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 20px;
      color: #B2B2B2;
    }
    .customer-service-title {
      text-align: center;
      color: #333333;
      font-size: 18px;
      padding: 30px 0;
    }
    .customer-service-item {
      font-size: 15px;
      color: #555555;
      padding-left: 34px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      img {
        height: 12px;
        width: auto;
        margin-right: 5px;
      }
    }
    .customer-service-code {
      text-align: center;
      img {
        width: 200px;
        height: 200px;
      }
    }
    .customer-service-tips {
      text-align: center;
      font-size: 12px;
      color: #AAAAAA;
      padding: 30px 0;
    }
  }
  /deep/ .van-popup {
    background: transparent;
  }
  .system-box {
    background: transparent;
    overflow: inherit;
    .system-tips {
      position: relative;
      width: 270px;
      border-radius: 5px;
      .system-tips-close {
        position: absolute;
        left: 50%;
        bottom: -50px;
        z-index: 99;
        transform: translate(-50%, 0);
        width: 36px;
        height: 36px;
      }
      .system-tips-header {
        width: 270px;
        height: 93px;
        background: url("../../assets/home_modal.png") no-repeat;
        background-size: 270px 93px;
      }
      .system-tips-content {
        padding: 30px 16px 20px 16px;
        background: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        .system-tips-text {
          font-size: 14px;
          text-align: center;
          color: #666666;
          word-break:break-all;
          line-height: 18px;
          &:first-child {
            margin-bottom: 18px;
          }
        }
        .system-tips-btn {
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #1976FA;
          color: #fff;
          font-size: 15px;
          border-radius: 20px;
          margin-top: 25px;
        }
        .system-tips-detail {
          color: #999999;
          font-size: 13px;
          text-align: center;
          margin-top: 15px;
        }
      }
    }
  }
</style>
