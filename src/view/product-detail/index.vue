<template>
  <div class="product-detail-box" v-if="info">
    <div class="product-detail-header">
      <div class="product-detail-img">
        <img src="@/assets/product_detail_bg.png">
        <div class="product-detail-content">
          <div class="product-detail-title">
            <div class="product-detail-text">{{info.productname}}</div>
            <div class="product-detail-tips" v-for="item in info.lablelist" :key="item">{{item}}</div>
            <div class="product-detail-num">{{info.applyCount}}人申请过</div>
          </div>
          <ul class="product-detail-grid">
            <li>
              <div>{{info.limit}}万</div>
              <div class="product-detail-grid-name">额度</div>
            </li>
            <li>
              <div>{{info.cycle}}</div>
              <div class="product-detail-grid-name">期限</div>
            </li>
            <li>
              <div>{{info.interestRate}}</div>
              <div class="product-detail-grid-name">年利率</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="product-detail-content-box">
      <div class="product-detail-strategy" v-if="+info.isHaveStrategy === 1">
        <div class="product-detail-section-title">
          <div>产品攻略</div>
          <div class="product-detail-strategy-tips">从申请到提款，手把手教学</div>
        </div>
        <div class="product-detail-strategy-list">
          <a v-for="(item, index) in info.productStrategy"
             :key="index"
             :href="item.url">
            <div class="product-detail-strategy-icon"><img src="@/assets/tips_icon.png">{{item.name}}</div>
            <img class="product-detail-strategy-right" src="@/assets/right.png">
          </a>
        </div>
      </div>
      <div class="product-detail-section">
<!--        <div class="product-detail-section-title">产品详情</div>-->
<!--        <div>{{info.productDetail}}</div>-->
<!--        <div class="product-detail-line"></div>-->
<!--        <div class="product-detail-section-title">准入条件</div>-->
<!--        <div class="product-detail-section-list" v-html="info.entryCriteria"></div>-->
<!--        <div class="product-detail-line"></div>-->
<!--        <div class="product-detail-section-title">申请资料</div>-->
<!--        <div class="product-detail-section-list" v-html="info.applymaterials"></div>-->
        <div v-html="info.detail"></div>
        <div class="product-detail-line"></div>
        <div class="product-detail-section-title">申请流程</div>
        <ul class="product-detail-icon">
          <li>
            <img src="@/assets/apply_icon_1.png" class="product-detail-icon-img">
            <div class="product-detail-icon-title">填写资料</div>
            <img src="@/assets/left.png" class="product-detail-icon-left">
          </li>
          <li>
            <img src="@/assets/apply_icon_2.png" class="product-detail-icon-img">
            <div class="product-detail-icon-title">授权数据</div>
            <img src="@/assets/left.png" class="product-detail-icon-left">
          </li>
          <li>
            <img src="@/assets/apply_icon_3.png" class="product-detail-icon-img">
            <div class="product-detail-icon-title">线上审批</div>
            <img src="@/assets/left.png" class="product-detail-icon-left">
          </li>
          <li>
            <img src="@/assets/apply_icon_4.png" class="product-detail-icon-img">
            <div class="product-detail-icon-title">极速放款</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="product-detail-box-btn">
      <van-button type="primary"
                  color="#B40900"
                  @click="handleEnterprise"
                  round
                  block>立即申请</van-button>
    </div>
  </div>
</template>

<script>
  import {
    Button
  } from 'vant';
  import {
    getProductDetails
  } from "@/api/index";
  export default {
    components: {
      [Button.name]: Button
    },
    data () {
      return {
        proGuid: '',
        info: null
      }
    },
    methods: {
      handleEnterprise () {
        let { guid } = this.$route.query
        let { id } = this.$route.params
        if (guid) {
          this.$router.push(`/enterprise/${id}?guid=${guid}`);
        } else {
          this.$router.push(`/enterprise/${id}`)
        }
      },
      async getProductDetails () {
        let res = await getProductDetails({ proGuid: this.$route.params.id })
        if (+res.code === 1) {
          this.info = res.info
        }
      },
      // changeText (text) {
      //   if (text) {
      //     let reg = new RegExp('\\r\\n', 'g')
      //     text = text.replace(reg, '<br/>')
      //   }
      //   console.log(text)
      //   return text
      // }
    },
    created () {
      this.getProductDetails()
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
  .product-detail-box {
    font-size: 13px;
    .product-detail-header {
      padding: 10px;
      background: #ffffff;
      .product-detail-img {
        font-size: 0px;
        position: relative;
        img {
          width: 100%;
          height: auto;
        }
        .product-detail-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
          .product-detail-title {
            position: relative;
            display: flex;
            width: 100%;
            align-items: center;
            padding-left: 30px;
            .product-detail-text {
              color: #ffffff;
              font-size: 15px;
              font-weight: 400;
              max-width: 140px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .product-detail-tips {
              font-size: 12px;
              padding: 3px 6px;
              background: #FE6432;
              color: #ffffff;
              border-radius: 3px;
              margin-left: 10px;
            }
            .product-detail-num {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(0, 0, 0, 0.5);
              color: #fff;
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              padding: 0 10px;
              border-radius: 24px 0px 0px 24px;
            }
          }
          .product-detail-grid {
            display: flex;
            width: 100%;
            font-size: 14px;
            margin-top: 20px;
            li {
              flex: 1;
              padding-left: 30px;
              color: #ffffff;
              .product-detail-grid-name {
                font-size: 12px;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
    .product-detail-content-box {
      padding: 10px 10px 0 10px;
      .product-detail-strategy {
        padding: 18px 10px 10px 10px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
        border-radius: 3px;
        margin-bottom: 10px;
        .product-detail-section-title {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .product-detail-strategy-tips {
            font-size: 10px;
            padding: 3px;
            color: #FE6432;
            background: #FFF2EE;
            border-radius: 3px;
            margin-left: 12px;
          }
        }
        .product-detail-strategy-list {
          a {
            display: block;
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            .product-detail-strategy-right {
              height: 11px;
              width: auto;
            }
            .product-detail-strategy-icon {
              flex: 1;
              color: #555555;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              img {
                height: 10px;
                width: auto;
                margin-right: 4px;
              }
            }
          }
        }
      }
      .product-detail-section-title {
        position: relative;
        color: #333333;
        font-size: 14px;
        padding-left: 15px;
        margin-bottom: 16px;
        &:before {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          content: '';
          width: 3px;
          height: 15px;
          background: #B40900;
        }
      }
      .product-detail-section {
        padding: 18px 10px 10px 10px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
        border-radius: 3px;
        color: #666666;
        font-size: 12px;
        .product-detail-section-label {
          margin-bottom: 12px;
          color: #555555;
        }
        .product-detail-line {
          height: 1px;
          background: #CCCCCC;
          margin-top: 28px;
          margin-bottom: 18px;
        }
        .product-detail-section-list {
          line-height: 24px;
          margin-bottom: 28px;
        }
        .product-detail-icon {
          display: flex;
          li {
            position: relative;
            flex: 1;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            .product-detail-icon-left {
              position: absolute;
              width: 48px;
              height: auto;
              right: -24px;
              top: 15px;
            }
            .product-detail-icon-img {
              height: 30px;
              width: 30px;
            }
            .product-detail-icon-title {
              margin-top: 14px;
              color: #999999;
              font-size: 12px;
            }
          }
        }
      }
    }
    .product-detail-box-btn {
      padding: 24px 10px;
    }
  }
</style>
