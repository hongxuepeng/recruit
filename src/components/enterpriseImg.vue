<template>
  <div class="container" v-show="shareShow">
    <div class="share-img">
      <img :src="imgUrl" class="share-img-url">
      <img src="../assets/code_close.png" class="share-close" @click="close" alt="">
    </div>
    <div class="creat-img" ref="box">
      <img src="../assets/enterprise_bg.png" class="img-bg" id="qrcodeBg" @load="loadBgImg">
      <img class="img-code" id="qrcodeImg" crossOrigin="anonymous" :src="codeUrl" @load="loadQrcodeImg">
      <div class="creat-recommender">推荐人{{phone}}</div>
    </div>
    <van-overlay :show="true"/>
  </div>
</template>

<script>
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
      href: String,
      limit: String,
      proName: String,
      phone: String
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
      composeImg() {
        let that = this;
        let qrcodeBg = document.getElementById("qrcodeBg");
        let qrcodeImg = document.getElementById("qrcodeImg");
        let c = document.createElement('canvas'),
          ctx = c.getContext('2d');
        c.width = 760;
        c.height = 1120;
        ctx.rect(0, 0, c.width, c.height);
        ctx.fillStyle = 'transparent'; //画布填充颜色
        ctx.beginPath();
        ctx.drawImage(qrcodeBg, 0, 0, 760, 1120);
        var hc_image = new Image();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 86px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`最高提款${that.limit}万`, 380, 245);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`√ 纯线上无抵押`, 380, 348);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`√ 成本低 周期长`, 380, 416);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`√ 一次授信额度可循环使用`, 380, 484);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "34px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`产品名称：${that.proName}`, 380, 900);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "34px Source Han Sans CN";
        ctx.textAlign = 'center';
        ctx.fillText(`推荐人：${that.phone}`, 380, 969);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(234, 544, 292, 292);
        ctx.drawImage(qrcodeImg, 234, 544, 292, 292);
        hc_image.src = c.toDataURL("image/png");
        that.imgUrl =  hc_image.src;
      },
      getQRcode() {
        this.codeUrl = this.href;
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
    width: 70%;
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

