<template>
  <div class="recruit-detail">
    <div class="recruit-detail-company">
      <div style="padding: 0 10px;">
        <div class="recruit-detail-bg">
          <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(item, index) in info.productImgs"
                            :key="index">
              <img v-lazy="item.url" />
            </van-swipe-item>
          </van-swipe>
          <div class="recruit-detail-person">{{info.applyCount}}人已申请</div>
        </div>
        <div class="recruit-detail-company-name">
          <span>{{info.productname}}</span>
          <span>{{info.station}}</span>
        </div>
        <div class="recruit-detail-money">{{info.startLimit}}-{{info.endLimit}}元/月</div>
        <ul class="recruit-detail-tags">
          <li class="red van-hairline--surround">热招</li>
          <li class="van-hairline--surround"
              v-for="item in info.lablelist"
              :key="item">{{item}}</li>
        </ul>
      </div>
      <div class="van-hairline--top"></div>
      <div class="recruit-detail-field">
        <div class="recruit-detail-field-img"><img src="../../assets/company_icon.png" alt=""></div>
        <div class="recruit-detail-field-name">{{info.companyName}}</div>
      </div>
      <div class="recruit-detail-field" v-if="info.companyAddress">
        <div class="recruit-detail-field-img"><img src="../../assets/location_icon.png" alt=""></div>
        <div class="recruit-detail-field-name">{{info.companyAddress}}</div>
        <img src="../../assets/right.png" alt="">
      </div>
    </div>
    <div class="recruit-detail-html" v-html="info.detail"></div>
    <div class="recruit-detail-footer">
      <ul class="recruit-detail-contact">
        <li @click="handleWechat" v-if="agentInfo.wxchat">
          <img src="../../assets/wechat_icon.png" alt="">
          <div>添加微信</div>
        </li>
        <li v-if="agentInfo.phone">
          <a :href="telPhone">
            <img src="../../assets/phone_icon.png" alt="">
            <div>电话咨询</div>
          </a>
        </li>
      </ul>
      <div class="recruit-detail-btn">
        <div class="van-hairline--surround"
             @click="shareImg">
          <div class="recruit-home-btn-icon"></div>
          <div>分享职位</div>
        </div>
        <div @click="handleEnroll">立即报名</div>
      </div>
    </div>
    <van-overlay :show="show">
      <div class="recruit-detail-wrapper" @click.stop>
        <div class="recruit-detail-block">
          <img src="../../assets/wechat_white.png" alt="">
          <div class="recruit-detail-wechat">微信号：{{agentInfo.wxchat}}</div>
          <div class="recruit-detail-wechat-tips">已复制，去添加招聘专员为好友吧~</div>
          <van-button round
                      type="info"
                      color="#1976FA"
                      class="recruit-detail-wechat-btn"
                      @click="show = false">我知道了</van-button>
        </div>
      </div>
    </van-overlay>
    <poster-img ref="posterImg"
                :info="info"
                :productId="$route.params.id"
                :agentInfo="agentInfo"></poster-img>
  </div>
</template>

<script>
  import {
    getProductDetails,
    getProductDetailsAgentMsg
  } from "@/api/index";
  import { copyLink, getSessionStorage } from '@/libs/utils';
  import PosterImg from '@/components/posterImg';
  import {
    Overlay,
    Button,
    Toast,
    Swipe,
    SwipeItem
  } from 'vant';
  export default {
    components: {
      [Overlay.name]: Overlay,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      PosterImg
    },
    computed: {
      telPhone ({ agentInfo }) {
        return `tel:${agentInfo.phone}`
      }
    },
    data () {
      return {
        show: false,
        info: {},
        agentInfo: {},
        invitorGuid: getSessionStorage('parentAgentGuid')
      }
    },
    methods: {
      handleWechat () {
        copyLink(this.agentInfo.wxchat);
        this.show = true
      },
      shareImg () {
        this.$refs.posterImg.viewPoster()
      },
      async getProductDetails () {
        let res = await getProductDetails({ productId: this.$route.params.id })
        if (+res.code === 1) {
          this.info = res.info
        }
      },
      async getProductDetailsAgentMsg () {
        let res = await getProductDetailsAgentMsg({
          invitorGuid: this.invitorGuid
        })
        if (+res.code === 1) {
          this.agentInfo = res.info
        }
      },
      /**
       * 立即报名
       */
      handleEnroll () {
        this.$router.push(`/enroll/${this.info.productId}`);
      },
    },
    created () {
      this.getProductDetails()
      this.getProductDetailsAgentMsg()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        window.document.body.style.backgroundColor = '#F7F7F7';
        vm.invitorGuid = getSessionStorage('parentAgentGuid')
        if (from.name === 'index') {
          vm.getProductDetails()
          vm.getProductDetailsAgentMsg()
          window.scrollTo(0, 0);
        }
        vm.$nextTick(() => {
          vm.$refs.posterImg && vm.$refs.posterImg.getQRcode()
        })
      });
    },
    beforeRouteLeave (to, from, next) {
      window.document.body.style.backgroundColor = '';
      next();
    }
  }
