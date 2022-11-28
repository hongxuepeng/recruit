<template>
  <div class="product-content">
    <div class="product-header">
      <img src="@/assets/product_bg.png">
      <div class="product-header-box">
        <div class="product-header-title">我们已为 <span>1000000</span> 位客户</div>
        <div class="product-header-content">提供资金服务</div>
      </div>
      <div class="person-btn" v-if="token" @click="handlePerson">
        <span>个人中心</span>
        <van-icon name="arrow" />
      </div>
    </div>
    <ul class="product-list">
      <li v-for="item in list" :key="item.productId">
        <div class="product-list-header">
          <div class="product-list-title">{{item.productname}}</div>
          <div class="product-list-icon" v-for="val in item.lablelist" :key="val">{{val}}</div>
          <div class="product-list-btn" @click.stop="handleCode(item)">点击推广</div>
        </div>
        <div class="product-list-content">
          <div class="product-list-item">
            <div class="product-list-num">{{item.limit}}万</div>
            <div class="product-list-text">最高额度（元）</div>
          </div>
          <div class="product-list-item">
            <div class="product-list-num">{{item.cycle}}</div>
            <div class="product-list-text">期限</div>
          </div>
          <div class="product-list-item">
            <div class="product-list-num">{{item.interestRate}}</div>
            <div class="product-list-text">年利率</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getStorage } from '@/libs/utils';
  import {
    getProduct
  } from "@/api/index";
  import {
    Icon,
    Picker,
    Popup,
    Notify,
    Toast,
    Dialog
  } from 'vant';
  export default {
    components: {
      [Icon.name]: Icon,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Notify .name]: Notify,
      [Toast .name]: Toast,
      [Dialog .name]: Dialog
    },
    data () {
      return {
        show: false,
        list: [],
        info: {},
        token: getStorage('token')
      }
    },
    methods: {
      /**
       * 获取产品列表
       */
      async getProduct () {
        let params = {}
        let res = await getProduct(params)
        this.list = res.info
      },
      /**
       * 推广
       */
      handleCode (item) {
        if(!this.token) {
          Dialog.confirm({
            title: '温馨提示',
            message: '您还没登录，请前往登录页进行登录。',
            confirmButtonColor: '#B40900'
          }).then(() => {
            this.$router.push({
              name: 'login',
              query: {
                redirect: '/recommend'
              }
            });
          })
          return
        }
        if (!this.info.isRealName) {
          Dialog.confirm({
            title: '温馨提示',
            message: '您还没实名认证，如果要发展代理或者进行产品推广，需要先进行实名认证才可以。',
            confirmButtonColor: '#B40900'
          }).then(() => {
            this.$router.push('enterprise');
          })
        } else {
          Dialog.confirm({
            title: '温馨提示',
            message: '请在点击【确定】后弹出的界面，输入瑞池进件系统的手机号码和密码进行绑定邀请客户，未注册瑞池进件系统的代理请在界面上操作注册。',
            confirmButtonColor: '#B40900'
          }).then(() => {
            window.location.href = item.qrCodeUrl
          })
        }
      },
      /**
       * 个人中心
       */
      handlePerson () {
        this.$router.push('index');
      },
    },
    created () {
      this.info = getStorage('info')
      this.getProduct()
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
  .product-content {
    .product-header {
      position: relative;
      font-size: 0;
      img {
        width: 100%;
        height: auto;
      }
      .product-header-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #FFFFFF;
        width: 100%;
        font-size: 18px;
        line-height: 18px;
        font-weight: 500;
        padding-top: 8px;
        letter-spacing: 2px;
        .product-header-title {
          margin-bottom: 18px;
          span {
            font-size: 24px;
          }
        }
      }
      .person-btn {
        position: absolute;
        right: 0;
        top: 14px;
        font-size: 12px;
        height: 24px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 24px 0px 0px 24px;
        padding: 0 8px;
        .van-icon-arrow {
          position: relative;
          top: 1px;
        }
      }
    }
    .product-grid {
      display: flex;
      background: #ffffff;
      padding-top: 20px;
      padding-bottom: 24px;
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
        .product-grid-title {
          color: #333333;
          margin-top: 12px;
        }
      }
    }
    .product-change {
      background: #ffffff;
      padding: 12px;
      margin-top: 10px;
      .product-change-item {
        display: flex;
        font-size: 12px;
        color: #333333;
        align-items: center;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .product-change-name {
        }
        .product-change-default {
          margin-left: 10px;
          padding: 4px;
          &.product-change-all {
            background: #FFF4F3;
            color: #B40900;
          }
        }
        .product-change-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px;
          margin-left: 15px;
          border-bottom: 1px solid #A6A6A6;
          /deep/ .van-icon {
            margin-left: 10px;
          }
          .product-change-result {
            max-width: 80px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .product-list {
      padding: 10px;
      font-size: 12px;
      li {
        background: #ffffff;
        box-shadow: 0px 1px 9px 0px rgba(125, 124, 124, 0.28);
        border-radius: 3px;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .product-list-header {
          position: relative;
          height: 50px;
          display: flex;
          border-bottom: 1px solid #F5F5F5;
          align-items: center;
          padding-left: 20px;
          padding-right: 86px;
          .product-list-title {
            font-size: 16px;
            font-weight: 600;
            max-width: 160px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .product-list-icon {
            padding: 4px;
            background: #FFF2EE;
            color: #FE6432;
            margin-left: 14px;
            border-radius: 3px;
          }
          .product-list-btn {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            width: 58px;
            height: 24px;
            background: #B40900;
            border-radius: 3px;
            font-size: 12px;
            text-align: center;
            line-height: 24px;
            color: #ffffff;
          }
        }
        .product-list-content {
          display: flex;
          .product-list-item {
            flex: 1;
            padding: 20px 0 20px 20px;
            .product-list-num {
              font-size: 14px;
              color: #555555;
              margin-bottom: 12px;
            }
            .product-list-text {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
    }
  }
</style>
