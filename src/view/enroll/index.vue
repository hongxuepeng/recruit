<template>
  <div class="enterprise-content">
    <div class="enterprise-form">
      <van-field v-model="form.name"
                 type="text"
                 name="姓名"
                 label="姓名"
                 placeholder="请输入姓名"
                 input-align="right"/>
      <van-field v-model="form.idCard"
                 type="text"
                 name="身份证号码"
                 label="身份证号码"
                 placeholder="请输入身份证号码"
                 maxlength="18"
                 input-align="right"/>
      <van-field name="gender"
                 label="性别">
        <template #input>
          <van-radio-group v-model="form.sex" direction="horizontal">
            <van-radio name="男">男</van-radio>
            <van-radio name="女">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="form.phone"
                 maxlength="11"
                 type="number"
                 name="手机号码"
                 label="手机号码"
                 placeholder="请输入手机号码"
                 input-align="right"/>
      <van-field v-model="form.code"
                 type="number"
                 clearable
                 center
                 maxlength="6"
                 label="验证码"
                 input-align="right"
                 placeholder="请输入验证码">
        <template #button>
          <van-button size="small"
                      color="#1976FA"
                      type="primary"
                      @click="checkSend"
                      v-if="!codeDisabled">{{codeText}}</van-button>
          <van-button size="small"
                      disabled
                      color="#1976FA"
                      type="primary"
                      v-else>
            <van-count-down ref="countDown" :time="time" :auto-start="false" @finish="finished">
              <template v-slot="timeData">
                <small class="send-text">已发送</small>
                <span class="item">{{ timeData.seconds }}</span>
                <small>s</small>
              </template>
            </van-count-down>
          </van-button>
        </template>
      </van-field>
    </div>
    <div class="enterprise-footer-btn">
      <van-button round
                  block
                  color="#1976FA"
                  type="info"
                  :loading="loading"
                  @click="checkSubmit">{{'提交'}}</van-button>
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
    Dialog,
    RadioGroup,
    Radio
  } from 'vant';
  import {
    applyProduct,
    getCode
  } from "@/api/index";
  import { getSessionStorage } from '@/libs/utils';
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
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio
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
          result: '',
          sex: ''
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
        imgShow: false,
        invitorGuid: getSessionStorage('parentAgentGuid')
      }
    },
    methods: {
      async onSubmit () {
        let { sex, name, idCard, phone, code } = this.form
        let params = {
          invitorGuid: this.invitorGuid,
          sex,
          name,
          idCard,
          receivePhone: phone,
          proGuid: this.$route.params.id,
          code
        }
        let res = await applyProduct(params)
        if (+res.code === 1) {
          Notify({ type: 'success', message: res.msg || '申请成功！'});
          this.$router.go(-1)
        }
      },
      checkSubmit () {
        let { name, idCard, phone, code, sex } = this.form
        if (!name) {
          Toast('请输入姓名');
        } else if (!idCard) {
          Toast('请输入身份证号码');
        } else if (!sex) {
          Toast('请选择性别');
        } else if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else if (!code) {
          Toast('请输入验证码');
        } else if (!this.reg.code.test(code)) {
          Toast('请输入6位验证码');
        } else {
          this.onSubmit();
        }
      },
      checkSend() {
        let { phone } = this.form
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else {
          this.sendCode();
        }
      },
      async sendCode() {
        let { phone } = this.form
        let res = await getCode({ Phone: phone })
        if (+res.code === 1) {
          this.codeDisabled = true;
          this.$nextTick(() => {
            this.$refs.countDown.start();
          });
        }
      },
      finished () {
        this.codeDisabled = false;
        this.codeText = '重新发送';
      },
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
    /deep/ .van-field__control--custom {
      justify-content: flex-end;
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
