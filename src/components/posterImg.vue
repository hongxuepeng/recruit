<template>
  <div>
    <div class="poster-img" id="posterImg">
      <div class="poster-company">{{info.companyName}}</div>
      <div class="poster-money">{{info.startLimit}}~{{info.endLimit}}元/月</div>
      <div class="poster-detail">
        <div class="poster-detail-title">{{info.station}}</div>
        <ul class="poster-detail-item">
          <li><span>特点：</span>{{info.lables}}</li>
          <li v-if="info.companyAddress"><span>地址：</span>{{info.companyAddress}}</li>
        </ul>
        <div class="poster-detail-title">职位福利</div>
        <ul class="poster-detail-item" v-if="info.model">
          <li><span>模式：</span>{{info.model}}</li>
        </ul>
      </div>
      <div class="poster-contact">
        <ul class="poster-phone">
          <li v-if="agentInfo.phone">电话：{{agentInfo.phone}}</li>
          <li v-if="agentInfo.wxchat">微信：{{agentInfo.wxchat}}</li>
        </ul>
        <div class="poster-code">
          <div class="poster-code-bg">
            <img :src="codeUrl" alt="">
          </div>
          <div>长按扫码查看更多职位</div>
        </div>
      </div>
    </div>
    <div class="share-img" v-if="shareShow">
      <img :src="imgUrl" class="share-img-url">
      <img src="../assets/code_close.png" class="share-close" @click="close" alt="">
    </div>
    <van-overlay :show="shareShow"/>
  </div>
</template>

<script>
  import { qrcanvas } from 'qrcanvas';
  import { getStorage } from '@/libs/utils';
  import html2canvas from 'html2canvas';
  import {
    Toast,
    Overlay
  } from 'vant';
  export default {
    props: {
      id: String,
      productId: String,
      info: {
        type: Object,
        default: () => {}
      },
      agentInfo: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      [Toast.name]: Toast,
      [Overlay.name]: Overlay
    },
    data () {
      return {
        codeUrl: '',
        imgUrl: '',
        shareShow: false
      }
    },
    methods: {
      getQRcode() {
        let domain = document.domain;
        let guid = getStorage('agentGuid')
        let url = `http://${domain}/detail/${this.productId}?guid=${guid}`
        let canvasCode = qrcanvas({
          data: decodeURIComponent(url),
          size: 300
        });
        this.codeUrl =  canvasCode.toDataURL();
      },
      async shareImg () {
        const loadingToast = Toast.loading({
          message: '海报生成中...',
          forbidClick: true,
          duration: 0
        });
        let canvas = await html2canvas(document.querySelector("#posterImg"), {
          useCORS: true,
          backgroundColor: 'transparent',
          scrollY: 0,
        })
        let hc_image = new Image();
        hc_image.src = canvas.toDataURL("image/png");
        this.imgUrl =  hc_image.src;
        loadingToast.clear();
        this.shareShow = true
      },
      viewPoster () {
        this.shareImg()
      },
      close () {
        this.shareShow = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .poster-img {
    position: fixed;
    left: -544px;
    top: 0;
    width: 544px;
    background: url("../assets/bg_poster.png") no-repeat;
    background-size: 100% 100%;
    padding-top: 104px;
    padding-bottom: 46px;
    .poster-company {
      font-size: 32px;
      line-height: 32px;
      text-align: center;
      color: #FFFFFF;
      font-weight: 600;
      padding: 0 10px;
    }
    .poster-money {
      font-size: 26px;
      font-weight: 400;
      color: #FF9800;
      text-align: center;
      padding: 28px 0;
    }
    .poster-detail {
      width: 492px;
      margin: auto;
      background-color: rgba(255, 255, 255, .1);
      box-shadow: 0px 5px 60px 0px rgba(29,44,86,0.54), 0px 4px 5px 0px rgba(6,0,1,0.35);
      border-radius: 5px;
      padding-top: 20px;
      padding-bottom: 30px;
      .poster-detail-title {
        display: inline-block;
        height: 40px;
        background: #24469B;
        border-radius: 0px 20px 20px 0px;
        font-size: 20px;
        line-height: 36px;
        padding: 0 11px;
        color: #FFFFFF;
        margin-bottom: 16px;
        margin-top: 18px;
        &:first-child {
          margin-top: 0;
        }
      }
      .poster-detail-item {
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 29px;
        padding: 0 22px;
        span {
          color: #FF9800;
        }
      }
    }
    .poster-contact {
      display: flex;
      padding: 0 60px;
      color: #FFFFFF;
      font-size: 18px;
      margin-top: 27px;
      justify-content: space-between;
      align-items: center;
      .poster-phone {
        line-height: 18px;
        li {
          &:last-child {
            margin-top: 12px;
          }
        }
      }
      .poster-code {
        font-size: 10px;
        text-align: center;
      }
      .poster-code-bg {
        height: 80px;
        width: 80px;
        background-color: #FFFFFF;
        border-radius: 2px;
        margin: auto;
        margin-bottom: 9px;
        padding: 4px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .share-img {
    background: transparent;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 12;
    width: 76%;
    transform: translate(-50%, -50%);
    .share-img-url {
      width: 100%;
    }
    .share-close {
      position: absolute;
      left: 50%;
      bottom: -50px;
      z-index: 99;
      transform: translate(-50%, 0);
      width: 30px;
      height: 30px;
    }
  }
</style>
