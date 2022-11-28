<template>
  <div class="container" v-show="shareShow">
    <div class="share-img">
      <img :src="imgUrl" class="share-img-url">
      <img src="../assets/code_close.png" class="share-close" @click="close" alt="">
    </div>
    <div class="creat-img" ref="box">
      <img src="../assets/product_code.png" class="img-bg" id="qrcodeProductBg" @load="loadBgImg">
      <img :src="codeUrl" class="img-code" id="qrcodeProductImg" @load="loadQrcodeImg">
      <div class="creat-recommender">推荐人{{Phone}}</div>
    </div>
    <van-overlay :show="true"/>
  </div>
</template>

<script>
  import { qrcanvas } from 'qrcanvas';
  import { getStorage } from '@/libs/utils';
  import {
    Toast,
    Overlay
  } from 'vant';
  export default {
    components: {
      [Toast.name]: Toast,
      [Overlay.name]: Overlay
    },
    props: {
      proGuid: String,
      proName: String,
      limit: String
    },
    data () {
      return {
        imgUrl:'',
        codeUrl: '',
        show: true,
        isShow: false,
        loadBg: false,
        loadCode: false,
        shareShow: false,
        Phone: '',
      }
    },
    watch:{
      loadBg() {
        this.drawImg();
      },
      loadCode() {
        this.drawImg();
      },
    },
    mounted() {
      this.getQRcode();
    },
    methods: {
      loadBgImg() {
        this.loadBg = true;
      },
      loadQrcodeImg() {
        this.loadCode = true;
      },
      loadImg() {
        this.shareShow = true;
      },
      changeMobile() {
        let info = getStorage('info')
        this.Phone = info.phone
        // tel = "" + tel;
        // let reg = /(\d{3})\d{4}(\d{4})/;
        // this.Phone = tel.replace(reg, "$1****$2")
      },
      composeImg() {
        let qrcodeBg = document.getElementById("qrcodeProductBg");
        let qrcodeImg = document.getElementById("qrcodeProductImg");
        let c = document.createElement('canvas'),
          ctx = c.getContext('2d');
        c.width = 750;
        c.height = 1334;
        ctx.rect(0, 0, c.width, c.height);
        ctx.fillStyle = 'transparent'; //画布填充颜色
        ctx.beginPath();
        ctx.drawImage(qrcodeBg, 0, 0, 750, 1334);
        let hc_image = new Image();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 1094, 750, 240);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(32, 1127, 174, 174);
        ctx.drawImage(qrcodeImg, 36, 1131, 166, 166);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "36px Source Han Sans CN";
        ctx.fillText('凭发票收据', 104, 274);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "86px Source Han Sans CN";
        ctx.fillText(`最高提款${this.limit}万`, 104, 404);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Source Han Sans CN";
        ctx.fillText('一/次/授/信/额/度/循/环/使/用', 104, 472);
        ctx.fillStyle = "#EEEEEE";
        ctx.font = "36px Microsoft YaHei";
        ctx.fillText(this.proName, 104, 797);
        ctx.fillStyle = "#EEEEEE";
        ctx.font = "28px Microsoft YaHei";
        ctx.fillText('申请易 ── 纯线上无抵押', 104, 890);
        ctx.fillStyle = "#EEEEEE";
        ctx.font = "28px Microsoft YaHei";
        ctx.fillText('周期长 ── 24期灵活用', 104, 948);
        ctx.fillStyle = "#EEEEEE";
        ctx.font = "28px Microsoft YaHei";
        ctx.fillText('成本低 ── 日息低至万三', 104, 1004);
        ctx.fillStyle = "#DDDDDD";
        ctx.font = "28px Microsoft YaHei";
        ctx.fillText("推荐人 " + this.Phone, 258, 1173);
        ctx.font = "24px Microsoft YaHei";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText("向您推荐", 258, 1226);
        ctx.font = "24px Microsoft YaHei";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText("长按识别二维码快速申请", 258, 1277);
        hc_image.src = c.toDataURL("image/png");
        this.imgUrl =  hc_image.src;
      },
      getQRcode() {
        this.changeMobile();
        let domain = document.domain;
        let guid = getStorage('agentGuid')
        let url = `http://${domain}/enterprise/${this.proGuid}?guid=${guid}`
        let canvasCode = qrcanvas({
          data: decodeURIComponent(url),
          size: 300
        });
        this.codeUrl =  canvasCode.toDataURL();
      },
      drawImg() {
        if (this.loadBg && this.loadCode) {
          this.composeImg();
        }
      },
      close (){
        this.shareShow = false
        this.$emit('close')
      }
    }
  }

</script>
<style lang='less' scoped>
  .creat-img{
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    width: 263px;
    height: 388px;
    transform: translate(-50%, -50%);
    .img-bg {
      width: 100%;
      height: auto;
    }
    .img-code {
      position: absolute;
      left: 50%;
      top: 48%;
      z-index: 20;
      transform: translate(-50%, 0);
      height: 90px;
      width: 90px;
      margin-top: 7.5px;
      margin-left: -1.5px;
    }
    .creat-recommender {
      text-align: center;
      position: absolute;
      left: 0;
      top: 80%;
      color: #6776e6;
      font-size: 13px;
      font-weight: 600;
      width: 100%;
      z-index: 20;
      transform: translate(0, -50%);
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

