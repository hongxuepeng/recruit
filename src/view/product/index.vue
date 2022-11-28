<template>
  <div class="product-content">
    <div class="product-header">
      <img src="@/assets/product_bg.png">
      <div class="person-btn" @click="handlePerson">个人中心<van-icon name="arrow" /></div>
    </div>
    <ul class="product-grid">
      <li @click="handleAllCode">
        <img src="@/assets/product_1.png">
        <div class="product-grid-title">推广二维码</div>
      </li>
      <li @click="handleRecommend">
        <img src="@/assets/product_2.png">
        <div class="product-grid-title">我的推荐</div>
      </li>
      <li @click="handleInvoice">
        <img src="@/assets/product_3.png">
        <div class="product-grid-title">采集发票</div>
      </li>
    </ul>
    <div class="product-change">
      <div class="product-change-item">
        <div class="product-change-name">企业地址</div>
        <div class="product-change-default" :class="{'product-change-all' : !province.name}" @click="bindAll">全国</div>
        <div class="product-change-select" @click="show = true">
          <div class="product-change-result">{{province.name || '选择省份'}}</div>
          <van-icon name="arrow-down" />
        </div>
        <div class="product-change-select" @click="openCity">
          <div class="product-change-result">{{city.name || '选择城市'}}</div>
          <van-icon name="arrow-down" />
        </div>
      </div>
      <div class="product-change-item">
        <div class="product-change-name">产品类型</div>
        <div class="product-change-default"
             :class="{'product-change-all': typeActive === item.type}"
             @click="typeChange(item)"
             v-for="item in typeList"
             :key="item.type">{{item.name}}</div>
      </div>
    </div>
    <ul class="product-list">
      <li v-for="item in list" :key="item.productId" @click="handleDetail(item.productId)">
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
    <van-popup v-model="show" round position="bottom">
      <van-picker title="省份"
                  show-toolbar
                  :columns="columns"
                  value-key="name"
                  @confirm="onConfirm"
                  @cancel="onCancel"/>
    </van-popup>
    <van-popup v-model="cityShow" round position="bottom">
      <van-picker title="城市"
                  show-toolbar
                  :columns="cityColumns"
                  value-key="name"
                  @confirm="onCityConfirm"
                  @cancel="onCityCancel"/>
    </van-popup>
    <compose-img ref="composeImg"></compose-img>
    <product-img ref="productImg"
                 v-if="imgShow"
                 :proGuid="proGuid"
                 :proName="proName"
                 :limit="limit"
                 @close="close"></product-img>
  </div>
</template>

<script>
  import { getStorage } from '../../libs/utils';
  import {
    getProvince,
    getCity,
    getProduct
  } from "@/api/index";
  import {
    Icon,
    Picker,
    Popup,
    Notify,
    Toast
  } from 'vant';
  import productImg from '@/components/productImg.vue'
  import composeImg from '@/components/shareImg.vue'
  export default {
    components: {
      [Icon.name]: Icon,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Notify .name]: Notify,
      [Toast .name]: Toast,
      productImg,
      composeImg
    },
    data () {
      return {
        show: false,
        cityShow: false,
        province: {},
        city: {},
        columns: [],
        cityColumns: [],
        typeActive: 0,
        protype: '',
        proGuid: '',
        proName: '',
        limit: '',
        imgShow: false,
        typeList: [
          {
            name: '全部',
            type: 0
          }, {
            name: '税贷',
            type: 1
          }, {
            name: '发票贷',
            type: 2
          }, {
            name: '其他',
            type: 3
          }
        ],
        list: []
      }
    },
    methods: {
      /**
       * 选择全国，清空省份、城市
       */
      bindAll () {
        this.province = {}
        this.city = {}
        this.getProduct()
      },
      /**
       * 获取省份
       */
      async getProvince () {
        let res = await getProvince()
        if(+res.code === 1) {
          this.columns = res.info
        }
      },
      /**
       * 获取城市
       */
      async getCity () {
        let { itemId } = this.province
        let res = await getCity({ proItemId: itemId })
        if(+res.code === 1) {
          this.cityColumns = res.info
        }
      },
      /**
       * 省份确认
       */
      onConfirm (val) {
        this.province = val
        this.city = {}
        this.getProduct()
        this.getCity()
        this.show = false
      },
      /**
       * 省份取消
       */
      onCancel () {
        this.show = false
      },
      /**
       * 城市确认
       */
      onCityConfirm (val) {
        this.city = val
        this.getProduct()
        this.cityShow = false
      },
      /**
       * 城市取消
       */
      onCityCancel () {
        this.cityShow = false
      },
      /**
       * 打开城市选择
       */
      openCity () {
        if (!this.cityColumns.length) {
          Notify({ type: 'warning', message: '请先选择省份！'});
          return
        }
        this.cityShow = true
      },
      /**
       * 产品类型切换
       */
      typeChange (item) {
        this.typeActive = item.type
        this.protype = item.name === '全部' ? '' : item.name
        this.getProduct()
      },
      /**
       * 我的推荐
       */
      handleRecommend () {
        this.$router.push('recommend');
      },
      /**
       * 个人中心
       */
      handlePerson () {
        this.$router.push('index');
      },
      /**
       * 产品详情
       */
      handleDetail (id) {
        let agentGuid = getStorage('agentGuid');
        this.$router.push(`product-detail/${id}?guid=${agentGuid}`);
      },
      /**
       * 获取产品列表
       */
      async getProduct () {
        let params = {
          proItemId: this.province.itemId,
          cityItemId: this.city.itemId,
          identityType: 'agent',
          protype: this.protype || ''
        }
        let res = await getProduct(params)
        this.list = res.info
      },
      /**
       * 推广二维码
       */
      handleCode (item) {
        this.proGuid = item.productId
        this.proName = item.productname
        this.limit = item.limit
        this.imgShow = true
        this.$nextTick(() => {
          this.$refs.productImg.loadImg();
        })
      },
      handleAllCode () {
        this.$refs.composeImg.loadImg();
      },
      /**
       * 关闭二维码
       */
      close () {
        this.imgShow = false
      },
      /**
       * 采集发票
       */
      handleInvoice () {
        this.$router.push('invoice');
      },
    },
    created () {
      this.getProvince()
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