</script>

<style lang="less" scoped>
  .recruit-detail {
    padding-bottom: 65px;
    .recruit-detail-company {
      background: #FFFFFF;
      padding-top: 8px;
      .recruit-detail-bg {
        position: relative;
        height: 200px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 200px;
        }
        .recruit-detail-person {
          position: absolute;
          left: 0;
          bottom: 28px;
          background-color: rgba(0, 0, 0, .6);
          color: #FFFFFF;
          font-size: 10px;
          border-radius: 0 8px 8px 0;
          padding: 0 10px;
          height: 20px;
          line-height: 20px;
        }
      }
      .recruit-detail-company-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #666666;
        margin-top: 12px;
        span {
          &:first-child {
            font-size: 15px;
            color: #333333;
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 10px;
          }
        }
      }
      .recruit-detail-money {
        color: #F06449;
        font-size: 13px;
        line-height: 13px;
        margin-top: 20px;
      }
      .recruit-detail-tags {
        display: flex;
        font-size: 10px;
        margin-top: 15px;
        flex-wrap: wrap;
        li {
          height: 16px;
          line-height: 16px;
          padding: 0 4px;
          margin-right: 5px;
          color: #009CE5;
          background: #EBF6FD;
          margin-bottom: 12px;
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
        }
      }
      .recruit-detail-field {
        display: flex;
        align-items: center;
        height: 54px;
        padding: 0 17px;
        .recruit-detail-field-name {
          flex: 1;
          font-size: 14px;
          line-height: 14px;
          padding: 0 7px;
        }
        .recruit-detail-field-img {
          width: 16px;
          height: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
          img {
            height: 16px;
            width: auto;
          }
        }
        & > img {
          &:last-child {
            height: 10px;
            width: auto;
          }
        }
      }
    }
    .recruit-detail-html {
      margin-top: 8px;
      font-size: 14px;
      background-color: #FFFFFF;
      padding: 16px;
    }
    .recruit-detail-footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 57px;
      background-color: #FFFFFF;
      box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.07);
      padding: 0 15px;
      .recruit-detail-contact {
        display: flex;
        align-items: center;
        color: #666666;
        font-size: 11px;
        line-height: 11px;
        text-align: center;
        li {
          margin-left: 18px;
          &:first-child {
            margin-left: 0;
          }
          a {
            display: block;
            color: #666666;
          }
        }
        img {
          height: 26px;
          width: auto;
          margin-bottom: 4px;
        }
      }
      .recruit-detail-btn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        & > div {
          height: 30px;
          font-size: 11px;
          line-height: 30px;
          text-align: center;
          border-radius: 30px;
          &::after {
            border-radius: 30px;
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
    .recruit-detail-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .recruit-detail-wechat-tips {
      font-size: 13px;
      color: #999999;
      margin-top: 12px;
    }
    .recruit-detail-block {
      position: relative;
      font-size: 14px;
      width: 270px;
      background-color: #FFFFFF;
      padding-top: 48px;
      padding-bottom: 24px;
      border-radius: 10px;
      text-align: center;
      .recruit-detail-wechat {
        color: #333333;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & > img {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -25px;
        width: 55px;
        height: 55px;
      }
      .recruit-detail-wechat-btn {
        width: 220px;
        height: 40px;
        margin-top: 24px;
      }
    }
  }
</style>
