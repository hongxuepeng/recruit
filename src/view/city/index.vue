<template>
  <div class="enterprise-content">
    <div class="enterprise-tips">
      <van-icon name="warning-o" />
      <span>若您所推荐的城市伙伴成功合作，您将获得神秘大奖。 注：所提供的信息，请务必真实准确。</span>
    </div>
    <div class="enterprise-form">
      <van-field v-model="form.name"
                 name="姓名"
                 label="姓名"
                 placeholder="请输入对方姓名"
                 input-align="right"/>
      <van-field v-model="form.phone"
                 maxlength="11"
                 type="number"
                 name="联系电话"
                 label="联系电话"
                 placeholder="请输入对方联系电话"
                 input-align="right"/>
      <van-field v-model="form.duty"
                 name="职务"
                 label="职务"
                 placeholder="请输入对方职务"
                 input-align="right"/>
      <van-field v-model="form.companyName"
                 name="公司名称"
                 label="公司名称"
                 placeholder="请输入对方公司名称"
                 input-align="right"/>
      <van-field type="text"
                 class="enterprise-city"
                 readonly
                 name="所在城市"
                 label="所在城市">
        <template #button>
          <div class="product-change">
            <div class="product-change-select" @click="show = true">
              <div class="product-change-result">{{province.name || '选择省份'}}</div>
              <van-icon name="arrow-down" />
            </div>
            <div class="product-change-select" @click="openCity">
              <div class="product-change-result">{{city.name || '选择城市'}}</div>
              <van-icon name="arrow-down" />
            </div>
          </div>
        </template>
      </van-field>
      <van-field readonly
                 clickable
                 name="公司人员数量"
                 :value="form.num"
                 label="公司人员数量"
                 placeholder="请选择"
                 input-align="right"
                 right-icon="arrow"
                 @click="numShow = true"/>
      <van-field readonly
                 class="product-money"
                 clickable
                 name="公司信用贷月均放款金额"
                 :value="form.money"
                 label="公司信用贷月均放款金额"
                 placeholder="请选择"
                 input-align="right"
                 right-icon="arrow"
                 @click="moneyShow = true"/>
    </div>
    <div class="city-record">
      <div @click="handleDetail">推荐记录>></div>
    </div>
    <div class="enterprise-footer-btn">
      <van-button round
                  block
                  color="#B40900"
                  type="info"
                  :loading="loading"
                  @click="checkSubmit">提交</van-button>
    </div>
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
    <van-action-sheet v-model="numShow"
                      :actions="numColumns"
                      cancel-text="取消"
                      close-on-click-action
                      @select="onNumConfirm"/>
    <van-action-sheet v-model="moneyShow"
                      :actions="moneyColumns"
                      cancel-text="取消"
                      close-on-click-action
                      @select="onMoneyConfirm"/>
  </div>
</template>

