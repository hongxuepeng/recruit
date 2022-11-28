<template>
  <div class="enterprise-content">
    <div class="enterprise-form">
      <van-field v-model="form.name"
                 name="姓名"
                 label="姓名"
                 placeholder="请输入真实姓名"
                 input-align="right"/>
      <van-field v-model="form.idCard"
                 type="text"
                 name="身份证号码"
                 label="身份证号码"
                 placeholder="请输入身份证号码"
                 maxlength="18"
                 input-align="right"/>
      <van-field type="text"
                 class="enterprise-city"
                 readonly
                 name="展业城市"
                 label="展业城市">
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
      <van-field v-model="form.companyName"
                 name="从业公司"
                 label="从业公司"
                 placeholder="请输入从业公司"
                 input-align="right"/>
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
    Picker
  } from 'vant';
  import {
    bindRealName,
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
      [Picker.name]: Picker
    },
    data () {
      return {
        form: {
          companyName: '',
          name: '',
          idCard: ''
        },
        show: false,
        cityShow: false,
        province: {},
        city: {},
        columns: [],
        cityColumns: [],
        reg: {
          card: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/,
          name: /^[\u4e00-\u9fa5]+$/
        },
        loading: false,
        checked: false
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
        let { companyName, name, idCard } = this.form
        let params = {
          companyName,
          name,
          idCard,
          cityItem: this.city.itemId
        }
        let res = await bindRealName(params)
        if (+res.code === 1) {
          Notify({ type: 'success', message: '实名成功！'});
          this.$router.replace('index')
        }
      },
      checkSubmit () {
        let { companyName, name, idCard } = this.form
        if (!name) {
          Toast('请输入真实姓名');
        } else if (!this.reg.name.test(name)) {
          Toast('姓名只能输入中文');
        } else if (!idCard) {
          Toast('请输入身份证号码');
        } else if (!this.reg.card.test(idCard)) {
          Toast('请输入正确身份证号码');
        } else if (!this.city.itemId) {
          Toast('请选择城市');
        } else if (!companyName) {
          Toast('请输入从业公司');
        } else {
          this.onSubmit();
        }
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
    font-size: 13px;
    .enterprise-tips {
      padding: 12px 20px;
      background: #FEF4F3;
      display: flex;
      align-items: center;
      color: #666666;
      margin-bottom: 10px;
      /deep/ .van-icon {
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
      margin-top: 74px;
      padding: 0 10px;
    }
    .product-change {
      width: 200px;
      display: flex;
      justify-content: flex-end;
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
  }
</style>
