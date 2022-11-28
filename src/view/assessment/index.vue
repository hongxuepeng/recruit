<template>
  <div class="enterprise-content">
    <div class="enterprise-form">
      <van-field v-model="form.phone"
                 maxlength="11"
                 type="number"
                 name="手机号码"
                 label="手机号码"
                 placeholder="请输入手机号码"
                 input-align="right"/>
      <van-field v-model="form.name"
                 type="text"
                 name="实控人"
                 label="实控人"
                 placeholder="实控人"
                 input-align="right"/>
      <van-field v-model="form.idCard"
                 type="text"
                 name="实控人身份证号码"
                 label="实控人身份证号码"
                 placeholder="实控人身份证号码"
                 maxlength="18"
                 input-align="right"/>
      <van-field v-model="form.companyName"
                 name="公司名称"
                 label="公司名称"
                 placeholder="请输入公司名称"
                 input-align="right"/>
      <van-field v-model="form.creditCode"
                 type="text"
                 name="统一社会信用代码"
                 label="统一社会信用代码"
                 placeholder="统一社会信用代码"
                 maxlength="18"
                 input-align="right"/>
      <van-field v-model="form.expectedLimit"
                 type="number"
                 name="上一年净利润"
                 label="上一年净利润(元)"
                 placeholder="请输入上一年净利润"
                 input-align="right"/>
      <van-field v-model="form.netProfit"
                 type="number"
                 name="期望额度"
                 label="期望额度(元)"
                 placeholder="请输入期望额度"
                 input-align="right"/>
    </div>
    <div class="assessment-result" v-if="form.result">
      <van-field v-model="form.result"
                 name="评估结果"
                 label="评估结果"
                 readonly
                 input-align="right"/>
    </div>
    <div class="enterprise-footer-btn">
      <van-button round
                  block
                  color="#B40900"
                  type="info"
                  :loading="loading"
                  @click="checkSubmit">{{form.result ?  '重新评估' : '提交'}}</van-button>
    </div>
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
    Dialog
  } from 'vant';
  import {
    getApplyMeasure
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
      [Dialog.name]: Dialog
    },
    data () {
      return {
        form: {
          companyName: '',
          creditCode: '',
          name: '',
          idCard: '',
          code: '',
          phone: '',
          expectedLimit: '',
          netProfit: '',
          result: ''
        },
        reg: {
          mobile: /^1\d{10}$/,
          code: /^\d{6}$/,
          password: /^(\w){6,20}$/,
          card: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/,
          credit: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
        },
        time: 60000,
        codeText: '发送验证码',
        codeDisabled: false,
        loading: false,
        checked: false,
        href: '',
        limit: '',
        proName: '',
        phone: '',
        imgShow: false
      }
    },
    methods: {
      async onSubmit () {
        let { companyName, creditCode, name, idCard, phone, expectedLimit, netProfit } = this.form
        let params = {
          companyName,
          creditCode,
          name,
          idCard,
          phone,
          expectedLimit,
          netProfit
        }
        let res = await getApplyMeasure(params)
        if (+res.code === 1 && res.info) {
          this.form.result = `￥${res.info.limit}`
          Notify({ type: 'success', message: '评估成功！'});
        } else {
          this.form.result = ''
        }
      },
      checkSubmit () {
        let { companyName, creditCode, name, idCard, phone, expectedLimit, netProfit } = this.form
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else if (!name) {
          Toast('请输入实控人');
        } else if (!idCard) {
          Toast('请输入实控人身份证号码');
        } else if (!this.reg.card.test(idCard)) {
          Toast('请输入正确身份证号码');
        } else if (!companyName) {
          Toast('请输入公司名称');
        } else if (!creditCode) {
          Toast('请输入统一社会信用代码');
        } else if (!this.reg.credit.test(creditCode)) {
          Toast('请输入正确统一社会信用代码');
        } else if (!expectedLimit) {
          Toast('请输入上一年净利润');
        } else if (!netProfit) {
          Toast('请输入期望额度');
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
    .assessment-result {
      margin-top: 15px;
      /deep/ .van-field__control {
        color: #B40900;
      }
    }
  }
</style>