<script>
  import {
    Icon,
    CellGroup,
    Field,
    Button,
    Toast,
    CountDown,
    Notify,
    Checkbox,
    Dialog,
    Popup,
    Picker,
    ActionSheet
  } from 'vant';
  import {
    cityRecommend,
    getProvince,
    getCity,
  } from "@/api/index";
  export default {
    components: {
      [Icon.name]: Icon,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [CountDown.name]: CountDown,
      [Notify.name]: Notify,
      [Checkbox.name]: Checkbox,
      [Dialog.name]: Dialog,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [ActionSheet.name]: ActionSheet
    },
    data () {
      return {
        form: {
          companyName: '',
          name: '',
          phone: '',
          duty: '',
          num: '',
          money: ''
        },
        numColumns: [{ name: '10人以内' }, { name: '10-50人' }, { name: '50人以上' }],
        moneyColumns: [{ name: '200万以内' }, { name: '200-500万' }, { name: '500-1500万' }, { name: '1500万以上' }],
        show: false,
        cityShow: false,
        province: {},
        city: {},
        columns: [],
        cityColumns: [],
        reg: {
          mobile: /^1\d{10}$/,
          card: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
        },
        loading: false,
        checked: false,
        numShow: false,
        moneyShow: false
      }
    },
    created () {
      this.getProvince()
    },
    methods: {
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
      async onSubmit () {
        let { companyName, name, phone, duty, num, money } = this.form
        let params = {
          companyName,
          name,
          phone,
          post: duty,
          personnelNum: num,
          loanMoney: money,
          cityItem: this.city.itemId
        }
        let res = await cityRecommend(params)
        if (+res.code === 1) {
          Notify({ type: 'success', message: res.msg || '提交成功！'});
          this.form = {
            companyName: '',
            name: '',
            phone: '',
            duty: '',
            num: '',
            money: ''
          }
          this.province = {}
          this.city = {}
        }
      },
      checkSubmit () {
        let { companyName, name, phone, duty, num, money } = this.form
        if (!name) {
          Toast('请输入姓名');
        } else if (!phone) {
          Toast('请输入联系电话');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确联系电话');
        } else if (!duty) {
          Toast('请输入职务');
        } else if (!companyName) {
          Toast('请输入公司名称');
        } else if (!this.city.itemId) {
          Toast('请选择城市');
        } else if (!num) {
          Toast('请选择公司人员数量');
        } else if (!money) {
          Toast('请选择公司信用贷月均放款金额');
        } else {
          this.onSubmit();
        }
      },
      handleDetail () {
        this.$router.push('detail')
      },
      onNumConfirm (item) {
        this.form.num = item.name;
        this.numShow = false;
      },
      onMoneyConfirm (item) {
        this.form.money = item.name;
        this.moneyShow = false;
      }
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
  .enterprise-content {
    /deep/ .van-field__right-icon {
      color: #AAAAAA;
      padding-right: 4px;
    }
    font-size: 13px;
    .city-record {
      display: flex;
      justify-content: flex-end;
      color: #E05D56;
      margin-top: 20px;
      padding: 0 25px;
    }
    .enterprise-tips {
      padding: 12px 20px;
      background: #FEF4F3;
      display: flex;
      color: #666666;
      margin-bottom: 10px;
      line-height: 21px;
      /deep/ .van-icon {
        position: relative;
        top: 3px;
        font-size: 16px;
        margin-right: 6px;
      }
    }
    .enterprise-footer-clause {
      font-size: 12px;
      color: #555555;
      padding: 0 16px;
      margin-top: 30px;
      /deep/ .van-checkbox__icon {
        font-size: 14px;
        line-height: 14px;
      }
      .van-icon-question-o {
        position: relative;
        top: 3px;
        font-size: 15px;
        color: #999999;
      }
    }
    /deep/ .van-count-down {
      color: #ffffff;
    }
    /deep/ .van-field__label {
      width: 140px;
    }
    .enterprise-form {
      box-shadow: 0px 1px 7px 0px rgba(125, 124, 124, 0.15);
      /deep/ .van-button--small {
        width: 80px;
      }
    }
    .enterprise-footer-tips {
      font-size: 12px;
      color: #999999;
      margin-top: 16px;
      padding: 0 16px;
    }
    .enterprise-footer-btn {
      margin-top: 30px;
      padding: 0 10px;
    }
    .product-change {
      width: 200px;
      display: flex;
      justify-content: flex-end;
      padding-right: 4px;
    }
    .product-change-select {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 4px;
      flex: 1;
      &:last-child {
        margin-left: 15px;
      }
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
    .enterprise-city {
      /deep/ .van-field__body {
        justify-content: flex-end;
      }
      /deep/ .van-field__control {
        display: none;
      }
      /deep/ .van-field__button {
        padding-left: 0;
        padding-right: 0;
      }
    }
    .product-money {
      /deep/ .van-field__label {
        width: 160px;
      }
    }
  }
</style>
