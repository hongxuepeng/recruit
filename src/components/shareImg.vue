<template>
    <div class="container" v-show="shareShow">
        <div class="share-img">
            <img :src="imgUrl" class="share-img-url">
            <img src="../assets/code_close.png" class="share-close" @click="shareShow = false" alt="">
        </div>
        <div class="creat-img" ref="box">
            <img src="../assets/enterprise_bg.png" class="img-bg" id="qrcodeBg" @load="loadBgImg">
            <img :src="codeUrl" class="img-code" id="qrcodeImg" @load="loadQrcodeImg">
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
                wxchat: ''
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
                if (this.imgUrl) {
                    this.shareShow = true;
                } else {
                    Toast('正在生成推广图片，稍后再试');
                }
            },
            changeMobile() {
                let info = getStorage('info')
                this.Phone = info.phone
                this.wxchat = info.wxchat
                // tel = "" + tel;
                // let reg = /(\d{3})\d{4}(\d{4})/;
                // this.Phone = tel.replace(reg, "$1****$2")
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
                ctx.font = "bold 64px Source Han Sans CN";
                ctx.textAlign = 'center';
                ctx.fillText(`蓝领高薪就职平台`, 380, 245);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "30px Source Han Sans CN";
                ctx.textAlign = 'center';
                ctx.fillText(`√ 公司直签有保障`, 380, 348);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "30px Source Han Sans CN";
                ctx.textAlign = 'center';
                ctx.fillText(`√ 全国合作企业100+`, 380, 416);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "30px Source Han Sans CN";
                ctx.textAlign = 'center';
                ctx.fillText(`√ 专业团队，一对一服务`, 380, 484);
                ctx.fillStyle = "#7882E0";
                ctx.font = "34px Microsoft YaHei";
                ctx.textAlign = 'center';
                ctx.fillText(`电话 ${that.Phone}`, 380, 929);
                if (this.wxchat) {
                    ctx.fillStyle = "#7882E0";
                    ctx.font = "34px Microsoft YaHei";
                    ctx.textAlign = 'center';
                    ctx.fillText(`微信号 ${this.wxchat}`, 380, 978);
                }
                ctx.fillStyle = "#CCCCCC";
                ctx.font = "30px Microsoft YaHei";
                ctx.textAlign = 'center';
                ctx.fillText(`河南同协人力资源服务有限公司`, 380, 1068);
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(234, 544, 292, 292);
                ctx.drawImage(qrcodeImg, 240, 550, 280, 280);
                hc_image.src = c.toDataURL("image/png");
                that.imgUrl =  hc_image.src;
            },
            getQRcode() {
                this.changeMobile();
                let domain = document.domain;
                let guid = getStorage('agentGuid')
                let url = `http://${domain}/index?guid=${guid}`
                console.log(url)
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

